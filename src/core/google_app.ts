import firebase, { ServiceAccount } from 'firebase-admin';
import { configEnv } from '../config_env';
import * as dotenv from 'dotenv';

dotenv.config();

export const googleApp = firebase.initializeApp({credential:firebase.credential.cert(JSON.parse(configEnv().FIREBASE_CERT) as ServiceAccount)});