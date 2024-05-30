// components/Questionnaire.tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

interface Props {
    navigation: StackNavigationProp<RootStackParamList, 'Questionnaire'>;
}

const Questionnaire: React.FC<Props> = ({ navigation }) => {
    const [responses, setResponses] = useState({ mood: '', day: '', genre: '', duration: '' });
    const [recommendations, setRecommendations] = useState<string[]>([]);

    const handleChange = (name: string, value: string) => {
        setResponses({ ...responses, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/get-movie-recommendation', responses);
            setRecommendations(res.data.recommendations);
            navigation.navigate('Recommendations', { recommendations: res.data.recommendations }); // Navigate to recommendations screen if needed
        } catch (error) {
            console.error('Failed to get recommendations', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text>Quelle est votre humeur actuelle ?</Text>
            <Picker
                selectedValue={responses.mood}
                onValueChange={(itemValue: string) => handleChange('mood', itemValue)}
            >
                <Picker.Item label="Heureux" value="heureux" />
                <Picker.Item label="Triste" value="triste" />
                <Picker.Item label="Stressé" value="stressé" />
                <Picker.Item label="Fatigué" value="fatigué" />
                <Picker.Item label="Excité" value="excité" />
            </Picker>

            <Text>Comment s'est déroulée votre journée ?</Text>
            <Picker
                selectedValue={responses.day}
                onValueChange={(itemValue: string) => handleChange('day', itemValue)}
            >
                <Picker.Item label="Très bien" value="très bien" />
                <Picker.Item label="Moyenne" value="moyenne" />
                <Picker.Item label="Mauvaise" value="mauvaise" />
                <Picker.Item label="Très mauvaise" value="très mauvaise" />
            </Picker>

            <Text>Quel type de film préférez-vous regarder en ce moment ?</Text>
            <Picker
                selectedValue={responses.genre}
                onValueChange={(itemValue: string) => handleChange('genre', itemValue)}
            >
                <Picker.Item label="Comédie" value="comédie" />
                <Picker.Item label="Drame" value="drame" />
                <Picker.Item label="Action" value="action" />
                <Picker.Item label="Romance" value="romance" />
                <Picker.Item label="Thriller" value="thriller" />
            </Picker>

            <Text>Quelle durée de film préférez-vous ce soir ?</Text>
            <Picker
                selectedValue={responses.duration}
                onValueChange={(itemValue: string) => handleChange('duration', itemValue)}
            >
                <Picker.Item label="Moins de 1 heure" value="moins de 1 heure" />
                <Picker.Item label="1-2 heures" value="1-2 heures" />
                <Picker.Item label="Plus de 2 heures" value="plus de 2 heures" />
            </Picker>

            <Button title="Trouver mon film" onPress={handleSubmit} />

            <View>
                <Text>Recommandations de films :</Text>
                {recommendations.map((movie, index) => (
                    <Text key={index}>{movie}</Text>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
});

export default Questionnaire;