import {useState} from "react";
import {validateField} from "@components/TextInputField";

type FormValues = {
    [key: string]: string;
};

type FormErrors = {
    [key in keyof FormValues]?: string;
};

type FormState = {
    values: FormValues;
    errors: FormErrors;
};

export default function useAuthHook(initialState: FormState) {
    const [formState, setFormState] = useState<FormState>(initialState);

    const validate = (): boolean => {
        let isValid = true;
        const errors: FormErrors = {};

        Object.keys(formState.values).forEach(key => {
            if (key !== 'confirmPassword') {
                const error = validateField({
                    name: key,
                    value: formState.values[key],
                    passwordValue: formState.values.password
                });
                if (error) {
                    isValid = false;
                }
                errors[key as keyof FormValues] = error;
            }
        });

        if ('confirmPassword' in formState.values) {
            const confirmPasswordError = validateField({
                name: 'confirmPassword',
                value: formState.values.confirmPassword,
                passwordValue: formState.values.password
            });
            if (confirmPasswordError) {
                isValid = false;
            }

            errors.confirmPassword = confirmPasswordError;
        }

        setFormState(current => ({
            ...current,
            errors: errors
        }));

        console.log('errors', errors);
        console.log('isValid', isValid);
        return isValid;
    };

    return {validate, formState, setFormState};
}
