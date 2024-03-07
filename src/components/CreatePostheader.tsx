import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {FontAwesome, MaterialIcons} from "@expo/vector-icons";
import React from "react";
import PATHS from "@utils/paths";

type CreatePostHeaderProps = {
    userName: string;
    userImageUrl: string;
};

const CreatePostHeader: React.FC<CreatePostHeaderProps> = ({userName, userImageUrl}) => {
    return (
        <View style={styles.container}>
            <Image source={PATHS.AVATAR} style={styles.avatar}/>
            <Text style={styles.prompt}>{`What's on your mind?`}</Text>
            <View style={styles.iconsContainer}>
                <TouchableOpacity>
                    <FontAwesome name="photo" size={24} color="skyblue" style={styles.icon}/>
                </TouchableOpacity>
                <TouchableOpacity>
                    <MaterialIcons name="location-pin" size={24} color="lightgreen" style={styles.icon}/>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    prompt: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        color: '#888',
    },
    iconsContainer: {
        flexDirection: 'row',
    },
    icon: {
        marginLeft: 10,
    },
});

export default CreatePostHeader;
