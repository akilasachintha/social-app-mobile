// BottomModal.tsx
import React, {ReactNode} from 'react';
import {Dimensions, LayoutChangeEvent, StyleSheet, Text, TouchableWithoutFeedback} from 'react-native';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import {StatusBar} from "expo-status-bar";
import THEME from "@utils/theme";

interface BottomModalProps {
    isVisible: boolean;
    onClose: () => void;
    children: ReactNode;
}

const screenHeight = Dimensions.get('window').height;

const BottomModal: React.FC<BottomModalProps> = ({isVisible, onClose, children}) => {
    const modalHeight = useSharedValue(screenHeight);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{translateY: modalHeight.value}],
    }));

    const onLayout = (event: LayoutChangeEvent): void => {
        const contentHeight = event.nativeEvent.layout.height;
        modalHeight.value = withTiming(isVisible ? screenHeight - contentHeight : screenHeight, {duration: 500});
    };

    return (
        <TouchableWithoutFeedback onPress={onClose} style={{zIndex: 0}}>
            <Animated.View style={[styles.overlay, !isVisible && styles.hidden]}>
                <Animated.View style={[styles.modal, animatedStyle]} onLayout={onLayout}>
                    <Text>Bottom Modal</Text>
                    {children}
                    <StatusBar style="auto"
                               backgroundColor={isVisible ? THEME.COLORS.MODAL_BACKGROUND : THEME.COLORS.PRIMARY_BACKGROUND}/>
                </Animated.View>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    hidden: {
        display: 'none',
    },
    modal: {
        backgroundColor: 'white',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        minHeight: 200,
        padding: 16,
    },
});

export default BottomModal;
