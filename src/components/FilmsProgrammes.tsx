import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

type Movie = {
    id: number;
    title: string;
    poster_path: string;
};

const TMDB_BASE_URL = "https://image.tmdb.org/t/p/w500";

const FilmsProgrammes: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchMovies = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch('http://10.104.131.172:5000/api/movies', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setMovies(data);
                    } else {
                        console.error('Failed to fetch movies:', await response.text());
                    }
                } catch (error) {
                    console.error('Error fetching movies:', error);
                }
            } else {
                console.error('No token found');
            }
        };

        fetchMovies();
    }, []);

    const renderMovieItem = ({ item }: { item: Movie }) => (
        <View style={styles.movieItem}>
            {item.poster_path && <Image source={{ uri: `${TMDB_BASE_URL}${item.poster_path}` }} style={styles.poster} />}
            <Text style={styles.title}>{item.title || 'Sans titre'}</Text>
        </View>
    );

    const keyExtractor = (item: Movie) => item.id ? item.id.toString() : `${Math.random()}`;

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Retour</Text>
            </TouchableOpacity>
            <FlatList
                data={movies}
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

export default FilmsProgrammes;