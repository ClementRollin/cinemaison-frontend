import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList, Movie } from '../navigation/AppNavigator';

type RecommendationsProps = StackScreenProps<RootStackParamList, 'Recommendations'>;

const Recommendations: React.FC<RecommendationsProps> = ({ route, navigation }) => {
    const { recommendations, genre } = route.params;

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Retour</Text>
            </TouchableOpacity>
            <Text style={styles.header}>Les films correspondants au genre {genre} :</Text>
            <FlatList
                data={recommendations}
                keyExtractor={(item) => item.movie_id ? item.movie_id.toString() : Math.random().toString()}
                renderItem={({ item }: { item: Movie }) => (
                    <View style={styles.movieItem}>
                        <Text style={styles.movieTitle}>{item.title}</Text>
                    </View>
                )}
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
    movieItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    movieTitle: {
        fontSize: 16,
        color: '#fff',
    },
});

export default Recommendations;