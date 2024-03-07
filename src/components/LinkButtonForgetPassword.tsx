import React, {useState} from 'react';
import {StyleSheet, Text, TextStyle, TouchableOpacity} from 'react-native';
import THEME from "@utils/theme";

interface LinkButtonProps {
    text: string;
    onPress: () => void;
    style?: TextStyle;
}

const LinkButtonForgetPassword: React.FC<LinkButtonProps> = ({text, onPress}) => {
    const [isPressed, setIsPressed] = useState<boolean>(false);

    const handlePressIn = () => {
        setIsPressed(true);
    };

    const handlePressOut = () => {
        setIsPressed(false);
    };

    return (
        <TouchableOpacity
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={[styles.linkButton, isPressed && styles.underline]}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    underline: {
        textDecorationLine: 'underline',
    },
    linkButton: {
        color: THEME.COLORS.BLUE,
        textAlign: 'center',
        paddingHorizontal: 5,
        paddingBottom: 0,
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default LinkButtonForgetPassword;
