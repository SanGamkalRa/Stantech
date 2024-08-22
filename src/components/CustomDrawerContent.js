import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer';
import {Text} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomDrawerContent = (props) => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      props.navigation.navigate('Login');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  };

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={styles.logoutContainer}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logoutContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  logoutButton: {
    paddingVertical: 15,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d9534f',
  },
});

export default CustomDrawerContent;
