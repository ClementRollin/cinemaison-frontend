import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

type Movie = {
    movie_id: number;
    title: string;
    poster_path: string;
};

const TMDB_BASE_URL = "https://image.tmdb.org/t/p/w500";

const FilmsProgrammes: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [search, setSearch] = useState('');
    const navigation = useNavigation();

    const fetchMovies = async (page: number) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            try {
                setLoading(true);
                const response = await fetch(`http://10.104.131.172:5000/api/movies?page=${page}&limit=1116`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.length > 0) {
                        setMovies((prevMovies) => [...prevMovies, ...data]);
                        setFilteredMovies((prevMovies) => [...prevMovies, ...data]);
                        setHasMore(data.length === 20); // Vérifier si d'autres films sont disponibles
                    } else {
                        setHasMore(false); // Plus de films à charger
                    }
                } else {
                    console.error('Failed to fetch movies:', await response.text());
                }
            } catch (error) {
                console.error('Error fetching movies:', error);
            } finally {
                setLoading(false);
            }
        } else {
            console.error('No token found');
        }
    };

    useEffect(() => {
        fetchMovies(page);
    }, [page]);

    useEffect(() => {
        if (search === '') {
            setFilteredMovies(movies);
        } else {
            setFilteredMovies(movies.filter(movie => movie.title.toLowerCase().includes(search.toLowerCase())));
        }
    }, [search, movies]);

    const loadMoreMovies = () => {
        if (!loading && hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const renderMovieItem = ({ item }: { item: Movie }) => (
        <View style={styles.movieItem}>
            {item.poster_path && <Image source={{ uri: `${TMDB_BASE_URL}${item.poster_path}` }} style={styles.poster} />}
            <Text style={styles.title}>{item.title || 'Sans titre'}</Text>
        </View>
    );

    const keyExtractor = (item: Movie) => item.movie_id.toString();

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Retour</Text>
            </TouchableOpacity>
            <TextInput
                style={styles.searchBar}
                placeholder="Rechercher un film"
                placeholderTextColor="#888"
                value={search}
                onChangeText={setSearch}
            />
            <FlatList
                data={filteredMovies}
                renderItem={renderMovieItem}
                keyExtractor={keyExtractor}
                numColumns={2}
                contentContainerStyle={styles.flatListContent}
                onEndReached={loadMoreMovies}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading ? <ActivityIndicator size="large" color="#FFF" /> : null}
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
    searchBar: {
        backgroundColor: '#F0D165',
        color: '#000',
        borderRadius: 5,
        margin: 10,
        padding: 10,
        fontSize: 16,
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