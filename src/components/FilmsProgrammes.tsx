import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

type Movie = {
    id: number;
    title: string;
    poster_path: string;
};

const FilmsProgrammes: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/movies', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setMovies(data);
                } else {
                    const errorData = await response.json();
                    console.error('Failed to fetch movies:', errorData.message);
                }
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        fetchMovies();
    }, []);

    const renderMovieItem = ({ item }: { item: Movie }) => (
        <View style={styles.movieItem}>
            <Image source={{ uri: item.poster_path }} style={styles.poster} />
            <Text style={styles.title}>{item.title}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={movies}
                renderItem={renderMovieItem}
                keyExtractor={item => item.id.toString()}
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
        resizeMode: 'cover',
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