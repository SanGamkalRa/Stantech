import React, {useEffect, useContext} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppContext} from '../context/AppContext';
import {jwtDecode} from 'jwt-decode';

const SplashScreen = ({navigation}) => {
  const {dispatch} = useContext(AppContext);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const user = jwtDecode(token);
          dispatch({type: 'LOGIN', payload: user});
          navigation.navigate('Home');
        } else {
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Error checking token:', error);
        navigation.navigate('Login');
      }
    };

    checkToken();
  }, [dispatch, navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;
