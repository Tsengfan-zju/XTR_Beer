from pathlib import Path
import sys

root = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()

def read(rel):
    return (root / rel).read_text()

def write(rel, text):
    (root / rel).write_text(text)

s = read("app/build.gradle")
write("app/build.gradle", s.replace("versionCode 10", "versionCode 11").replace("versionName '1.5.4'", "versionName '1.5.5'"))

s = read("app/src/main/res/values/strings.xml")
write("app/src/main/res/values/strings.xml", s.replace("尿素智营", "智营管家"))

s = read("app/src/main/res/layout/activity_login.xml")
write("app/src/main/res/layout/activity_login.xml", s.replace('android:text="尿素智营"', 'android:text="@string/app_name"'))

p = "app/src/main/java/com/urea/selfservice/client/AppUpdateDownloader.java"
s = read(p)
write(p, s.replace("尿素智营", "智营管家"))

p = "app/src/main/java/com/urea/selfservice/client/DeviceSettingsActivity.java"
s = read(p)
old = '''                homeTitle.setText(firstNonEmpty(o.optString("home_title", ""), o.optString("ui_home_title", "")));
                businessAction.setText(firstNonEmpty(o.optString("action", ""), o.optString("business_action", ""), o.optString("ui_action", "")));
                unit.setText(o.optString("product_unit", "L"));
                int unitMlValue = o.has("unit_ml") ? o.optInt("unit_ml", 0) : o.optInt("pricing_unit_ml", 0);
                unitMl.setText(unitMlValue > 0 ? String.valueOf(unitMlValue) : "");
'''
new = '''                String serverTitle = firstNonEmpty(
                        o.optString("home_title", ""), o.optString("ui_home_title", ""),
                        o.optString("ui_title", ""), o.optString("title", ""), o.optString("homeTitle", ""));
                String serverAction = firstNonEmpty(
                        o.optString("business_action", ""), o.optString("ui_action", ""),
                        o.optString("action", ""), o.optString("action_name", ""), o.optString("businessAction", ""));
                int serverUnitMl = firstPositiveInt(o,
                        "unit_ml", "ui_unit_ml", "ui_unitml", "ml_per_unit", "pricing_unit_ml");
                android.content.SharedPreferences snapshot =
                        getSharedPreferences("device_business_snapshot_v1", MODE_PRIVATE);
                String cachedTitle = snapshot.getString("home_title_" + deviceId, "");
                String cachedAction = snapshot.getString("action_" + deviceId, "");
                int cachedUnitMl = snapshot.getInt("unit_ml_" + deviceId, 0);
                homeTitle.setText(firstNonEmpty(serverTitle, cachedTitle));
                businessAction.setText(firstNonEmpty(serverAction, cachedAction));
                unit.setText(o.optString("product_unit", "L"));
                int unitMlValue = serverUnitMl > 0 ? serverUnitMl : cachedUnitMl;
                unitMl.setText(unitMlValue > 0 ? String.valueOf(unitMlValue) : "");
                if (!serverTitle.isEmpty() || !serverAction.isEmpty() || serverUnitMl > 0) {
                    android.content.SharedPreferences.Editor ed = snapshot.edit();
                    if (!serverTitle.isEmpty()) ed.putString("home_title_" + deviceId, serverTitle);
                    if (!serverAction.isEmpty()) ed.putString("action_" + deviceId, serverAction);
                    if (serverUnitMl > 0) ed.putInt("unit_ml_" + deviceId, serverUnitMl);
                    ed.apply();
                }
'''
if old not in s:
    raise RuntimeError("settings load baseline not found")
s = s.replace(old, new, 1)
old = '''                    progress.setVisibility(View.GONE);
                    setResult(RESULT_OK);
'''
new = '''                    progress.setVisibility(View.GONE);
                    getSharedPreferences("device_business_snapshot_v1", MODE_PRIVATE).edit()
                            .putString("home_title_" + deviceId, title)
                            .putString("action_" + deviceId, action)
                            .putInt("unit_ml_" + deviceId, mlPerUnit)
                            .apply();
                    setResult(RESULT_OK);
'''
if old not in s:
    raise RuntimeError("settings save baseline not found")
