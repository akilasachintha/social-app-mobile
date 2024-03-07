import React, {useState} from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import PostHeader from "@components/PostHeader";
import InteractionBar from "@components/InteractionBar";

export type PostType = {
    id: string;
    userName: string;
    userImageUrl: string;
    content: string;
    imageUrl: string;
    likes: number;
    comments: number;
};

const Post: React.FC<{ post: PostType }> = ({post}) => {

    const [likes] = useState(post.likes);

    return (
        <View style={styles.postContainer}>
            <PostHeader
                userName={post.userName}
                userImageUrl={post.userImageUrl}
                createdAt="2 hours ago"
            />
            <Image source={{uri: post.imageUrl}} style={styles.postImage}/>
            <InteractionBar likes={post.likes} handleLike={() => {
            }}/>
            <View style={styles.postContent}>
                <Text style={styles.likes}>{likes} likes</Text>
                <Text style={styles.content}>{post.content}</Text>
                <Text style={styles.comments}>View all {post.comments} comments</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    postContainer: {
        backgroundColor: '#fff',
        marginBottom: 8,
        borderRadius: 8,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 8,
    },
    author: {
        fontWeight: 'bold',
    },
    postImage: {
        width: '100%',
        aspectRatio: 1,
    },
    interactionBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 12,
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    postContent: {
        padding: 8,
    },
    likes: {
        fontWeight: 'bold',
    },
    content: {
        marginTop: 4,
    },
    comments: {
        marginTop: 4,
        color: '#666',
    },
    listContent: {
        paddingBottom: 80,
    },
});

export default Post;
