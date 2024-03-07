import React, {useState} from 'react';
import {FlatList, Image, Keyboard, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import PostHeader from "@components/PostHeader";

interface PostType {
    id: string;
    imageUrl: string;
}

interface UserProfile {
    id: string;
    name: string;
    imageUrl: string;
    location: string;
}

// Sample Data
const PUBLIC_POSTS: PostType[] = Array.from({length: 100}, (_, index) => ({
    id: String(index),
    imageUrl: `https://picsum.photos/seed/post${index}/200`,
}));

const USER_PROFILES: UserProfile[] = Array.from({length: 20}, (_, index) => ({
    id: String(index),
    name: `User ${index + 1}`,
    imageUrl: `https://randomuser.me/api/portraits/thumb/men/${index}.jpg`,
    location: `Location ${index + 1}`,
}));

const SearchScreen: React.FC = () => {
    const [searchFocused, setSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleBackPress = () => {
        setSearchFocused(false);
        setSearchQuery('');
        Keyboard.dismiss();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                {searchFocused && (
                    <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="black"/>
                    </TouchableOpacity>
                )}
                <TextInput
                    style={[styles.input, searchFocused && styles.inputFocused]}
                    placeholder="Search users..."
                    onFocus={() => setSearchFocused(true)}
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                />
            </View>
            {searchFocused ? (
                <FlatList
                    data={USER_PROFILES.filter(profile =>
                        profile.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )}
                    renderItem={({item}) => (
                        <View style={{marginHorizontal: 10}}>
                            <PostHeader userName={item.name} userImageUrl={item.imageUrl} createdAt={item.location}/>
                        </View>
                    )}
                    keyExtractor={(item) => `profile-${item.id}`}
                    key="profiles-list"
                />
            ) : (
                <FlatList
                    data={PUBLIC_POSTS}
                    renderItem={({item}) => (
                        <TouchableOpacity style={styles.itemContainer}>
                            <Image source={{uri: item.imageUrl}} style={styles.image}/>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => `post-${item.id}`}
                    numColumns={3}
                    key="posts-grid"
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    backButton: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingLeft: 10,
        marginVertical: 10,
    },
    inputFocused: {
        backgroundColor: '#fff',
    },
    itemContainer: {
        flex: 1 / 3,
        aspectRatio: 1,
        padding: 2,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    name: {
        fontWeight: 'bold',
    },
    location: {
        fontSize: 12,
    },
});

export default SearchScreen;
