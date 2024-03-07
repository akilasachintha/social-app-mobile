import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {MaterialIcons} from '@expo/vector-icons';
import MyProfileScreen from "@screens/MyProfileScreen";
import SearchScreen from "@screens/SearchScreen";
import StackNavigatorHome from "@navigation/StackNavigatorHome";
import {NavigatorScreenParams} from '@react-navigation/native';

import {RootStackParamList} from "@navigation/StackNavigator";

// Define the tab navigator params list
type TabNavigatorParamList = {
    HomeTab: NavigatorScreenParams<RootStackParamList> | undefined;
    ProfileTab: undefined;
    SearchTab: undefined;
};

// Create a typed navigator
const Tab = createMaterialTopTabNavigator<TabNavigatorParamList>();

export default function TabNavigator() {
    return (
        <Tab.Navigator
            initialRouteName="HomeTab"
            screenOptions={{
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#000',
                tabBarInactiveTintColor: '#ccc',
                tabBarIndicatorStyle: {
                    backgroundColor: '#000',
                },
                tabBarStyle: {
                    backgroundColor: '#fff',
                },
                tabBarShowIcon: true,
            }}
        >
            <Tab.Screen
                name="HomeTab"
                component={StackNavigatorHome}
                options={{
                    tabBarIcon: ({color}) => (
                        <MaterialIcons name="home" color={color} size={24}/>
                    ),
                }}
                listeners={({navigation, route}) => ({
                    tabPress: e => {
                        e.preventDefault();
                        navigation.navigate(route.name, {screen: 'HomeTabHomeStack'});
                    },
                })}
            />
            <Tab.Screen
                name="SearchTab"
                component={SearchScreen}
                options={{
                    tabBarIcon: ({color}) => (
                        <MaterialIcons name="search" color={color} size={24}/>
                    ),
                }}
            />
            <Tab.Screen
                name="ProfileTab"
                component={MyProfileScreen}
                options={{
                    tabBarIcon: ({color}) => (
                        <MaterialIcons name="person" color={color} size={24}/>
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
