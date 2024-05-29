import React, { useState } from 'react';
import {View, TextInput, Button, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    Login: undefined;
    Register: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

type Props = {
    navigation: RegisterScreenNavigationProp;
};

const Register: React.FC<Props> = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas!");
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, confirmPassword }),
            });
            if (response.ok) {
                navigation.navigate('Login');
            } else {
                const errorData = await response.json();
                alert(`Inscription échouée: ${errorData.message}`);
            }
        } catch (error) {
            alert('Erreur inconnue');
        }
    };

    return (
        <View style={styles.containerBody}>
            <View style={styles.container}>
                <Image source={ require('../assets/imgs/logo/logoCouleur.png') } style={{ width: 200, height: 200 }} />
                <Text style={styles.title}>Inscription</Text>
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
                    <TextInput
                        style={styles.input}
                        placeholder="Confirmer votre mot de passe"
                        value={confirmPassword}
                        secureTextEntry
                        onChangeText={setConfirmPassword}
                    />
                </View>
                <Button title="S'inscrire" onPress={handleRegister} color="#C59417" />
                <TouchableOpacity style={styles.Inscription} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginText}>Vous avez déjà un compte ? <Text style={styles.loginLink}>Connectez-vous</Text></Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    containerBody: {
        backgroundColor: '#0a0a0a',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    container: {
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#0a0a0a',
    },
    textInput: {
        width: '100%',
        height: '30vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 10,
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
    Inscription: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    loginText: {
        textAlign: 'center',
        fontFamily: 'Sen',
        marginTop: 20,
        fontSize: 16,
        color: '#fff',
    },
    loginLink: {
        whiteSpace: 'nowrap',
        fontFamily: 'Sen',
        color: '#C59417',
        fontWeight: 'bold',
    },
});

export default Register;