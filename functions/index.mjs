import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import cors from 'cors';

admin.initializeApp();
const corsHandler = cors({ origin: true });

export const getWord = functions.https.onRequest((request, response) => {
    const root = admin.database().ref('/');

    corsHandler(request, response, () => {
        root.on('value', (snapshot) => {
            const words = snapshot.val();
            const word = getRandomWord(words);
            response.send(word);
        });
    });
});

export const checkExistence = functions.https.onRequest((request, response) => {
    const root = admin.database().ref('/');

    corsHandler(request, response, () => {
        root.on('value', (snapshot) => {
            const words = snapshot.val();
            const word = request.query.word;
            const isWordExist = words.includes(word);
            response.send(isWordExist);
        });
    });
});

function getRandomWord(words) {
    const randomIndex = Math.floor(Math.random() * words.length) - 1;

    return words.at(randomIndex);
}
