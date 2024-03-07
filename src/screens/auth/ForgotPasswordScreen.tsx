import React, {useCallback} from 'react';
import AuthScreen, {FormField, FormState, LinkButtonProps} from "./AuthScreen";
import {LoginScreenNavigationProp} from "@navigation/StackNavigator";
import {useNavigation} from "@react-navigation/native";
import useAuthHook from "@hooks/useAuthHook";
import {useAppStateContext} from "@context/AppStateContext";

const initialFormState: FormState = {
    values: {
        email: '',
        password: '',
        confirmPassword: '',
    },
    errors: {
        email: '',
        password: '',
        confirmPassword: '',
    },
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
    {
        name: 'confirmPassword',
        label: 'Confirm Password',
        placeholder: 'Enter your password again',
        secureTextEntry: true,
    },
];

const ForgotPasswordScreen: React.FC = () => {
    const {validate, setFormState, formState} = useAuthHook(initialFormState);
    const {hideLoading} = useAppStateContext();
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const {login} = useAppStateContext();

    const linkButton2: LinkButtonProps = {
        text: 'Remembered your password?',
        buttonText: 'Sign in',
        onPress: () => {
            navigation.navigate('LoginStack');
        },
    };

    const handleSignUp = useCallback(async () => {
        if (!validate()) {
            console.log("Form has errors");
            return;
        }

        const response = await login(formState.values.email, formState.values.password);
        console.log("response", response);
        if (response) {
            hideLoading();
            navigation.replace("HomeStack");
        }
        hideLoading();
    }, [formState.values.email, formState.values.password, hideLoading, navigation, validate, login]);

    return (
        <AuthScreen
            title='Forgot Password !'
            screenName='Change Password'
            handleSubmit={handleSignUp}
            formState={formState}
            setFormState={setFormState}
            formFields={formFields}
            linkButton2={linkButton2}
        />
    );
};

export default ForgotPasswordScreen;