s = s.replace(old, new, 1)
old = '''    private String firstNonEmpty(String... values) { for (String v : values) if (v != null && !v.trim().isEmpty()) return v.trim(); return ""; }
    private String formatNumber(double v) { return String.format(Locale.US, v == Math.rint(v) ? "%.0f" : "%.3f", v); }
'''
new = '''    private String firstNonEmpty(String... values) { for (String v : values) if (v != null && !v.trim().isEmpty()) return v.trim(); return ""; }
    private int firstPositiveInt(JSONObject o, String... keys) {
        for (String key : keys) {
            if (!o.has(key) || o.isNull(key)) continue;
            Object raw = o.opt(key);
            if (raw instanceof Number) {
                int v = ((Number) raw).intValue();
                if (v > 0) return v;
            } else if (raw != null) {
                try {
                    int v = (int)Math.round(Double.parseDouble(String.valueOf(raw).trim()));
                    if (v > 0) return v;
                } catch (Exception ignored) {}
            }
        }
        return 0;
    }
    private String formatNumber(double v) { return String.format(Locale.US, v == Math.rint(v) ? "%.0f" : "%.3f", v); }
'''
if old not in s:
    raise RuntimeError("settings helper baseline not found")
write(p, s.replace(old, new, 1))

p = "app/src/main/java/com/urea/selfservice/client/DeviceDetailActivity.java"
s = read(p)
old = '''                double price = o.optDouble("price_per_unit", 0);
                double capacity = o.optDouble("tank_capacity_l", 0);
'''
new = '''                double price = o.optDouble("price_per_unit", 0);
                int unitMl = firstPositiveInt(o,
                        "unit_ml", "ui_unit_ml", "ui_unitml", "ml_per_unit", "pricing_unit_ml");
                if (unitMl <= 0) {
                    unitMl = getSharedPreferences("device_business_snapshot_v1", MODE_PRIVATE)
                            .getInt("unit_ml_" + deviceId, 0);
                }
                double capacity = o.optDouble("tank_capacity_l", 0);
'''
if old not in s:
    raise RuntimeError("detail price baseline not found")
s = s.replace(old, new, 1)
old = '''                ((TextView)findViewById(R.id.detailParamPrice)).setText("单价：" + String.format(Locale.CHINA, "¥ %.2f / %s", price, unit));
'''
new = '''                String priceText = unitMl > 0
                        ? String.format(Locale.CHINA, "￥%.2f/%s·%dmL", price, unit, unitMl)
                        : String.format(Locale.CHINA, "￥%.2f/%s", price, unit);
                ((TextView)findViewById(R.id.detailParamPrice)).setText("单价：" + priceText);
'''
if old not in s:
    raise RuntimeError("detail display baseline not found")
s = s.replace(old, new, 1)
old = '''    private String safe(String v) { return v == null || v.trim().isEmpty() ? "未设置" : v.trim(); }
}
'''
new = '''    private int firstPositiveInt(JSONObject o, String... keys) {
        for (String key : keys) {
            if (!o.has(key) || o.isNull(key)) continue;
            Object raw = o.opt(key);
            if (raw instanceof Number) {
                int v = ((Number) raw).intValue();
                if (v > 0) return v;
            } else if (raw != null) {
                try {
                    int v = (int)Math.round(Double.parseDouble(String.valueOf(raw).trim()));
                    if (v > 0) return v;
                } catch (Exception ignored) {}
            }
        }
        return 0;
    }

    private String safe(String v) { return v == null || v.trim().isEmpty() ? "未设置" : v.trim(); }
}
'''
if old not in s:
    raise RuntimeError("detail helper baseline not found")
write(p, s.replace(old, new, 1))

print("V1.5.5 patch applied")
