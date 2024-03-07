import React, {useRef, useState} from 'react';
import {
    FlatList,
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import THEME from "@utils/theme";
import {ScrollDirection, useAppStateContext} from "@context/AppStateContext";

type AppStackParamList = {
    PostDetails: { postId: string };
};

type ProfileScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'PostDetails'>;

interface User {
    name: string;
    bio: string;
    avatarUrl: string;
    posts: number;
    followers: number;
    following: number;
    rating: number;
}

interface Post {
    id: string;
    imageUrl: string;
}

const userData: User = {
    name: 'Creative Explorer',
    bio: 'Discovering the world through lens | Art & Design',
    avatarUrl: 'https://via.placeholder.com/150',
    posts: 185,
    followers: 5278,
    following: 312,
    rating: 4.5,
};

const generatePosts = (): Post[] =>
    Array.from({length: 30}, (_, index) => ({
        id: String(index),
        imageUrl: `https://picsum.photos/seed/${index + 100}/200`,
    }));

const ProfileScreen: React.FC = () => {
    const navigation = useNavigation<ProfileScreenNavigationProp>();
    const colorScheme = useColorScheme();
    const [posts] = useState(generatePosts());
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
        <View style={[styles.container, {backgroundColor: colorScheme === 'dark' ? '#000' : '#fff'}]}>
            <FlatList
                stickyHeaderHiddenOnScroll={true}
                onScroll={handleScroll}
                scrollEventThrottle={100}
                ListHeaderComponent={
                    <View style={styles.profileHeader}>
                        <Image style={styles.avatar} source={{uri: userData.avatarUrl}}/>
                        <Text style={styles.name}>{userData.name}</Text>
                        <Text style={styles.bio}>{userData.bio}</Text>
                        <TouchableOpacity style={styles.followButton}>
                            <Text style={styles.followButtonText}>Follow</Text>
                        </TouchableOpacity>
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{userData.posts}</Text>
                                <Text style={styles.statLabel}>Posts</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{userData.followers}</Text>
                                <Text style={styles.statLabel}>Followers</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{userData.following}</Text>
                                <Text style={styles.statLabel}>Following</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{`${userData.rating} ★`}</Text>
                                <Text style={styles.statLabel}>Rating</Text>
                            </View>
                        </View>
                    </View>
                }
                data={posts}
                renderItem={({item}) => (
                    <View style={styles.postContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate('PostDetails', {postId: item.id})}>
                            <Image style={styles.postImage} source={{uri: item.imageUrl}}/>
                        </TouchableOpacity>
                    </View>
                )}
                keyExtractor={(item) => item.id}
                numColumns={2}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    profileHeader: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#333',
        marginBottom: 4,
    },
    bio: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 12,
    },
    followButton: {
        backgroundColor: THEME.COLORS.PRIMARY_BUTTON,
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    followButtonText: {
        color: '#ffffff',
        fontSize: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
    },
    postContainer: {
        flex: 1,
        padding: 2,
        flexDirection: 'column',
        alignItems: 'center',
    },
    postImage: {
        width: '100%',
        aspectRatio: 1,
    },
});

export default ProfileScreen;
