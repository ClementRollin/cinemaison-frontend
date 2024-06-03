import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList, Movie } from '../navigation/AppNavigator';

type RecommendationsProps = StackScreenProps<RootStackParamList, 'Recommendations'>;

const TMDB_BASE_URL = "https://image.tmdb.org/t/p/w500";

const Recommendations: React.FC<RecommendationsProps> = ({ route, navigation }) => {
    const { recommendations, genre } = route.params;

    const renderMovieItem = ({ item }: { item: Movie }) => {
        const imageUrl = item.poster_path ? `${TMDB_BASE_URL}${item.poster_path}` : null;
        return (
            <View style={styles.movieItem}>
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.poster} />
                ) : (
                    <Text style={styles.noPoster}>Pas d'affiche</Text>
                )}
                <Text style={styles.title}>{item.title || 'Sans titre'}</Text>
            </View>
        );
    };

    const keyExtractor = (item: Movie) => item.movie_id.toString();

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Retour</Text>
            </TouchableOpacity>
            <Text style={styles.header}>Les films correspondants au genre {genre} :</Text>
            <FlatList
                data={recommendations}
                renderItem={renderMovieItem}
                keyExtractor={keyExtractor}
                numColumns={2}
                contentContainerStyle={styles.flatListContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#0a0a0a',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    backButton: {
        backgroundColor: '#891405',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignSelf: 'flex-end',
        marginBottom: 20,
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
    noPoster: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 10,
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