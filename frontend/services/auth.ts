import 'react-native-get-random-values';
import {
    CognitoUser,
    CognitoUserAttribute,
    AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import { userPool } from '../lib/cognito';

export interface AuthResult {
    success: boolean;
    token?: string;
    error?: string;
}

export interface CurrentUser {
    userId: string;
    userName: string;
    token: string;
}

export interface ResetPasswordParams {
    email: string;
    code: string;
    newPassword: string;
}

export const authService = {
    async login(email: string, password: string): Promise<AuthResult> {
        return new Promise((resolve) => {
            const authDetails = new AuthenticationDetails({
                Username: email.trim(),
                Password: password,
            });

            const cognitoUser = new CognitoUser({
                Username: email.trim(),
                Pool: userPool,
            });

            cognitoUser.authenticateUser(authDetails, {
                onSuccess: (result) => {
                    const token = result.getIdToken().getJwtToken();
                    resolve({ success: true, token });
                },
                onFailure: (err: any) => {
                    resolve({ success: false, error: err.message || 'Login failed' });
                },
                newPasswordRequired: () => {
                    resolve({ success: false, error: 'Password reset required' });
                },
            });
        });
    },

    async signup(email: string, password: string): Promise<AuthResult> {
        return new Promise((resolve) => {
            const attributeList = [
                new CognitoUserAttribute({ Name: 'email', Value: email.trim() }),
            ];

            userPool.signUp(email.trim(), password, attributeList, [], (err, result) => {
                if (err) {
                    resolve({ success: false, error: err.message });
                } else {
                    resolve({ success: true });
                }
            });
        });
    },

    async confirmRegistration(email: string, code: string): Promise<AuthResult> {
        return new Promise((resolve) => {
            const cognitoUser = new CognitoUser({
                Username: email,
                Pool: userPool,
            });

            cognitoUser.confirmRegistration(code, true, (err) => {
                if (err) {
                    resolve({ success: false, error: err.message });
                } else {
                    resolve({ success: true });
                }
            });
        });
    },

    async forgotPassword(email: string): Promise<AuthResult> {
        return new Promise((resolve) => {
            const cognitoUser = new CognitoUser({
                Username: email.trim(),
                Pool: userPool,
            });

            cognitoUser.forgotPassword({
                onSuccess: () => {
                    resolve({ success: true });
                },
                onFailure: (err) => {
                    resolve({ success: false, error: err.message });
                },
            });
        });
    },

    async confirmPassword(params: ResetPasswordParams): Promise<AuthResult> {
        return new Promise((resolve) => {
            const cognitoUser = new CognitoUser({
                Username: params.email,
                Pool: userPool,
            });

            cognitoUser.confirmPassword(params.code, params.newPassword, {
                onSuccess: () => {
                    resolve({ success: true });
                },
                onFailure: (err: any) => {
                    resolve({ success: false, error: err.message });
                },
            });
        });
    },

    async checkSession(): Promise<AuthResult> {
        return new Promise((resolve) => {
            const currentUser = userPool.getCurrentUser();

            if (!currentUser) {
                resolve({ success: false });
                return;
            }

            currentUser.getSession((err: Error | null, session: any) => {
                if (!err && session?.isValid()) {
                    resolve({ success: true });
                } else {
                    resolve({ success: false, error: err?.message });
                }
            });
        });
    },

    async getCurrentUser(): Promise<CurrentUser> {
        return new Promise((resolve, reject) => {
            const currentUser = userPool.getCurrentUser();

            if (!currentUser) {
                reject(new Error('You must be signed in to manage catches'));
                return;
            }

            currentUser.getSession((err: Error | null, session: any) => {
                if (err || !session?.isValid()) {
                    reject(new Error(err?.message || 'Your session has expired. Please sign in again.'));
                    return;
                }

                const idToken = session.getIdToken();
                const payload = idToken.decodePayload();
                const userId = payload.sub ?? payload['cognito:username'] ?? currentUser.getUsername();
                const userName =
                    payload.name ??
                    payload.preferred_username ??
                    payload.email ??
                    payload['cognito:username'] ??
                    currentUser.getUsername();

                resolve({
                    userId,
                    userName,
                    token: idToken.getJwtToken(),
                });
            });
        });
    },

    logout(): void {
        const currentUser = userPool.getCurrentUser();
        if (currentUser) {
            currentUser.signOut();
        }
    },
};
