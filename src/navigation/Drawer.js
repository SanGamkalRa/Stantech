import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import AttendanceScreen from '../screens/AttendanceScreen';
import MapScreen from '../screens/MapScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Attendance"
      drawerContent={props => <CustomDrawerContent {...props} />} 
    >
      <Drawer.Screen name="Attendance" component={AttendanceScreen} />
      <Drawer.Screen name="Map" component={MapScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
