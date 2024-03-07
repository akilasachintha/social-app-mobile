import React, {useCallback} from 'react';
import AuthScreen, {FormField, FormState, LinkButtonProps} from "./AuthScreen";
import {LoginScreenNavigationProp} from "@navigation/StackNavigator";
import {useNavigation} from "@react-navigation/native";
import useAuthHook from "@hooks/useAuthHook";
import {useAppStateContext} from "@context/AppStateContext";
import logger from "@utils/logger";

const initialFormState: FormState = {
    values: {email: '', password: ''},
    errors: {email: '', password: ''},
};

const formFields: FormField[] = [
    {
        name: 'email',
        label: 'Email',
        placeholder: 'Enter your email',
        secureTextEntry: false,
    },
    {
        name: 'password',
        label: 'Password',
        placeholder: 'Enter your password',
        secureTextEntry: true,
    },
];

const LoginScreen: React.FC = () => {
    const {validate, formState, setFormState} = useAuthHook(initialFormState);
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const {login, hideLoading} = useAppStateContext();

    const linkButton1: LinkButtonProps = {
        text: 'Reset Password',
        onPress: () => {
            navigation.navigate('ForgotPasswordStack');
            setFormState(initialFormState);
        },
    };

    const linkButton2: LinkButtonProps = {
        text: 'Don’t have an account?',
        buttonText: 'Sign up',
        onPress: () => {
            navigation.navigate('RegisterStack');
            setFormState(initialFormState);
        },
    };

    const handleSignIn = useCallback(async () => {
        try {
            if (!validate()) {
                return;
            }

            const result = await login(formState.values.email, formState.values.password);
            if (result) {
                navigation.replace('HomeStack');
                setFormState(initialFormState);
                hideLoading();
            }

        } catch (e: any) {
            logger.log({
                level: 'error',
                message: 'Failed to login',
                file: 'LoginScreen.tsx',
                method: 'handleSignIn',
                data: e.message,
            });
        }


    }, [validate, formState.values.email, formState.values.password, login, navigation, setFormState, hideLoading]);

    return (
        <AuthScreen
            title='Welcome to Fbook.'
            screenName='Sign In'
            handleSubmit={handleSignIn}
            formState={formState}
            setFormState={setFormState}
            formFields={formFields}
            linkButton1={linkButton1}
            linkButton2={linkButton2}
        />
    );
};

export default LoginScreen;
