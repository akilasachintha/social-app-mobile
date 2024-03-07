import React, {useState} from 'react';
import {StyleSheet, Text, TextStyle, TouchableOpacity, View} from 'react-native';
import THEME from "@utils/theme";

interface LinkButtonProps {
    text: string;
    buttonText?: string;
    onPress: () => void;
    style?: TextStyle;
}

const LinkButton: React.FC<LinkButtonProps> = ({text, buttonText, onPress}) => {
    const [isPressed, setIsPressed] = useState<boolean>(false);

    const handlePressIn = () => {
        setIsPressed(true);
    };

    const handlePressOut = () => {
        setIsPressed(false);
    };

    return (
        <View style={styles.linkButtonContainer}>
            <Text style={styles.linkButtonText}>{text}</Text>
            <TouchableOpacity
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={onPress}
                activeOpacity={0.7}
            >
                <Text style={[styles.linkButton, isPressed && styles.underline]}>{buttonText}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    underline: {
        textDecorationLine: 'underline',
    },
    linkButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    linkButtonText: {
        color: THEME.COLORS.GREY,
        textAlign: 'center',
        paddingHorizontal: 5,
        paddingBottom: 0,
        fontSize: 12,
    },
    linkButton: {
        color: THEME.COLORS.BLUE,
        textAlign: 'center',
        paddingBottom: 0,
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default LinkButton;
