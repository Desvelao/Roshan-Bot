const firebase = require('firebase-admin')

const env = require('../env.json');
const firebaseConfig = {
    "type": "service_account",
    "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://accounts.google.com/o/oauth2/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
}

config = {
    credential: firebase.credential.cert(firebaseConfig),
    databaseURL: "https://roshan-bot.firebaseio.com",
    storageBucket: "roshan-bot.appspot.com"
}
firebase.initializeApp(config)

module.exports = firebase
module.exports.config = config