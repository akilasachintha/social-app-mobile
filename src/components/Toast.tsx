import React, {useEffect, useRef} from "react";
import THEME from "@utils/theme";
import {Animated, StyleSheet, Text, TouchableOpacity} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import Constants from "expo-constants";

const Toast: React.FC<{ type: string; message: string; hideToast: () => void }> = ({type, message, hideToast}) => {
    const backgroundColor =
        type === 'warning'
            ? THEME.COLORS.WARNING
            : type === 'error'
                ? THEME.COLORS.ERROR
                : type === 'success'
                    ? THEME.COLORS.SUCCESS
                    : THEME.COLORS.INFO;

    const icon =
        type === 'warning'
            ? 'warning'
            : type === 'error'
                ? 'error'
                : type === 'success'
                    ? 'check-circle'
                    : 'info';

    const translateY = useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
        }).start();

        const timer = setTimeout(() => {
            Animated.timing(translateY, {
                toValue: -100,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }, 2000);

        return () => clearTimeout(timer);
    }, [translateY]);

    return (
        <Animated.View style={[styles.container, {backgroundColor, transform: [{translateY}]}]}>
            <MaterialIcons name={icon} size={24} color="white" style={styles.icon}/>
            <Text style={styles.text}>{message}</Text>
            <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
                <MaterialIcons name="close" size={20} color="white"/>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        top: Constants.statusBarHeight * 1.4 || 0,
        width: '94%',
        paddingHorizontal: 15,
        marginHorizontal: '3%',
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 10,
    },
    text: {
        color: THEME.COLORS.PRIMARY_BUTTON_TEXT,
        fontSize: 14,
        textAlign: 'center',
        paddingVertical: 10,
        flex: 1,
    },
    icon: {
        paddingRight: 10,
    },
    closeButton: {
        paddingLeft: 10,
    },
});

export default Toast;
