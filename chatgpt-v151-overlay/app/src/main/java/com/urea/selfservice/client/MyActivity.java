package com.urea.selfservice.client;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;

import com.google.android.material.dialog.MaterialAlertDialogBuilder;
import com.google.android.material.textfield.TextInputEditText;

import org.json.JSONObject;

public class MyActivity extends BaseActivity {
    private ApiClient api;
    private TextView accountSummary, heroName, avatar, basicInfoSummary, connectionSummary, appVersionText;
    private JSONObject profile;

    @Override protected void onCreate(Bundle b) {
        super.onCreate(b);
        setContentView(R.layout.activity_my);
        BottomNavHelper.attach(this, BottomNavHelper.MINE);
        api = new ApiClient(this);
        accountSummary = findViewById(R.id.myAccountSummary);
        heroName = findViewById(R.id.myHeroName);
        avatar = findViewById(R.id.myAvatar);
        basicInfoSummary = findViewById(R.id.basicInfoSummary);
        connectionSummary = findViewById(R.id.connectionSummary);
        appVersionText = findViewById(R.id.appVersionText);
        appVersionText.setText("版本 " + BuildConfig.VERSION_NAME);
        findViewById(R.id.basicInfoCard).setOnClickListener(v -> showBasicInfo());
        findViewById(R.id.changePasswordRow).setOnClickListener(v -> showPasswordDialog());
        findViewById(R.id.logoutRow).setOnClickListener(v -> confirmLogout());
        findViewById(R.id.connectionCard).setOnClickListener(v -> showConnectionInfo());
        refreshConnectionSummary();
        loadProfile();
        refreshBootstrap(false);
    }

    @Override protected void onResume() {
        super.onResume();
        if (api != null) { refreshConnectionSummary(); loadProfile(); }
    }

    private void loadProfile() {
        api.getProfile(new ApiClient.Callback<>() {
            @Override public void onSuccess(JSONObject o) {
                profile = o;
                String login = o.optString("login_name", Prefs.username(MyActivity.this));
                String customer = o.optString("customer_name", "--");
                String name = o.optString("display_name", "").trim();
                if (name.isEmpty()) name = login;
                heroName.setText(name);
                avatar.setText(name.isEmpty() ? "我" : name.substring(0, 1).toUpperCase());
                accountSummary.setText("@" + login + "  ·  " + customer);
                String phone = o.optString("phone", "").trim();
                basicInfoSummary.setText((phone.isEmpty() ? "未填写联系电话" : phone) + "  ·  仅查看");
            }
            @Override public void onError(String message) { handleError(message); }
        });
    }

    private void showBasicInfo() {
        if (profile == null) { Toast.makeText(this, "正在读取基本信息", Toast.LENGTH_SHORT).show(); return; }
        String text = "客户名称：" + profile.optString("customer_name", "--") +
                "\n客户编号：" + profile.optString("customer_code", "--") +
                "\n登录账号：" + profile.optString("login_name", "--") +
                "\n姓名 / 昵称：" + profile.optString("display_name", "--") +
                "\n联系电话：" + profile.optString("phone", "--") +
                "\n\n基本信息在注册时填写，登录后仅用于查看。如需变更请联系平台管理员。";
        new MaterialAlertDialogBuilder(this).setTitle("基本信息").setMessage(text).setPositiveButton("知道了", null).show();
    }

    private void showPasswordDialog() {
        View v = LayoutInflater.from(this).inflate(R.layout.dialog_change_password, null, false);
        TextInputEditText oldP = v.findViewById(R.id.dialogOldPassword), newP = v.findViewById(R.id.dialogNewPassword), confirm = v.findViewById(R.id.dialogConfirmPassword);
        AlertDialog dialog = new MaterialAlertDialogBuilder(this).setTitle("修改登录密码").setView(v).setNegativeButton("取消", null).setPositiveButton("保存", null).create();
        dialog.setOnShowListener(x -> dialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener(btn -> {
            String old = text(oldP), n = text(newP), c = text(confirm);
            if (old.isEmpty()) { oldP.setError("请输入原密码"); return; }
            if (n.length() < 6) { newP.setError("新密码至少 6 位"); return; }
            if (!n.equals(c)) { confirm.setError("两次输入不一致"); return; }
            api.changePassword(old, n, new ApiClient.Callback<>() {
                @Override public void onSuccess(JSONObject value) { Toast.makeText(MyActivity.this, "密码修改成功", Toast.LENGTH_SHORT).show(); dialog.dismiss(); }
                @Override public void onError(String message) { Toast.makeText(MyActivity.this, message, Toast.LENGTH_LONG).show(); }
            });
        }));
        dialog.show();
    }

