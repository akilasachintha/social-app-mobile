import React, {useCallback} from 'react';
import AuthScreen, {FormField, FormState, LinkButtonProps} from "./AuthScreen";
import {LoginScreenNavigationProp} from "@navigation/StackNavigator";
import {useNavigation} from "@react-navigation/native";
import useAuthHook from "@hooks/useAuthHook";
import {useAppStateContext} from "@context/AppStateContext";

const initialFormState: FormState = {
    values: {
        email: '',
        fullName: '',
        password: '',
        confirmPassword: '',
    },
    errors: {
        email: '',
        fullName: '',
        password: '',
        confirmPassword: '',
    },
};

const formFields: FormField[] = [
    {
        name: 'fullName',
        label: 'Full Name',
        placeholder: 'Enter your full name',
        secureTextEntry: false,
    },
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

const RegisterScreen: React.FC = () => {
    const {validate, formState, setFormState} = useAuthHook(initialFormState);
    const {hideLoading} = useAppStateContext();
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const {login} = useAppStateContext();

    const linkButton2: LinkButtonProps = {
        text: 'Already have an account?',
        buttonText: 'Sign in',
        onPress: () => {
            navigation.navigate('LoginStack');
            setFormState(initialFormState);
        },
    };

    const handleSignUp = useCallback(async () => {
        if (!validate()) {
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
            title='Create an Account !'
            screenName='Sign Up'
            handleSubmit={handleSignUp}
            formState={formState}
            setFormState={setFormState}
            formFields={formFields}
            linkButton2={linkButton2}
        />
    );
};

export default RegisterScreen;
