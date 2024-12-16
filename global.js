const config = require('./config')
const path = require('path')


const admin = require('firebase-admin');
admin.initializeApp({  credential: admin.credential.cert(config.serviceAccount) });

process.on('uncaughtException', (err) => { console.error('Errory:', err);});
process.on('unhandledRejection', (reason, promise) => { console.error('Error:', promise, 'reason:', reason) });

/** function */

/** global */
global.__path = process.cwd()
global.config = require('./config')
global.admin = admin
global.db = admin.firestore()