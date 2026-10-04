package com.urea.selfservice.client;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;

public class RegisterActivity extends BaseActivity {
    private TextInputEditText customerCode, username, displayName, phone, password, confirm;
    private MaterialButton submit; private ProgressBar progress; private ApiClient api;
    @Override protected void onCreate(Bundle b){
        super.onCreate(b); setContentView(R.layout.activity_register); api=new ApiClient(this);
        if(!Prefs.hasServer(this)){Toast.makeText(this,"运营服务器尚未配置，请先从 /APK 页面自动配置",Toast.LENGTH_LONG).show();finish();return;}
        TextView status=findViewById(R.id.registerServerStatus);status.setText("注册到："+Prefs.serverUrl(this));
        customerCode=findViewById(R.id.registerCustomerCode); username=findViewById(R.id.registerUsername); displayName=findViewById(R.id.registerDisplayName); phone=findViewById(R.id.registerPhone); password=findViewById(R.id.registerPassword); confirm=findViewById(R.id.registerConfirmPassword); submit=findViewById(R.id.registerSubmitButton); progress=findViewById(R.id.registerProgress);
        submit.setOnClickListener(v->register()); findViewById(R.id.backToLoginButton).setOnClickListener(v->finish());
    }
    private void register(){
        String code=text(customerCode), u=text(username), n=text(displayName), ph=text(phone), p=text(password), c=text(confirm);
        if(code.isEmpty()||u.isEmpty()||n.isEmpty()||ph.isEmpty()||p.isEmpty()){Toast.makeText(this,"请完整填写注册信息",Toast.LENGTH_SHORT).show();return;}
        if(u.length()<3){username.setError("账号至少 3 位");return;} if(p.length()<6){password.setError("密码至少 6 位");return;} if(!p.equals(c)){confirm.setError("两次输入不一致");return;}
        setLoading(true); api.register(code,u,p,n,ph,new ApiClient.Callback<>(){public void onSuccess(String token){setLoading(false);Prefs.setToken(RegisterActivity.this,token);Prefs.setUsername(RegisterActivity.this,u);Intent i=new Intent(RegisterActivity.this,HomeActivity.class);i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK|Intent.FLAG_ACTIVITY_CLEAR_TASK|Intent.FLAG_ACTIVITY_NO_ANIMATION);startActivity(i);finish();}public void onError(String m){setLoading(false);Toast.makeText(RegisterActivity.this,m,Toast.LENGTH_LONG).show();}});
    }
    private void setLoading(boolean b){progress.setVisibility(b?View.VISIBLE:View.GONE);submit.setEnabled(!b);}
    private String text(TextInputEditText e){return e.getText()==null?"":e.getText().toString().trim();}
}
