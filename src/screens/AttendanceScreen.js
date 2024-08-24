import React, {useEffect, useState, useContext} from 'react';
import {View, StyleSheet, Alert, PermissionsAndroid} from 'react-native';
import {
  Text,
  Button,
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppContext} from '../context/AppContext';
import moment from 'moment';
import Geolocation from '@react-native-community/geolocation';
import RNAndroidLocationEnabler, { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';

const AttendanceScreen = () => {
  const {state, dispatch} = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [isClockIn, setClockIn] = useState(false);
  const [attendance, setAttendance] = useState({
    clockInTime: null,
    clockInLocation: null,
    clockOutTime: null,
    clockOutLocation: null,
    totalDuration: null,
  });

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const enableResult = await promptForEnableLocationIfNeeded();
      console.log('enableResult', enableResult);
        
        // do some action after the gps has been activated by the user
        
      } catch (error) {
        console.log(error);
      }
    }
    requestLocationPermission();
}, [])

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const data = await AsyncStorage.getItem('attendance');
        if (data) {
          setAttendance(JSON.parse(data));
        }
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };

    fetchAttendanceData();
  }, []);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          console.log("🚀 ~ returnnewPromise ~ position:", position)
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
          reject(error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    });
  };

  const clockIn = async () => {
    setLoading(true);
    setClockIn(true);
    try {
      const location = await getCurrentLocation();
      const time = new Date();

      const updatedAttendance = {
        ...attendance,
        clockInTime: time,
        clockInLocation: location,
        clockOutTime: null,
        clockOutLocation: null,
        totalDuration: null,
      };

      setAttendance(updatedAttendance);
      await AsyncStorage.setItem(
        'attendance',
        JSON.stringify(updatedAttendance),
      );
      dispatch({type: 'CLOCK_IN', payload: updatedAttendance});
      Alert.alert('Success', 'Clock In successful!');
    } catch (error) {
      console.error('Clock In Error:', error);
      Alert.alert('Error', `Clock In failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const clockOut = async () => {
    setClockIn(false);
    if (!attendance.clockInTime) {
      Alert.alert('Error', 'Please clock in before clocking out.');
      return;
    }

    setLoading(true);
    try {
      const location = await getCurrentLocation();
      const time = new Date();

      const duration = moment.duration(
        moment(time).diff(moment(attendance.clockInTime)),
      );
      const hours = duration.hours();
      const minutes = duration.minutes();
      const seconds = duration.seconds();

      const formattedDuration = `${hours}h ${minutes}m ${seconds}s`;

      const updatedAttendance = {
        ...attendance,
        clockOutTime: time,
        clockOutLocation: location,
        totalDuration: formattedDuration,
      };

      setAttendance(updatedAttendance);
      await AsyncStorage.setItem(
        'attendance',
        JSON.stringify(updatedAttendance),
      );
      dispatch({type: 'CLOCK_OUT', payload: updatedAttendance});
      Alert.alert('Success', 'Clock Out successful!');
    } catch (error) {
      console.error('Clock Out Error:', error);
      Alert.alert('Error', `Clock Out failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Attendance Tracker</Title>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Clock In</Title>
          {attendance.clockInTime ? (
            <>
              <Paragraph>
                Time:{' '}
                {moment(attendance.clockInTime).format('hh:mm A, DD MMM YYYY')}
              </Paragraph>
              {attendance.clockInLocation && (
                <Paragraph>
                  Location: Latitude{' '}
                  {attendance.clockInLocation.latitude.toFixed(4)}, Longitude{' '}
                  {attendance.clockInLocation.longitude.toFixed(4)}
                </Paragraph>
              )}
            </>
          ) : (
            <Paragraph>No clock in record.</Paragraph>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Clock Out</Title>
          {attendance.clockOutTime ? (
            <>
              <Paragraph>
                Time:{' '}
                {moment(attendance.clockOutTime).format('hh:mm A, DD MMM YYYY')}
              </Paragraph>
              {attendance.clockOutLocation && (
                <Paragraph>
                  Location: Latitude{' '}
                  {attendance.clockOutLocation.latitude.toFixed(4)}, Longitude{' '}
                  {attendance.clockOutLocation.longitude.toFixed(4)}
                </Paragraph>
              )}
              <Paragraph>Total Duration: {attendance.totalDuration}</Paragraph>
            </>
          ) : (
            <Paragraph>No clock out record.</Paragraph>
          )}
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={clockIn}
          disabled={isClockIn}
          style={styles.button}>
          {loading ? 'Clocking In...' : 'Clock In'}
        </Button>
        <Button
          mode="contained"
          onPress={clockOut}
          disabled={!isClockIn}
          style={styles.button}>
          {loading ? 'Clocking Out...' : 'Clock Out'}
        </Button>
      </View>

      {loading && (
        <ActivityIndicator
          animating={true}
          size="large"
          style={styles.loadingIndicator}
        />
      )}
    </View>
  );
};

export default AttendanceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    alignSelf: 'center',
    marginVertical: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  card: {
    marginVertical: 10,
    elevation: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 0.45,
  },
  loadingIndicator: {
    marginTop: 20,
  },
});
