import { AppRegistry } from 'react-native';
import App from './App';

// Enregistrer le composant principal
AppRegistry.registerComponent('CineMaison', () => App);

// Démarrer l'application
AppRegistry.runApplication('CineMaison', {
    initialProps: {},
    rootTag: document.getElementById('root'),
});