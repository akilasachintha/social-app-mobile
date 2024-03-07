import React, {useRef, useState} from 'react';
import {FlatList, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import CreatePostHeader from "@components/CreatePostheader";
import PATHS from "@utils/paths";
import {ScrollDirection, useAppStateContext} from "@context/AppStateContext";
import Post, {PostType} from "@components/Post";

const initialPosts: PostType[] = [
    {
        "id": "1",
        "userName": "Jane Doe",
        "userImageUrl": "https://via.placeholder.com/150",
        "content": "Here is the first post content",
        "imageUrl": "https://picsum.photos/seed/1/600",
        "likes": 10,
        "comments": 2
    },
    {
        "id": "2",
        "userName": "John Smith",
        "userImageUrl": "https://via.placeholder.com/150",
        "content": "This is another example of a post",
        "imageUrl": "https://picsum.photos/seed/2/600",
        "likes": 5,
        "comments": 1
    },
    {
        "id": "3",
        "userName": "Emily Johnson",
        "userImageUrl": "https://via.placeholder.com/150",
        "content": "Exploring the beauty of nature",
        "imageUrl": "https://picsum.photos/seed/3/600",
        "likes": 15,
        "comments": 3
    },
    {
        "id": "4",
        "userName": "Michael Brown",
        "userImageUrl": "https://via.placeholder.com/150",
        "content": "A day at the beach",
        "imageUrl": "https://picsum.photos/seed/4/600",
        "likes": 8,
        "comments": 2
    },
    {
        "id": "5",
        "userName": "Jessica Garcia",
        "userImageUrl": "https://via.placeholder.com/150",
        "content": "City lights at night",
        "imageUrl": "https://picsum.photos/seed/5/600",
        "likes": 12,
        "comments": 4
    },
    {
        "id": "6",
        "userName": "William Davis",
        "userImageUrl": "https://via.placeholder.com/150",
        "content": "The serene mountains",
        "imageUrl": "https://picsum.photos/seed/6/600",
        "likes": 20,
        "comments": 5
    },
    {
        "id": "7",
        "userName": "Linda Martinez",
        "userImageUrl": "https://via.placeholder.com/150",
        "content": "Delicious homemade cake",
        "imageUrl": "https://picsum.photos/seed/7/600",
        "likes": 18,
        "comments": 6
    },
    {
        "id": "8",
        "userName": "Richard Hernandez",
        "userImageUrl": "https://via.placeholder.com/150",
        "content": "A walk in the park",
        "imageUrl": "https://picsum.photos/seed/8/600",
        "likes": 22,
        "comments": 2
    },
    {
        "id": "9",
        "userName": "Patricia Moore",
        "userImageUrl": "https://via.placeholder.com/150",
        "content": "Sunset over the lake",
        "imageUrl": "https://picsum.photos/seed/9/600",
        "likes": 19,
        "comments": 3
    },
    {
        "id": "10",
        "userName": "Charles Taylor",
        "userImageUrl": "https://via.placeholder.com/150",
        "content": "Early morning jog",
        "imageUrl": "https://picsum.photos/seed/10/600",
        "likes": 9,
        "comments": 1
    },
    {
        "id": "11",
        "userName": "Barbara Wilson",
        "userImageUrl": "https://via.placeholder.com/150",
        "content": "Garden flowers in bloom",
        "imageUrl": "https://picsum.photos/seed/11/600",
        "likes": 14,
        "comments": 2
    },
    {
        "id": "12",
        "userName": "Susan Jones",
        "userImageUrl": "https://via.placeholder.com/150",
        "content": "Fresh snowfall",
        "imageUrl": "https://picsum.photos/seed/12/600",
        "likes": 11,
        "comments": 3
    },
    {
        "id": "13",
        "userName": "James Miller",
        "userImageUrl": "https://via.placeholder.com/150",
        "content": "Quiet forest path",
        "imageUrl": "https://picsum.photos/seed/13/600",
        "likes": 16,
        "comments": 4
    },
    {
        "id": "14",
        "userName": "Elizabeth Wilson",
        "userImageUrl": "https://via.placeholder.com/150",
        "content": "Book and coffee",
        "imageUrl": "https://picsum.photos/seed/14/600",
        "likes": 7,
        "comments": 1
    },
    {
        "id": "15",
        "userName": "Robert Anderson",
        "userImageUrl": "https://via.placeholder.com/150",
        "content": "Rainy day window view",
        "imageUrl": "https://picsum.photos/seed/15/600",
        "likes": 13,
        "comments": 2
    },
    {
        "id": "16",
        "userName": "Mary Thomas",
        "userImageUrl": "https://via.placeholder.com/150",
        "content": "Art museum visit",
        "imageUrl": "https://picsum.photos/seed/16/600",
        "likes": 17,
        "comments": 5
    },
    {
        "id": "17",
        "userName": "Joseph Martinez",
        "userImageUrl": "https://via.placeholder.com/150",
        "content": "Picnic in the countryside",
        "imageUrl": "https://picsum.photos/seed/17/600",
        "likes": 10,
        "comments": 2
    },
    {
        "id": "18",
        "userName": "Margaret Hernandez",
        "userImageUrl": "https://via.placeholder.com/150",
        "content": "Autumn leaves",
        "imageUrl": "https://picsum.photos/seed/18/600",
        "likes": 21,
        "comments": 4
    },
    {
        "id": "19",
        "userName": "Thomas Martinez",
        "userImageUrl": "https://via.placeholder.com/150",
        "content": "Street art discovery",
        "imageUrl": "https://picsum.photos/seed/19/600",
        "likes": 8,
        "comments": 3
    },
    {
        "id": "20",
        "userName": "Sarah Lewis",
        "userImageUrl": "https://via.placeholder.com/150",
        "content": "Cozy winter evening",
        "imageUrl": "https://picsum.photos/seed/20/600",
        "likes": 24,
        "comments": 7
    }
];


const HomeScreen: React.FC = () => {
    const [posts] = useState<PostType[]>(initialPosts);
    const lastScrollY = useRef<number>(0);
    const {setScrollDirection, scrollDirection} = useAppStateContext();

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;

        if (currentScrollY === 0) {
            setScrollDirection(ScrollDirection.Top);
        } else if (currentScrollY > lastScrollY.current) {
            setScrollDirection(ScrollDirection.Down);
        } else if (currentScrollY < lastScrollY.current) {
            setScrollDirection(ScrollDirection.Up);
        }

        console.log(scrollDirection);

        lastScrollY.current = currentScrollY;
    };

    return (
        <View style={styles.container}>
            <FlatList
                stickyHeaderHiddenOnScroll={true}
                onScroll={handleScroll}
                scrollEventThrottle={100}
                showsVerticalScrollIndicator={false}
                data={posts}
                renderItem={({item}) => <Post post={item}/>}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <CreatePostHeader
                        userName="John Doe" userImageUrl={PATHS.AVATAR}/>
                }
            />
            <StatusBar style="auto"/>
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

export default HomeScreen;


