import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { ProductsNavigator, ShopNavigator, AuthNavigator } from './ShopNavigator';
import StartupScreen from '../screens/user/StartupScreen'; 


const AppNavigator = (props) => {
  const isAuth = useSelector((state) => !!state.auth.token);
  const didTry = useSelector((state) => !!state.auth.didTryAutoLogin);
  return (
    <NavigationContainer>
      {isAuth && <ShopNavigator />}
      {!isAuth && didTry && <AuthNavigator />}
      {!isAuth && !didTry && <StartupScreen />}
    </NavigationContainer>
  );
};

export default AppNavigator;
