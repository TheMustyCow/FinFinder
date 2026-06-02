import 'react-native-get-random-values';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { COGNITO_CONFIG } from '../constants/cognito';

export const userPool = new CognitoUserPool(COGNITO_CONFIG);