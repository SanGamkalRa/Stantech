import React, {useState, useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {TextInput, Button, Text, Avatar, Title} from 'react-native-paper';
import {AppContext} from '../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode'; 
import {token} from '../utils/Auth';

const LoginScreen = ({navigation}) => {
  const {dispatch} = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = async () => {
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    try {
      await AsyncStorage.setItem('token', token);

      const user = jwtDecode(token);

      console.log('Decoded User Info:', user);

      dispatch({type: 'LOGIN', payload: user});

      navigation.navigate('Home');
    } catch (error) {
      console.error('JWT Decoding or Storage Error:', error);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Welcome Back</Title>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput
        label="Username"
        value={username}
        onChangeText={text => {
          setUsername(text);
          setError(''); 
        }}
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={text => {
          setPassword(text);
          setError('');
        }}
        secureTextEntry
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={login}
        style={styles.button}
        contentStyle={styles.buttonContent}>
        Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    alignSelf: 'center',
    marginBottom: 30,
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default LoginScreen;
