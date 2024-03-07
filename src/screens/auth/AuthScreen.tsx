import React, {useEffect, useState} from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import {Text} from "react-native-paper";
import TextInputField from "@components/TextInputField";
import THEME from "@utils/theme";
import {StatusBar} from "expo-status-bar";
import LinkButton from "@components/LinkButton";
import PATHS from "@utils/paths";
import LinkButtonForgetPassword from "@components/LinkButtonForgetPassword";
import {useAppStateContext} from "@context/AppStateContext";

const {height} = Dimensions.get("screen");

export interface FormState {
    values: {
        [key: string]: string;
    };
    errors: {
        [key: string]: string | undefined;
    };
}

export type FormField = {
    name: string;
    label: string;
    placeholder: string;
    secureTextEntry: boolean;
}

export type LinkButtonProps = {
    text: string;
    buttonText?: string;
    onPress: () => void;
}

type AuthScreenProps = {
    screenName: string;
    title: string;
    formFields: FormField[];
    formState: FormState;
    setFormState: React.Dispatch<React.SetStateAction<FormState>>;
    handleSubmit: () => void;
    linkButton1?: LinkButtonProps;
    linkButton2?: LinkButtonProps;
}

const AuthScreen: React.FC<AuthScreenProps> = ({
                                                   screenName,
                                                   title,
                                                   formState,
                                                   setFormState,
                                                   formFields,
                                                   handleSubmit,
                                                   linkButton1,
                                                   linkButton2
                                               }) => {
    const [isKeyboardVisible, setKeyboardVisible] = useState<boolean>(false);
    const {isLoading} = useAppStateContext()

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    console.log(isLoading);

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}>
                <View style={[styles.bottomContainer, isKeyboardVisible && styles.bottomContainerWithKeyboard]}>
                    {!isKeyboardVisible && (
                        <View style={styles.topImageContainer}>
                            <Image source={PATHS.LOGO} style={styles.topImage}/>
                        </View>
                    )}

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>Nature your mind. Unite in mediation.</Text>


                    {formFields.map((field: FormField) => (
                        <TextInputField
                            key={field.name}
                            name={field.name}
                            label={field.label}
                            secureTextEntry={field.secureTextEntry}
                            field={formState.values[field.name]}
                            fieldError={formState.errors[field.name]}
                            setFormState={setFormState}
                        />
                    ))}

                    <View style={{alignItems: 'flex-end', margin: 0}}>
                        {
                            linkButton1 && linkButton1.text && (
                                <LinkButtonForgetPassword
                                    text={linkButton1.text}
                                    onPress={linkButton1.onPress}
                                />
                            )
                        }
                    </View>

                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={isLoading}
                        style={[styles.button, {backgroundColor: THEME.COLORS.PRIMARY_BUTTON}]}
                        activeOpacity={0.7}
                    >
                        {isLoading ? (
                            <View style={styles.activityIndicatorContainer}>
                                <ActivityIndicator size={25} color={THEME.COLORS.PRIMARY_BUTTON_TEXT}/>
                            </View>
                        ) : (
                            <Text style={styles.buttonText}>{screenName}</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.linkButtonStyles}>
                        {
                            linkButton2 && linkButton2.text && (
                                <LinkButton
                                    buttonText={linkButton2.buttonText}
                                    text={linkButton2.text}
                                    onPress={linkButton2.onPress}
                                />
                            )
                        }
                    </View>
                    <StatusBar style="dark"
                               backgroundColor={isKeyboardVisible ? THEME.COLORS.WHITE : THEME.COLORS.PRIMARY_BACKGROUND}/>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.COLORS.PRIMARY_BACKGROUND,
    },
    topImageContainer: {
        resizeMode: 'cover',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: height * 0.2,
        marginBottom: 40,
    },
    topImage: {
        width: '100%',
        height: 100,
        resizeMode: 'contain',
    },
    bottomContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        backgroundColor: THEME.COLORS.PRIMARY_BACKGROUND,
    },
    bottomContainerWithKeyboard: {
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'left',
        marginLeft: 4,
        color: THEME.COLORS.PRIMARY_TEXT,
    },
    subtitle: {
        marginBottom: '10%',
        textAlign: 'left',
        marginLeft: 4,
        color: THEME.COLORS.GREY,
    },
    button: {
        marginTop: 20,
        padding: '4%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    buttonText: {
        color: THEME.COLORS.PRIMARY_BUTTON_TEXT,
        fontWeight: 'bold',
        fontSize: 18,
    },
    activityIndicatorContainer: {
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
    },
    forgotPassword: {
        marginTop: 10,
        textAlign: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 20,
    },
    signUpText: {
        textAlign: 'center',
    },
    linkButtonStyles: {
        marginTop: 20,
    },
    linkButton: {
        color: THEME.COLORS.PRIMARY_TEXT,
        textAlign: 'center',
        paddingVertical: '2%',
        fontSize: 12,
    },
});
export default AuthScreen;
