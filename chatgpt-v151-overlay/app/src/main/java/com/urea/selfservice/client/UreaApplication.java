package com.urea.selfservice.client;

import android.app.Application;

public class UreaApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        // 高德 SDK 仍按原逻辑延迟到用户同意隐私政策后初始化。
        registerActivityLifecycleCallbacks(new BusinessUiLifecycle());
    }
}
