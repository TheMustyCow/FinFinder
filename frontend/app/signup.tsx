import 'react-native-get-random-values';
import {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, ActivityIndicator} from 'react-native';
import {useRouter} from 'expo-router';
import {CognitoUserPool, CognitoUserAttribute} from 'amazon-cognito-identity-js';
import {COGNITO_CONFIG} from '../constants/cognito';

const userPool = new CognitoUserPool(COGNITO_CONFIG);


export default function SignupScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const attributeList = [new CognitoUserAttribute({Name: 'email', Value: email.trim()})];

    const handleSignup = () =>{
        setError('');//clears previous error message from screen
        setLoading(true);

        userPool.signUp(email.trim(), password, attributeList, [], (err, result) =>{
            setLoading(false);
            if(err){
                setError(err.message);
                return;
            }
            router.push({pathname: '/confirm', params: {email: email.trim()}});
        });

    };

    return (
        <View style={{flex: 1, justifyContent: 'center', padding:24, marginBottom: 24}}>
            <Text style={{ fontSize: 28, fontWeight: '700', textAlign: 'center'}}>
                Create Account
            </Text>
            <TextInput
                style={{borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16}}
                placeholder = "Email"
                onChangeText={setEmail}//updates the email state variable on each key stroke of the user (no pressing enter required)
                value={email}//displays what is stored in the email state variable
            />
            <TextInput
                style={{borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16}}
                placeholder = "Password"
                onChangeText={setPassword}
                value={password}
                secureTextEntry={true}
            />


            {error ? <Text style={{color: 'red', marginBottom: 12}}>{error}</Text>: null}

            <TouchableOpacity
                style={{backgroundColor: '#2e7d32', borderRadius: 8, padding: 14, alignItems: 'center'}}
                onPress={handleSignup}
                disabled={loading}
            >
                {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={{color: '#fff', fontSize: 16}}>Sign Up </Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/login')} style={{marginTop:16}}>
                <Text style={{textAlign: 'center', color: '#2e7d32'}}>Already have an account?</Text>
            </TouchableOpacity>
        </View>
    );
}