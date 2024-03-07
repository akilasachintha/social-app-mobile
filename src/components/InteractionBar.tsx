import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from 'react-native-reanimated';
import {FontAwesome5, Ionicons} from '@expo/vector-icons';

type InteractionBarProps = {
    likes: number;
    handleLike: () => void;
};

const InteractionBar: React.FC<InteractionBarProps> = ({likes, handleLike}) => {
    const scale = useSharedValue(1);

    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [{scale: scale.value}],
        };
    });

    const animateLike = () => {
        handleLike();
        scale.value = withSpring(1.1, {}, () => {
            scale.value = withSpring(1);
        });
    };

    return (
        <View style={styles.interactionBar}>
            <TouchableOpacity onPress={animateLike} style={styles.interactionItem}>
                <Animated.View style={styles.iconWithText}>
                    <Ionicons name={likes > 0 ? "heart" : "heart-outline"} size={24} color="#e95950"/>
                    <Text style={styles.interactionText}>{likes} Hearts</Text>
                </Animated.View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Comment')} style={styles.interactionItem}>
                <View style={styles.iconWithText}>
                    <FontAwesome5 name="comment" size={24} color="black"/>
                    <Text style={styles.interactionText}>Comment</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Share')} style={styles.interactionItem}>
                <View style={styles.iconWithText}>
                    <Ionicons name="share-social-outline" size={24} color="black"/>
                    <Text style={styles.interactionText}>Share</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    interactionBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 12,
        alignItems: 'center',
    },
    interactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    interactionText: {
        marginLeft: 4,
        fontSize: 12,
    },
    iconWithText: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default InteractionBar;
