import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import {useNavigation} from "@react-navigation/native";
import {HomeTabHomeScreenNavigationProp} from "@navigation/StackNavigator";

interface PostHeaderProps {
    userName: string;
    userImageUrl: string;
    createdAt: string;
}

const PostHeader: React.FC<PostHeaderProps> = ({userName, userImageUrl, createdAt}) => {
    const navigation = useNavigation<HomeTabHomeScreenNavigationProp>();

    const handlePress = () => {
        navigation.navigate('HomeTabUserProfileStack', {userId: userName});
    }

    return (
        <View style={styles.container}>
            <Image source={{uri: userImageUrl}} style={styles.avatar}/>
            <TouchableOpacity
                onPress={handlePress}
                style={styles.textContainer}>
                <Text style={styles.author}>{userName}</Text>
                <Text style={styles.createdAt}>{createdAt}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
                <MaterialIcons name="more-vert" size={24} color="black"/>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        justifyContent: 'space-between',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    author: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    createdAt: {
        fontSize: 12,
        color: '#666',
    },
    iconButton: {
        padding: 8,
    },
});

export default PostHeader;
