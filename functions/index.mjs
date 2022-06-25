import * as functions from "firebase-functions";
import admin from "firebase-admin";
import cors from "cors";

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

admin.initializeApp();
const corsHandler = cors({ origin: true });

export const getWord = functions.https.onRequest((request, response) => {
    corsHandler(request, response, () => {
        const root = admin.database().ref("/");

        root.get()
            .then((snapshot) => {
                if (snapshot.exists()) {
                    return snapshot.val();
                } else {
                    console.log("No data available");
                }
            })
            .then((words) => {
                const word = getValidWord(words);
                response.send(word);
            })
            .catch((error) => {
                console.error(error);
            });
    });
});

// eslint-disable-next-line require-jsdoc
function getValidWord(words) {
    const filteredWords = words
        .filter((word) => word.length === 5 && word.match(/^[а-я]/));
    const randomIndex = Math.floor(Math.random() * filteredWords.length) - 1;

    return filteredWords.at(randomIndex).toUpperCase();
}
