import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type RecommendationsProps = StackScreenProps<RootStackParamList, 'Recommendations'>;

const Recommendations: React.FC<RecommendationsProps> = ({ route }) => {
    const { recommendations } = route.params;
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Recommandations de films :</Text>
            {recommendations.map((movie: string, index: number) => (
                <Text key={index} style={styles.movie}>{movie}</Text>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    movie: {
        fontSize: 16,
        marginBottom: 5,
    },
});

export default Recommendations;