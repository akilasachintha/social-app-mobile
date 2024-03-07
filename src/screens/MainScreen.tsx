import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import TabNavigator from '@navigation/TabNavigator';
import PATHS from '@utils/paths';
import {ScrollDirection, useAppStateContext} from '@context/AppStateContext';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import THEME from "@utils/theme";

export default function MainScreen() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const {scrollDirection} = useAppStateContext();
    const headerOpacity = useSharedValue(1);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const overlayOpacity = useSharedValue(0);

    const contentMarginTop = useSharedValue(0);
    const snapPoints = useMemo(() => ['25%', '50%', '100%'], []);

    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    const handleClosePress = () => {
        bottomSheetRef.current?.close();
        setIsModalVisible(false);
        overlayOpacity.value = withTiming(0, { duration: 300 });
    }
    const handleOpenPress = () => {
        bottomSheetRef.current?.expand();
        overlayOpacity.value = withTiming(0.5, { duration: 300 });
        setIsModalVisible(true);
    }

    useEffect(() => {
        if (scrollDirection === ScrollDirection.Down) {
            headerOpacity.value = withTiming(0, {duration: 300});
            contentMarginTop.value = withTiming(-60, {duration: 300});
        } else if (scrollDirection === ScrollDirection.Up || scrollDirection === ScrollDirection.Top) {
            headerOpacity.value = withTiming(1, {duration: 300});
            contentMarginTop.value = withTiming(0, {duration: 300});
        }
    }, [scrollDirection]);

    const animatedHeaderStyle = useAnimatedStyle(() => ({
        opacity: headerOpacity.value,
    }));

    const animatedContentStyle = useAnimatedStyle(() => ({
        marginTop: contentMarginTop.value,
    }));

    const animatedOverlayStyle = useAnimatedStyle(() => ({
        opacity: overlayOpacity.value,
        backgroundColor: 'rgba(0,0,0,0.5)',
        ...StyleSheet.absoluteFillObject,
    }));

    return (
        <View style={styles.container}>
            <Animated.View style={[animatedOverlayStyle]} pointerEvents="none" />
            <Animated.View style={[styles.header, animatedHeaderStyle]}>
                <Image style={styles.logo} source={PATHS.LOGO_TEXT}/>
                <TouchableOpacity
                    onPress={handleOpenPress}
                >
                    <Image style={styles.avatar} source={PATHS.AVATAR}/>
                </TouchableOpacity>
            </Animated.View>
            <Animated.View style={[styles.contentContainer, animatedContentStyle]}>
                <TabNavigator/>
            </Animated.View>
            <BottomSheet
                enablePanDownToClose={true}
                index={-1}
                onClose={handleClosePress}
                handleIndicatorStyle={{backgroundColor: THEME.COLORS.WHITE}}
                backgroundStyle={{backgroundColor: THEME.COLORS.PRIMARY}}
                snapPoints={snapPoints}
                ref={bottomSheetRef}
                onChange={handleSheetChanges}
            >
                <BottomSheetScrollView
                    style={styles.contentContainer}>
                    <Text>Awesome 🎉</Text>
                </BottomSheetScrollView>
            </BottomSheet>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        height: 60,
        backgroundColor: '#fff',
    },
    logo: {
        width: "24%",
        height: 20,
        resizeMode: 'contain',
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
    },
    contentContainer: {
        flex: 1,
    },
});
