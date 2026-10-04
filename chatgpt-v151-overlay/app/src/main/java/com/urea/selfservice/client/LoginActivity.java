package com.urea.selfservice.client;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;

import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;

import org.json.JSONObject;

public class LoginActivity extends BaseActivity {
    private TextInputEditText usernameInput, passwordInput;
    private TextView serverStatus;
    private MaterialButton loginButton, registerButton;
    private ProgressBar progress;
    private ApiClient api;

    @Override protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        api = new ApiClient(this);
        usernameInput = findViewById(R.id.usernameInput);
        passwordInput = findViewById(R.id.passwordInput);
        serverStatus = findViewById(R.id.serverStatusText);
        loginButton = findViewById(R.id.loginButton);
        registerButton = findViewById(R.id.registerButton);
        progress = findViewById(R.id.loginProgress);
        usernameInput.setText(Prefs.username(this));
        loginButton.setOnClickListener(v -> login());
        registerButton.setOnClickListener(v -> {
            if (!Prefs.hasServer(this)) {
                Toast.makeText(this, "尚未配置运营服务器，请从服务器 /APK 页面打开 APP 并自动配置", Toast.LENGTH_LONG).show();
                return;
            }
            startActivity(new Intent(this, RegisterActivity.class).addFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION));
        });
        if (!Prefs.privacyAccepted(this)) showPrivacyDialog();
        processBootstrapOrContinue(getIntent());
    }

    @Override protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        processBootstrapOrContinue(intent);
    }

    private void processBootstrapOrContinue(Intent intent) {
        String deepServer = BootstrapManager.serverFromIntent(intent);
        if (!deepServer.isEmpty()) {
            setLoading(true);
            serverStatus.setText("正在从服务器获取 APP 配置…");
            BootstrapManager.refresh(this, deepServer, new BootstrapManager.Callback() {
                @Override public void onSuccess(JSONObject config) {
                    setLoading(false);
                    refreshServerStatus();
                    AmapBootstrap.initIfAllowed(LoginActivity.this);
                    Toast.makeText(LoginActivity.this, "服务器与地图配置已自动完成", Toast.LENGTH_SHORT).show();
                    continueAfterBootstrap();
                }
                @Override public void onError(String message) {
                    setLoading(false);
                    refreshServerStatus();
                    Toast.makeText(LoginActivity.this, "自动配置失败：" + message, Toast.LENGTH_LONG).show();
                }
            });
            return;
        }
        refreshServerStatus();
        if (Prefs.hasServer(this)) {
            BootstrapManager.refresh(this, Prefs.serverUrl(this), new BootstrapManager.Callback() {
                @Override public void onSuccess(JSONObject config) { refreshServerStatus(); AmapBootstrap.initIfAllowed(LoginActivity.this); continueAfterBootstrap(); }
                @Override public void onError(String message) { continueAfterBootstrap(); }
            });
        }
    }

    private void continueAfterBootstrap() {
        if (!Prefs.token(this).isEmpty() && Prefs.hasServer(this)) {
            Intent i = new Intent(this, HomeActivity.class);
            i.addFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION);
            startActivity(i);
            finish();
        }
    }

    private void refreshServerStatus() {
        String server = Prefs.serverUrl(this);
        boolean ok = !server.isEmpty();
        loginButton.setEnabled(ok);
        registerButton.setEnabled(ok);
        serverStatus.setText(ok ? "运营服务器已自动配置\n" + server : "尚未配置运营服务器\n请用手机浏览器访问服务器 /APK 页面，安装后点击“打开 APP 并自动配置”");
    }

    private void showPrivacyDialog() {
        new AlertDialog.Builder(this)
                .setTitle("隐私与地图服务")
                .setMessage(getString(R.string.amap_privacy_text) + "\n\n高德隐私政策：https://lbs.amap.com/home/privacy/")
                .setCancelable(false)
                .setNegativeButton("不同意", (d, w) -> finish())
                .setPositiveButton("同意并继续", (d, w) -> { Prefs.setPrivacyAccepted(this, true); AmapBootstrap.initIfAllowed(this); })
                .show();
    }

    private void login() {
        String user = text(usernameInput), pwd = text(passwordInput);
        if (!Prefs.hasServer(this)) {
            Toast.makeText(this, "运营服务器尚未自动配置", Toast.LENGTH_LONG).show();
            return;
        }
        if (user.isEmpty() || pwd.isEmpty()) {
            Toast.makeText(this, "请填写账号和密码", Toast.LENGTH_SHORT).show();
            return;
        }
        setLoading(true);
        api.login(user, pwd, new ApiClient.Callback<>() {
            @Override public void onSuccess(String token) {
                setLoading(false);
                Prefs.setToken(LoginActivity.this, token);
                Prefs.setUsername(LoginActivity.this, user);
                startActivity(new Intent(LoginActivity.this, HomeActivity.class).addFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION));
                finish();
            }
            @Override public void onError(String message) {
                setLoading(false);
                Toast.makeText(LoginActivity.this, message, Toast.LENGTH_LONG).show();
            }
        });
    }

    private void setLoading(boolean b) {
        progress.setVisibility(b ? View.VISIBLE : View.GONE);
        loginButton.setEnabled(!b && Prefs.hasServer(this));
        registerButton.setEnabled(!b && Prefs.hasServer(this));
    }
    private String text(TextInputEditText e) { return e.getText() == null ? "" : e.getText().toString().trim(); }
}
