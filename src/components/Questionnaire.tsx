import React, { useState, useRef } from 'react';
import { View, Text, Button, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import Svg, { G, Path, Text as SvgText, Polygon } from 'react-native-svg';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Movie } from '../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
    navigation: StackNavigationProp<RootStackParamList, 'Questionnaire'>;
}

const genres = [
    'Science-fiction',
    'Thriller',
    'Comédie',
    'Drame',
    'Action',
    'Romance',
    'Fantastique',
    'Horreur'
];

const colors = ['#FF6347', '#FFA500', '#FFD700', '#ADFF2F', '#40E0D0', '#1E90FF', '#9370DB', '#FF69B4'];

const Questionnaire: React.FC<Props> = ({ navigation }) => {
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const spinValue = useRef(new Animated.Value(0)).current;

    const getGenreByRotation = (rotation: number) => {
        const segmentAngle = 360 / genres.length;
        const adjustedRotation = rotation % 360;
        const index = Math.floor(adjustedRotation / segmentAngle);
        console.log(`Rotation: ${rotation}, Adjusted Rotation: ${adjustedRotation}, Index: ${index}, Genre: ${genres[index]}`);
        return genres[index];
    };

    const spinWheel = () => {
        if (isSpinning) return;

        setIsSpinning(true);
        const randomDuration = Math.floor(Math.random() * 3000) + 2000; // 2 to 5 seconds
        const randomValue = Math.floor(Math.random() * 3600) + 3600; // More randomization
        const spinToValue = randomValue;

        Animated.timing(spinValue, {
            toValue: spinToValue,
            duration: randomDuration,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
        }).start(() => {
            setIsSpinning(false);
            const finalRotation = spinToValue % 360;
            const genre = getGenreByRotation(finalRotation);
            setSelectedGenre(genre);
            setTimeout(() => {
                fetchRecommendations(genre);
            }, 2000);
        });
    };

    const fetchRecommendations = async (genre: string) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`http://10.104.131.172:5000/api/movies?genre=${genre}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const movies: Movie[] = response.data;
            setTimeout(() => {
                navigation.navigate('Recommendations', { recommendations: movies, genre });
            }, 500);
        } catch (error) {
            console.error('Failed to fetch recommendations', error);
        }
    };

    const spin = spinValue.interpolate({
        inputRange: [0, 360],
        outputRange: ['0deg', '360deg'],
    });

    const generateWheel = () => {
        const numSegments = genres.length;
        const angle = 360 / numSegments;

        return genres.map((genre, index) => {
            const startAngle = index * angle;
            const endAngle = startAngle + angle;

            const largeArcFlag = angle > 180 ? 1 : 0;

            const startX = 150 + 150 * Math.cos((startAngle * Math.PI) / 180);
            const startY = 150 + 150 * Math.sin((startAngle * Math.PI) / 180);
            const endX = 150 + 150 * Math.cos((endAngle * Math.PI) / 180);
            const endY = 150 + 150 * Math.sin((endAngle * Math.PI) / 180);

            const textX = 150 + 85 * Math.cos(((startAngle + angle / 2) * Math.PI) / 180);
            const textY = 150 + 85 * Math.sin(((startAngle + angle / 2) * Math.PI) / 180);

            return (
                <G key={genre}>
                    <Path
                        d={`M150 150 L ${startX} ${startY} A 150 150 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                        fill={colors[index % colors.length]}
                        stroke="#000"
                        strokeWidth="1"
                    />
                    <SvgText
                        x={textX}
                        y={textY}
                        fill="#000"
                        fontSize="14"
                        fontWeight="bold"
                        textAnchor="middle"
                        transform={`rotate(${startAngle + angle / 2}, ${textX}, ${textY})`}
                    >
                        {genre}
                    </SvgText>
                </G>
            );
        });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Retour</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Tournez la roue pour sélectionner un genre de film</Text>
            <View style={styles.roueContainer}>
                <Svg height="30" width="30" viewBox="0 0 24 24" style={styles.triangle}>
                    <Polygon points="12,24 24,0 0,0" fill="#FF6347" />
                </Svg>
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                    <Svg height="300" width="300" viewBox="0 0 300 300">
                        <G>
                            {generateWheel()}
                        </G>
                    </Svg>
                </Animated.View>
            </View>
            <Button title="Tourner la roue" color="#C59417" onPress={spinWheel} disabled={isSpinning} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100vh',
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
    title: {
        marginBottom: 20,
        fontFamily: 'Newsreader',
        fontSize: 18,
        fontWeight: 'bold',
        lineHeight: 24,
        color: '#fff',
        textTransform: 'uppercase',
    },
    roueContainer: {
        marginTop: 20,
        marginBottom: 50,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    triangle: {
        position: 'absolute',
        top: -20,
        zIndex: 1,
    },
});

export default Questionnaire;