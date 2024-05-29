import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Button, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

type Favorite = {
    id: number;
    title: string;
};

const Home: React.FC = () => {
    const [username, setUsername] = useState('');
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    useEffect(() => {
        const fetchUsername = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch('http://localhost:5000/api/user', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setUsername(data.username);
                    } else {
                        const errorData = await response.json();
                        console.error('Failed to fetch user data:', errorData.message);
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        const fetchFavorites = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch('http://localhost:5000/api/favorites', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setFavorites(data);
                    } else {
                        const errorData = await response.json();
                        console.error('Failed to fetch favorites:', errorData.message);
                    }
                } catch (error) {
                    console.error('Error fetching favorites:', error);
                }
            }
        };

        fetchUsername();
        fetchFavorites();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.contentTitle}>
                <Image style={styles.img} source={require('../assets/imgs/logo/logoCouleur.png')} />
                <Text style={styles.title}>Bienvenue dans ton salon {username}</Text>
            </View>
            <View style={styles.line}></View>
            <View style={styles.content}>
                <Button title="Films programmés" color="#C59417" onPress={() => navigation.navigate('FilmsProgrammes')} /> {/* Ajoutez onPress */}
                <View style={styles.lineBlack}></View>
                <Button title="Trouver mon film" color="#C59417" />
            </View>
            <View>
                <Text style={styles.titleFavoris}>
                    Mes films préférés
                </Text>
                <View style={styles.lineRed}></View>
                <View>
                    {favorites.length === 0 ? (
                        <Text style={styles.noFavoritesText}>Vos films favoris s'afficheront ici</Text>
                    ) : (
                        favorites.map(favorite => (
                            <Text key={favorite.id} style={styles.favoriteItem}>{favorite.title}</Text>
                        ))
                    )}
                </View>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={() => {
                AsyncStorage.removeItem('token');
                window.location.reload();
            }}>
                <Text style={styles.logoutButtonText}>Se déconnecter</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100vh',
        padding: 20,
        backgroundColor: '#0a0a0a',
    },
    contentTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    img: {
        width: 100,
        height: 100,
    },
    title: {
        flex: 1,
        fontFamily: 'Newsreader',
        fontSize: 18,
        fontWeight: 'bold',
        lineHeight: 24,
        color: '#fff',
        textTransform: 'uppercase',
        marginLeft: 10,
    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: '#F0D165',
        marginVertical: 20,
    },
    lineBlack: {
        width: '100%',
        height: 1,
        backgroundColor: '#000',
        marginVertical: 20,
    },
    content: {
        display: 'flex',
        marginBottom: 20,
        padding: 20,
    },
    titleFavoris: {
        fontFamily: 'Newsreader',
        fontSize: 18,
        fontWeight: 'bold',
        lineHeight: 24,
        color: '#fff',
        textTransform: 'uppercase',
        marginTop: 20,
    },
    lineRed: {
        width: '75%',
        height: 1,
        backgroundColor: '#891405',
        marginVertical: 10,
    },
    noFavoritesText: {
        fontFamily: 'Sen',
        color: '#fff',
        marginTop: 20,
        fontSize: 16,
    },
    favoriteItem: {
        fontFamily: 'Sen',
        color: '#fff',
        marginTop: 10,
        fontSize: 16,
    },
    logoutButton: {
        position: 'absolute',
        top: 550,
        right: 0,
        marginTop: 20,
        alignSelf: 'center',
        backgroundColor: '#891405',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    logoutButtonText: {
        color: '#F4F4F4',
        textTransform: 'uppercase',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default Home;