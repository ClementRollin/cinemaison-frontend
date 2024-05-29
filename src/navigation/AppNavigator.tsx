import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Register from '../components/Register';
import Login from '../components/Login';
import Home from "../components/home";

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Register">
                <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
                <Stack.Screen name="Register" component={Register} options={{headerShown: false}}/>
                <Stack.Screen name="Home" component={Home} options={{headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;