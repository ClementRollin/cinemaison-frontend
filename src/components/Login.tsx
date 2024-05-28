import React, { useState } from 'react';
import {View, TextInput, Button, Text, StyleSheet, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    Home: undefined;
    Login: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
    navigation: LoginScreenNavigationProp;
};

const Login: React.FC<Props> = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
                const data = await response.json();
                await AsyncStorage.setItem('token', data.token);
                navigation.navigate('Home');
            } else {
                const errorData = await response.json();
                alert(`Connexion échouée: ${errorData.message}`);
            }
        } catch (error) {
            alert('Erreur inconnue');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Image source={ require('../assets/imgs/logo/logoCouleur.png') } style={{ width: 200, height: 200 }} />
                <Text style={styles.title}>Connexion</Text>
                <View style={styles.textInput}>
                    <TextInput
                        style={styles.input}
                        placeholder="Identifiant"
                        value={username}
                        onChangeText={setUsername}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Mot de passe"
                        value={password}
                        secureTextEntry
                        onChangeText={setPassword}
                    />
                </View>
                <Button title="Se connecter" onPress={handleLogin} color="#C59417"/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '93vh',
        margin: '0',
        padding: 20,
        backgroundColor: '#0a0a0a',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        height: '75%',
    },
    textInput: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    title: {
        fontFamily: 'Newsreader',
        fontSize: 20,
        marginBottom: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    input: {
        fontFamily: 'Sen',
        width: '80%',
        height: 40,
        borderColor: '#AD0000',
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
        borderRadius: 5,
        backgroundColor: '#F4F4F4',
        color: '#AD0000',
    },
});

export default Login;