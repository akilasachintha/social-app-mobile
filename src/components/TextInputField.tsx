import {Text, TextInput} from "react-native-paper";
import React, {useState} from "react";
import {StyleSheet} from "react-native";
import THEME from "@utils/theme";
import {FormState} from "@screens/auth/AuthScreen";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {useAppStateContext} from "@context/AppStateContext";

type TextInputFieldProps = {
    name: string;
    label: string;
    field: string;
    fieldError: string | undefined;
    setFormState: React.Dispatch<React.SetStateAction<FormState>>;
    secureTextEntry?: boolean;
}

export type ValidateFieldParams = {
    name: string,
    value: string,
    passwordValue?: string
};

export const validateField = ({name, value, passwordValue}: ValidateFieldParams): string | undefined => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    const fullNameRegex = /^[a-zA-Z]+ [a-zA-Z]+$/;

    if (name === 'email') {
        if (!value) return 'Email is required';
        if (!emailRegex.test(value)) return 'Invalid email format';
    } else if (name === 'password') {
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
    } else if (name === 'fullName') {
        if (!value) return 'Full name is required';
        if (!fullNameRegex.test(value)) return 'Full name must include at least first and last name';
    } else if (name === 'confirmPassword') {
        if (!value) return 'Confirm password is required';
        if (value !== passwordValue) return 'Passwords do not match';
    }

    return undefined;
};

const TextInputField: React.FC<TextInputFieldProps> = ({
                                                           name,
                                                           label,
                                                           field,
                                                           fieldError,
                                                           setFormState,
                                                           secureTextEntry
                                                       }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const {isLoading} = useAppStateContext();

    const handleChange = (name: string, value: string) => {
        setFormState((current) => {
            const newValues = {...current.values, [name]: value};

            const newErrors = {
                ...current.errors,
                [name]: validateField({name: name, value: value, passwordValue: newValues.password})
            };

            if (name === 'password' && 'confirmPassword' in current.values) {
                newErrors['confirmPassword'] = validateField({
                    name: 'confirmPassword',
                    value: current.values.confirmPassword,
                    passwordValue: value
                });
            }

            return {
                values: newValues,
                errors: newErrors
            };
        });
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    }

    const getRightIcon = () => {
        if (!secureTextEntry) {
            if (fieldError && field.length > 0) {
                return <MaterialCommunityIcons name="close-circle" color={THEME.COLORS.ERROR} size={24}/>;
            }
            if (field.length > 0) {
                return <MaterialCommunityIcons name="check-circle" color={THEME.COLORS.SUCCESS} size={24}/>;
            }
        } else {
            if (field.length > 0) {
                return (
                    <MaterialCommunityIcons
                        name={isPasswordVisible ? 'eye' : 'eye-off'}
                        color={fieldError ? THEME.COLORS.ERROR : THEME.COLORS.SUCCESS}
                        size={24}
                        onPress={togglePasswordVisibility}
                    />
                );
            }
        }

        return null;
    };


    return (
        <>
            <TextInput
                label={label}
                value={field}
                disabled={isLoading}
                onChangeText={(value) => handleChange(name, value)}
                mode="outlined"
                secureTextEntry={secureTextEntry ? !isPasswordVisible : false}
                style={styles.input}
                error={!!fieldError}
                textColor={THEME.COLORS.PRIMARY_TEXT}
                placeholderTextColor={THEME.COLORS.GREY}
                theme={{
                    roundness: 10,
                    colors: {
                        background: THEME.COLORS.PRIMARY_BACKGROUND,
                        text: THEME.COLORS.GREY,
                        primary: !!fieldError ? THEME.COLORS.ERROR : field.length > 0 ? THEME.COLORS.SUCCESS : THEME.COLORS.GREY,
                        outline: !!fieldError ? THEME.COLORS.ERROR : field.length > 0 ? THEME.COLORS.SUCCESS : THEME.COLORS.GREY,
                    },
                }}
                right={getRightIcon()}
            />
            {!!fieldError && <Text style={styles.errorText}>{fieldError}</Text>}
        </>
    )
}

const styles = StyleSheet.create({
    input: {
        marginBottom: 10,
    },
    errorText: {
        fontSize: 12,
        color: THEME.COLORS.ERROR,
        marginBottom: 10,
    },
});

export default TextInputField;
