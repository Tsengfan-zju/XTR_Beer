package com.urea.selfservice.client;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.amap.api.location.AMapLocationClient;
import com.amap.api.location.AMapLocationClientOption;

import org.json.JSONArray;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class NearbyDevicesActivity extends BaseActivity {
    private final List<DeviceModel> devices=new ArrayList<>(); private DeviceAdapter adapter; private TextView status; private AMapLocationClient client;
    private final ActivityResultLauncher<String[]> permission=registerForActivityResult(new ActivityResultContracts.RequestMultiplePermissions(),r->{boolean ok=Boolean.TRUE.equals(r.get(Manifest.permission.ACCESS_FINE_LOCATION))||Boolean.TRUE.equals(r.get(Manifest.permission.ACCESS_COARSE_LOCATION));if(ok)locate();else status.setText("未授权定位，无法按距离排序");});
    @Override protected void onCreate(Bundle b){super.onCreate(b);AmapBootstrap.initIfAllowed(this);setContentView(R.layout.activity_nearby);findViewById(R.id.nearbyToolbar).setOnClickListener(v->finish());status=findViewById(R.id.nearbyStatus);RecyclerView rv=findViewById(R.id.nearbyRecycler);rv.setLayoutManager(new LinearLayoutManager(this));adapter=new DeviceAdapter(devices,true,d->{Intent i=new Intent(this,DeviceDetailActivity.class);i.putExtra("device_id",d.id);startActivity(i);});rv.setAdapter(adapter);load();}
    private void load(){new ApiClient(this).getDevices(new ApiClient.Callback<>(){public void onSuccess(JSONArray a){devices.clear();for(int i=0;i<a.length();i++){DeviceModel d=DeviceModel.from(a.optJSONObject(i));AmapCoordinateUtils.ensureGcj02(NearbyDevicesActivity.this,d);if(d.hasLocation())devices.add(d);}adapter.notifyDataSetChanged();ensurePermission();}public void onError(String m){status.setText(m);}});}
    private void ensurePermission(){if(ContextCompat.checkSelfPermission(this,Manifest.permission.ACCESS_FINE_LOCATION)==PackageManager.PERMISSION_GRANTED||ContextCompat.checkSelfPermission(this,Manifest.permission.ACCESS_COARSE_LOCATION)==PackageManager.PERMISSION_GRANTED)locate();else permission.launch(new String[]{Manifest.permission.ACCESS_FINE_LOCATION,Manifest.permission.ACCESS_COARSE_LOCATION});}
    private void locate(){if(Prefs.amapKey(this).trim().isEmpty()){status.setText("服务器尚未配置高德 Android Key，请联系平台管理员");return;}try{client=new AMapLocationClient(getApplicationContext());AMapLocationClientOption o=new AMapLocationClientOption();o.setOnceLocation(true);o.setOnceLocationLatest(true);o.setNeedAddress(false);client.setLocationOption(o);client.setLocationListener(l->{if(l!=null&&l.getErrorCode()==0){for(DeviceModel d:devices)d.distanceMeters=GeoUtils.distanceMeters(l.getLatitude(),l.getLongitude(),d.mapLatitude(),d.mapLongitude());devices.sort(Comparator.comparingDouble(x->x.distanceMeters));adapter.notifyDataSetChanged();status.setText("已按距离由近到远排序 · 共 "+devices.size()+" 台");}else status.setText("定位失败，暂时无法按距离排序");if(client!=null)client.stopLocation();});client.startLocation();}catch(Exception e){status.setText("定位服务初始化失败");}}
    @Override protected void onDestroy(){if(client!=null)client.onDestroy();super.onDestroy();}
}
