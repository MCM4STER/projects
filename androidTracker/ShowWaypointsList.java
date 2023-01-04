package com.example.tracker;

import android.location.Location;
import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.ListView;

import androidx.appcompat.app.AppCompatActivity;

import java.util.List;

public class ShowWaypointsList extends AppCompatActivity {

    ListView lv_savedWaypoints;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_show_waypoints_list);

        lv_savedWaypoints = findViewById(R.id.lv_waypoints);

        MyApplication myApplication = (MyApplication)getApplicationContext();
        List<Location> savedLocations = myApplication.getMyLocations();

        lv_savedWaypoints.setAdapter(new ArrayAdapter<Location>( this, android.R.layout.simple_list_item_1, savedLocations));
    }
}
