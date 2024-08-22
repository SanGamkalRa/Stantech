import React, {useContext, useEffect, useState} from 'react';
import MapView, {Marker, Polygon} from 'react-native-maps';
import {View, PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppContext} from '../context/AppContext';

const MapScreen = () => {
  const {state} = useContext(AppContext);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [clockInLocation, setClockInLocation] = useState(null);
  const [clockOutLocation, setClockOutLocation] = useState(null);

  // Function to get current location
  const getCurrentLocation = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn('Location permission denied');
        return;
      }
    }

    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCurrentLocation({
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      },
      error => {
        console.error('Error getting location:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  // Function to fetch clock-in and clock-out locations from AsyncStorage
  const fetchStoredLocations = async () => {
    try {
      const data = await AsyncStorage.getItem('attendance');
      if (data) {
        const attendance = JSON.parse(data);
        setClockInLocation(attendance.clockInLocation);
        setClockOutLocation(attendance.clockOutLocation);
      }
    } catch (error) {
      console.error('Error fetching stored locations:', error);
    }
  };

  useEffect(() => {
    getCurrentLocation();
    fetchStoredLocations();
  }, []);

  // Re-fetch the locations whenever they change in AsyncStorage
  useEffect(() => {
    fetchStoredLocations();
  }, [state.clockInLocation, state.clockOutLocation]);

  // Define coordinates for the Polygon
  const polygonCoordinates = [];
  if (clockInLocation) polygonCoordinates.push(clockInLocation);
  if (clockOutLocation) polygonCoordinates.push(clockOutLocation);
  if (currentLocation) polygonCoordinates.push(currentLocation);

  return (
    <View style={{flex: 1}}>
      <MapView
        style={{flex: 1}}
        region={currentLocation} 
        showsUserLocation={true} 
      >
        {/* Clock-In Marker */}
        {clockInLocation && (
          <Marker
            coordinate={{
              latitude: clockInLocation.latitude,
              longitude: clockInLocation.longitude,
            }}
            title="Clock-In Location"
          />
        )}

        {/* Clock-Out Marker */}
        {clockOutLocation && (
          <Marker
            coordinate={{
              latitude: clockOutLocation.latitude,
              longitude: clockOutLocation.longitude,
            }}
            title="Clock-Out Location"
          />
        )}

        {/* Polygon to show the area between Clock-In, Clock-Out, and Current Location */}
        {polygonCoordinates.length > 1 && (
          <Polygon
            coordinates={polygonCoordinates}
            strokeWidth={2}
            strokeColor="hotpink"
            fillColor="rgba(255, 105, 180, 0.3)" 
          />
        )}
      </MapView>
    </View>
  );
};

export default MapScreen;
