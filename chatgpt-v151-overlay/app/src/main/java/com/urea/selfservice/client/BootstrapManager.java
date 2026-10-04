package com.urea.selfservice.client;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public final class BootstrapManager {
    public interface Callback {
        void onSuccess(JSONObject config);
        void onError(String message);
    }

    private static final ExecutorService EXECUTOR = Executors.newCachedThreadPool();
    private static final Handler MAIN = new Handler(Looper.getMainLooper());

    private BootstrapManager() {}

    public static String serverFromIntent(Intent intent) {
        if (intent == null) return "";
        Uri data = intent.getData();
        if (data == null) return "";
        if (!"ureaclient".equalsIgnoreCase(data.getScheme())) return "";
        if (!"bootstrap".equalsIgnoreCase(data.getHost())) return "";
        return Prefs.cleanUrl(data.getQueryParameter("server"));
    }

    public static void refresh(Context context, String candidateServer, Callback callback) {
        final Context app = context.getApplicationContext();
        final String base = Prefs.cleanUrl(candidateServer);
        if (!isHttpUrl(base)) {
            MAIN.post(() -> callback.onError("服务器配置无效"));
            return;
        }
        EXECUTOR.execute(() -> {
            HttpURLConnection c = null;
            try {
                URL url = new URL(base + "/api/app/bootstrap");
                c = (HttpURLConnection) url.openConnection();
                c.setRequestMethod("GET");
                c.setConnectTimeout(9000);
                c.setReadTimeout(12000);
                c.setRequestProperty("Accept", "application/json");
                int code = c.getResponseCode();
                InputStream in = code >= 200 && code < 300 ? c.getInputStream() : c.getErrorStream();
                String text = readAll(in);
                if (code < 200 || code >= 300) throw new Exception("服务器初始化失败（" + code + "）" + (text.isEmpty() ? "" : "：" + text));
                JSONObject config = new JSONObject(text);
                String resolved = Prefs.cleanUrl(config.optString("server_url", base));
                if (!isHttpUrl(resolved)) resolved = base;
                Prefs.setServerUrl(app, resolved);
                Prefs.setAmapKey(app, config.optString("amap_android_key", ""));
                JSONObject release = config.optJSONObject("app");
                if (release != null) {
                    Prefs.setLatestApp(app,
                            release.optString("version_name", ""),
                            release.optInt("version_code", 0),
                            release.optString("apk_url", config.optString("apk_url", "")));
                }
                MAIN.post(() -> callback.onSuccess(config));
            } catch (Exception e) {
                String msg = e.getMessage();
                if (msg == null || msg.trim().isEmpty()) msg = e.getClass().getSimpleName();
                final String finalMsg = msg;
                MAIN.post(() -> callback.onError(finalMsg));
            } finally {
                if (c != null) c.disconnect();
            }
        });
    }

    private static boolean isHttpUrl(String value) {
        return value != null && (value.startsWith("http://") || value.startsWith("https://"));
    }

    private static String readAll(InputStream in) throws Exception {
        if (in == null) return "";
        try (BufferedReader br = new BufferedReader(new InputStreamReader(in, StandardCharsets.UTF_8))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) sb.append(line).append('\n');
            return sb.toString().trim();
        }
    }
}
