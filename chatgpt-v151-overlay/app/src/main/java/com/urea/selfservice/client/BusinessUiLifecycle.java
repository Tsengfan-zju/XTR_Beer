package com.urea.selfservice.client;

import android.app.Activity;
import android.app.Application;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

final class BusinessUiLifecycle implements Application.ActivityLifecycleCallbacks {
    private static final String PREFS = "device_business_snapshot_v1";
    private final Handler main = new Handler(Looper.getMainLooper());

    @Override public void onActivityResumed(Activity a) {
        String name = a.getClass().getSimpleName();
        if ("LoginActivity".equals(name)) {
            replaceBrand(a.findViewById(android.R.id.content));
        } else if ("DeviceSettingsActivity".equals(name)) {
            restoreSettings(a);
            main.postDelayed(() -> restoreSettings(a), 700);
            main.postDelayed(() -> restoreSettings(a), 1600);
        } else if ("DeviceDetailActivity".equals(name)) {
            main.postDelayed(() -> refreshPrice(a), 900);
            main.postDelayed(() -> refreshPrice(a), 1800);
        }
    }

    @Override public void onActivityPaused(Activity a) {
        if ("DeviceSettingsActivity".equals(a.getClass().getSimpleName())) saveSettings(a);
    }

    private void replaceBrand(View v) {
        if (v instanceof TextView) {
            TextView t = (TextView) v;
            if ("尿素智营".contentEquals(t.getText())) t.setText("智营管家");
        }
        if (v instanceof ViewGroup) {
            ViewGroup g = (ViewGroup) v;
            for (int i = 0; i < g.getChildCount(); i++) replaceBrand(g.getChildAt(i));
        }
    }

    private void restoreSettings(Activity a) {
        int id = a.getIntent().getIntExtra("device_id", 0);
        if (id <= 0) return;
        TextView title = a.findViewById(R.id.deviceParamHomeTitle);
        TextView action = a.findViewById(R.id.deviceParamBusinessAction);
        TextView unitMl = a.findViewById(R.id.deviceParamUnitMl);
        if (title == null || action == null || unitMl == null) return;
        SharedPreferences p = a.getSharedPreferences(PREFS, Activity.MODE_PRIVATE);
        if (empty(title)) setIfPresent(title, p.getString("home_title_" + id, ""));
        if (empty(action)) setIfPresent(action, p.getString("action_" + id, ""));
        if (empty(unitMl)) {
            int ml = p.getInt("unit_ml_" + id, 0);
            if (ml > 0) unitMl.setText(String.valueOf(ml));
        }
    }

    private void saveSettings(Activity a) {
        int id = a.getIntent().getIntExtra("device_id", 0);
        if (id <= 0) return;
        TextView title = a.findViewById(R.id.deviceParamHomeTitle);
        TextView action = a.findViewById(R.id.deviceParamBusinessAction);
        TextView unitMl = a.findViewById(R.id.deviceParamUnitMl);
        if (title == null || action == null || unitMl == null) return;
        String t = text(title), ac = text(action), mlText = text(unitMl);
        if (t.isEmpty() && ac.isEmpty() && mlText.isEmpty()) return;
        SharedPreferences.Editor e = a.getSharedPreferences(PREFS, Activity.MODE_PRIVATE).edit();
        if (!t.isEmpty()) e.putString("home_title_" + id, t);
        if (!ac.isEmpty()) e.putString("action_" + id, ac);
        try {
            int ml = Integer.parseInt(mlText);
            if (ml > 0) e.putInt("unit_ml_" + id, ml);
        } catch (Exception ignored) {}
        e.apply();
    }

    private void refreshPrice(Activity a) {
        int id = a.getIntent().getIntExtra("device_id", 0);
        if (id <= 0) return;
        int ml = a.getSharedPreferences(PREFS, Activity.MODE_PRIVATE).getInt("unit_ml_" + id, 0);
        if (ml <= 0) return;
        TextView price = a.findViewById(R.id.detailParamPrice);
        if (price == null) return;
        String raw = text(price);
        Matcher m = Pattern.compile("[¥￥]\\s*([0-9]+(?:\\.[0-9]+)?)\\s*/\\s*([^·]+)").matcher(raw);
        if (!m.find()) return;
        try {
            double value = Double.parseDouble(m.group(1));
            String unit = m.group(2).trim();
            price.setText(String.format(Locale.CHINA, "单价：￥%.2f/%s·%dmL", value, unit, ml));
        } catch (Exception ignored) {}
    }

    private static boolean empty(TextView v) { return text(v).isEmpty(); }
    private static String text(TextView v) { return v.getText() == null ? "" : v.getText().toString().trim(); }
    private static void setIfPresent(TextView v, String s) { if (s != null && !s.trim().isEmpty()) v.setText(s.trim()); }

    @Override public void onActivityCreated(Activity a, Bundle b) {}
    @Override public void onActivityStarted(Activity a) {}
    @Override public void onActivityStopped(Activity a) {}
    @Override public void onActivitySaveInstanceState(Activity a, Bundle b) {}
    @Override public void onActivityDestroyed(Activity a) {}
}
