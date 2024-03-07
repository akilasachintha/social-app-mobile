import React from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import StackNavigator from '@navigation/StackNavigator';
import {AppStateProvider} from "@context/AppStateContext";
import * as SplashScreen from "expo-splash-screen";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {GestureHandlerRootView} from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync().catch((error) => console.warn(error));
const navTheme = DefaultTheme;
navTheme.colors.background = '#fff';

export default function App() {
    return (
        <SafeAreaProvider>
            <AppStateProvider>
                <GestureHandlerRootView style={{flex: 1}}>
                    <NavigationContainer theme={navTheme}>
                        <StackNavigator/>
                    </NavigationContainer>
                </GestureHandlerRootView>
            </AppStateProvider>
        </SafeAreaProvider>
    );
}
