package com.urea.selfservice.client;

import android.content.Context;
import android.content.SharedPreferences;

public final class Prefs {
    private static final String NAME = "urea_secure";
    private Prefs() {}

    private static SharedPreferences p(Context c) {
        return c.getSharedPreferences(NAME, Context.MODE_PRIVATE);
    }

    public static String serverUrl(Context c) {
        String v = p(c).getString("server_url", "");
        return cleanUrl(v);
    }
    public static boolean hasServer(Context c) { return !serverUrl(c).isEmpty(); }
    public static void setServerUrl(Context c, String v) { p(c).edit().putString("server_url", cleanUrl(v)).apply(); }
    public static String token(Context c) { return p(c).getString("token", ""); }
    public static void setToken(Context c, String v) { p(c).edit().putString("token", v == null ? "" : v).apply(); }
    public static String username(Context c) { return p(c).getString("username", ""); }
    public static void setUsername(Context c, String v) { p(c).edit().putString("username", v == null ? "" : v).apply(); }
    public static String amapKey(Context c) { return p(c).getString("amap_key", ""); }
    public static void setAmapKey(Context c, String v) { p(c).edit().putString("amap_key", v == null ? "" : v.trim()).apply(); }
    public static String latestVersionName(Context c) { return p(c).getString("latest_app_version_name", ""); }
    public static int latestVersionCode(Context c) { return p(c).getInt("latest_app_version_code", 0); }
    public static String latestApkUrl(Context c) { return p(c).getString("latest_apk_url", ""); }
    public static void setLatestApp(Context c, String name, int code, String apkUrl) {
        p(c).edit().putString("latest_app_version_name", name == null ? "" : name)
                .putInt("latest_app_version_code", code)
                .putString("latest_apk_url", apkUrl == null ? "" : apkUrl).apply();
    }
    public static boolean privacyAccepted(Context c) { return p(c).getBoolean("privacy_accepted", false); }
    public static void setPrivacyAccepted(Context c, boolean v) { p(c).edit().putBoolean("privacy_accepted", v).apply(); }
    public static void logout(Context c) { p(c).edit().remove("token").apply(); }

    public static String cleanUrl(String v) {
        if (v == null) return "";
        v = v.trim();
        while (v.endsWith("/")) v = v.substring(0, v.length() - 1);
        return v;
    }
}
