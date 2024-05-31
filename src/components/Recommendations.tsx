import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList, Movie } from '../navigation/AppNavigator';

type RecommendationsProps = StackScreenProps<RootStackParamList, 'Recommendations'>;

const TMDB_BASE_URL = "https://image.tmdb.org/t/p/w500";

const Recommendations: React.FC<RecommendationsProps> = ({ route, navigation }) => {
    const { recommendations, genre } = route.params;

    const renderMovieItem = ({ item }: { item: Movie }) => (
        <View style={styles.movieItem}>
            {item.poster_path && <Image source={{ uri: `${TMDB_BASE_URL}${item.poster_path}` }} style={styles.poster} />}
            <Text style={styles.title}>{item.title || 'Sans titre'}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Retour</Text>
            </TouchableOpacity>
            <Text style={styles.header}>Les films correspondants au genre {genre} :</Text>
            <FlatList
                data={recommendations}
                renderItem={renderMovieItem}
                keyExtractor={(item) => item.movie_id ? item.movie_id.toString() : Math.random().toString()}
                numColumns={2}
                contentContainerStyle={styles.flatListContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    backButton: {
        backgroundColor: '#891405',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignSelf: 'flex-end',
        margin: 10,
    },
    backButtonText: {
        color: '#F4F4F4',
        textTransform: 'uppercase',
        fontSize: 14,
        fontWeight: 'bold',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        marginLeft: 25,
        color: '#fff',
    },
    flatListContent: {
        padding: 10,
    },
    movieItem: {
        flex: 1,
        margin: 10,
        backgroundColor: '#1a1a1a',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
    },
    poster: {
        width: '100%',
        height: 150,
        resizeMode: 'contain',
    },
    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 10,
    },
});

export default Recommendations;