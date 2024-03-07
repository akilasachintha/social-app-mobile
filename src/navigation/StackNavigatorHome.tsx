import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from "@screens/homeTab/HomeScreen";
import UserProfileScreen from "@screens/homeTab/UserProfileScreen";
import {RootStackParamList} from "@navigation/StackNavigator";


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigatorHome() {

    return (
        <Stack.Navigator
            initialRouteName={'HomeTabHomeStack'}
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}>
            <Stack.Group>
                <Stack.Screen name="HomeTabHomeStack" component={HomeScreen}/>
                <Stack.Screen name="HomeTabUserProfileStack" component={UserProfileScreen}/>
            </Stack.Group>
        </Stack.Navigator>
    );
}
