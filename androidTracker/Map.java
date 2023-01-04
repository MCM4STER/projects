package com.example.tracker;

import android.location.Location;
import android.os.Bundle;

import androidx.fragment.app.FragmentActivity;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.PolylineOptions;

import java.util.List;

import static android.graphics.Color.BLUE;
import static android.graphics.Color.RED;

public class Map extends FragmentActivity implements OnMapReadyCallback {

    public GoogleMap mMap;
    public Location lastLocation;
    public float variance;
    public long timeStamp;
    List<Location> savedLocations;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_map);
        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);
    }


    @Override
    public void onMapReady(GoogleMap googleMap) {
        MyApplication myApplication = (MyApplication)getApplicationContext();
        mMap = googleMap;
        updateMap(myApplication);
    }

    public void updateMap(MyApplication myApplication){
        try{
            savedLocations = myApplication.getMyLocations();
            PolylineOptions polylineOptions = new PolylineOptions();
            PolylineOptions filteredPolylineoptions = new PolylineOptions();
            polylineOptions.color(BLUE);
            polylineOptions.width(20);
            filteredPolylineoptions.color(RED);
            filteredPolylineoptions.width(2000);
            variance = -1;
            for (Location location: savedLocations){
                LatLng latlng = new LatLng(location.getLatitude(),location.getLongitude());
                polylineOptions.add(latlng);
                filteredPolylineoptions.add(Filter(location));
            }
            mMap.addPolyline(polylineOptions);
            mMap.addPolyline(filteredPolylineoptions);
            mMap.animateCamera(CameraUpdateFactory.newLatLngZoom(new LatLng(savedLocations.get(0).getLatitude(),savedLocations.get(0).getLongitude()),15f),1000,null);
            //TODO REAL TIME UPDATE MAP
        }catch(Exception e){
            System.out.println(e);
        }
    }

    public LatLng Filter(Location location){


        if (variance < 0) {
            // if variance < 0, object is unitialised, so initialise with current values
            lastLocation = location;
        } else {
            // else apply Kalman filter
            long duration = location.getTime() - lastLocation.getTime();
            if (duration > 0) {
                // time has moved on, so the uncertainty in the current position increases
                variance += duration * location.getSpeed() * location.getSpeed() / 1000;
                timeStamp = location.getTime();
            }
        }

        float k = variance / (variance + location.getAccuracy() * location.getAccuracy());
        variance = (1 - k) * variance;
        System.out.println();
        return new LatLng(k * (location.getLatitude() - lastLocation.getLatitude()),k * (location.getLongitude() - lastLocation.getLongitude()));
    }
};