    private void showConnectionInfo() {
        String server = Prefs.serverUrl(this);
        String map = Prefs.amapKey(this).trim().isEmpty() ? "未配置（请联系平台管理员）" : "高德地图 · 已由服务器配置";
        String latest = Prefs.latestVersionName(this).isEmpty() ? "未读取" : "V" + Prefs.latestVersionName(this);
        String message = "运营服务器：\n" + (server.isEmpty() ? "未配置" : server) +
                "\n\n地图服务：\n" + map +
                "\n\n配置来源：服务器 /api/app/bootstrap" +
                "\n\n当前版本：V" + BuildConfig.VERSION_NAME +
                "\n服务器最新版本：" + latest;
        new MaterialAlertDialogBuilder(this)
                .setTitle("应用与连接")
                .setMessage(message)
                .setNegativeButton("关闭", null)
                .setNeutralButton("刷新配置", (d, w) -> refreshBootstrap(true))
                .setPositiveButton("检查更新", (d, w) -> checkUpdate())
                .show();
    }

    private void refreshBootstrap(boolean notify) {
        String server = Prefs.serverUrl(this);
        if (server.isEmpty()) {
            if (notify) Toast.makeText(this, "服务器尚未配置，请从 /APK 下载页自动配置", Toast.LENGTH_LONG).show();
            return;
        }
        BootstrapManager.refresh(this, server, new BootstrapManager.Callback() {
            @Override public void onSuccess(JSONObject config) {
                AmapBootstrap.initIfAllowed(MyActivity.this);
                refreshConnectionSummary();
                if (notify) Toast.makeText(MyActivity.this, "服务器与地图配置已刷新", Toast.LENGTH_SHORT).show();
            }
            @Override public void onError(String message) {
                if (notify) Toast.makeText(MyActivity.this, "刷新失败：" + message, Toast.LENGTH_LONG).show();
            }
        });
    }

    private void checkUpdate() {
        String server = Prefs.serverUrl(this);
        if (server.isEmpty()) { Toast.makeText(this, "服务器尚未配置", Toast.LENGTH_LONG).show(); return; }
        BootstrapManager.refresh(this, server, new BootstrapManager.Callback() {
            @Override public void onSuccess(JSONObject config) {
                JSONObject app = config.optJSONObject("app");
                if (app == null) {
                    new MaterialAlertDialogBuilder(MyActivity.this).setTitle("检查更新").setMessage("服务器尚未发布 APP 版本。").setPositiveButton("知道了", null).show();
                    return;
                }
                int code = app.optInt("version_code", 0);
                String name = app.optString("version_name", "");
                String notes = app.optString("release_notes", "");
                String url = app.optString("apk_url", config.optString("apk_url", ""));
                if (code <= BuildConfig.VERSION_CODE) {
                    new MaterialAlertDialogBuilder(MyActivity.this).setTitle("已是最新版本").setMessage("当前版本 V" + BuildConfig.VERSION_NAME).setPositiveButton("知道了", null).show();
                    return;
                }
                new MaterialAlertDialogBuilder(MyActivity.this)
                        .setTitle("发现新版本 V" + name)
                        .setMessage(notes.isEmpty() ? "服务器已发布新版本。" : notes)
                        .setNegativeButton("稍后", null)
                        .setPositiveButton("下载安装", (d, w) -> {
                            if (url == null || url.trim().isEmpty()) { Toast.makeText(MyActivity.this, "服务器未提供下载地址", Toast.LENGTH_LONG).show(); return; }
                            try { startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url))); }
                            catch (Exception e) { Toast.makeText(MyActivity.this, "无法打开下载地址", Toast.LENGTH_LONG).show(); }
                        }).show();
            }
            @Override public void onError(String message) { Toast.makeText(MyActivity.this, "检查更新失败：" + message, Toast.LENGTH_LONG).show(); }
        });
    }

    private void refreshConnectionSummary() {
        String s = Prefs.serverUrl(this);
        String map = Prefs.amapKey(this).trim().isEmpty() ? "地图 Key 未配置" : "高德地图已配置";
        connectionSummary.setText((s.isEmpty() ? "服务器未配置" : s) + "  ·  " + map);
    }

    private void confirmLogout() {
        new MaterialAlertDialogBuilder(this).setTitle("退出登录").setMessage("确定要退出当前账号吗？").setNegativeButton("取消", null).setPositiveButton("退出", (d,w) -> logout()).show();
    }

    private void logout() {
        Prefs.logout(this);
        Intent i = new Intent(this, LoginActivity.class);
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NO_ANIMATION);
        startActivity(i); BottomNavHelper.suppress(this); finish();
    }
    private String text(TextInputEditText e) { return e.getText() == null ? "" : e.getText().toString().trim(); }
    private void handleError(String m) { if (m.contains("登录") || m.contains("令牌")) { logout(); return; } Toast.makeText(this, m, Toast.LENGTH_LONG).show(); }
}
