import {createNativeStackNavigator, NativeStackNavigationProp} from '@react-navigation/native-stack';
import LoginScreen from "@screens/auth/LoginScreen";
import RegisterScreen from "@screens/auth/RegisterScreen";
import ForgotPasswordScreen from "@screens/auth/ForgotPasswordScreen";
import {useAppStateContext} from "@context/AppStateContext";
import * as SplashScreen from "expo-splash-screen";
import MainScreen from "@screens/MainScreen";

export type RootStackParamList = {
    HomeStack: undefined;
    LoginStack: undefined;
    RegisterStack: undefined;
    ForgotPasswordStack: undefined;
    HomeTabHomeStack: undefined;
    HomeTabUserProfileStack: { userId: string };
}

export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HomeStack'>;
export type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LoginStack'>;
export type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RegisterStack'>;
export type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPasswordStack'>;
export type HomeTabHomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HomeTabHomeStack'>;
export type HomeTabUserProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HomeTabUserProfileStack'>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
    const {isLoggedIn, appIsReady} = useAppStateContext();

    if (!appIsReady) {
        return null;
    }

    if (appIsReady) {
        SplashScreen.hideAsync().catch((error) => console.warn(error));
    }

    return (
        <Stack.Navigator
            initialRouteName={isLoggedIn ? 'HomeStack' : 'LoginStack'}
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}>
            {
                isLoggedIn ? (
                    <Stack.Group>
                        <Stack.Screen name="HomeStack" component={MainScreen}/>
                    </Stack.Group>
                ) : (
                    <Stack.Group>
                        <Stack.Screen name="LoginStack" component={LoginScreen}/>
                        <Stack.Screen name="RegisterStack" component={RegisterScreen}/>
                        <Stack.Screen name="ForgotPasswordStack" component={ForgotPasswordScreen}/>
                    </Stack.Group>
                )
            }
        </Stack.Navigator>
    );
}
