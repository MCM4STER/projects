package com.example.tracker;

import android.location.Location;
import android.os.Bundle;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import java.util.List;

public class Stats extends AppCompatActivity {

    public static final int EARTH_RADIUS = 6371;
    public double totalDistance = 0;
    List<Location> savedLocations;

    TextView tv_distance;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_stats);

        tv_distance = findViewById(R.id.tv_distance);

        MyApplication myApplication = (MyApplication)getApplicationContext();
        savedLocations = myApplication.getMyLocations();

        for (int i = 0;i < savedLocations.size()-1;i++){
            totalDistance += getDistance(savedLocations.get(i).getLatitude(),savedLocations.get(i+1).getLatitude(),savedLocations.get(i).getLongitude(),savedLocations.get(i+1).getLongitude());
        }

        tv_distance.setText(String.valueOf(totalDistance) + "km");
    }



    public double getDistance(double lat1, double lat2, double lon1, double lon2){
        double distance = 0;
        lon1 = Math.toRadians(lon1);
        lon2 = Math.toRadians(lon2);
        lat1 = Math.toRadians(lat1);
        lat2 = Math.toRadians(lat2);
        double dlon = lon2 - lon1;
        double dlat = lat2 - lat1;
        double a = Math.pow(Math.sin(dlat / 2), 2)
                + Math.cos(lat1) * Math.cos(lat2)
                * Math.pow(Math.sin(dlon / 2),2);

        double c = 2 * Math.asin(Math.sqrt(a));
        distance = c * EARTH_RADIUS;
        return distance;
    }
}