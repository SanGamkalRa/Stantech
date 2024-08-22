import {View, Text} from 'react-native';
import React from 'react';
import AppStack from './src/navigation/stack';
import {AppProvider} from './src/context/AppContext';

const App = () => {
  return (
    <AppProvider>
      <AppStack />
    </AppProvider>
  );
};

export default App;
