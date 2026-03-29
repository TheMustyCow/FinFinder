import 'react-native-get-random-values';
import{useState} from 'react';
import{View, Text, TextInput, TouchableOpacity, ActivityIndicator} from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
import {CognitoUser, CognitoUserPool} from 'amazon-cognito-identity-js';
import{COGNITO_CONFIG} from '../constants/cognito';

const userPool = new CognitoUserPool(COGNITO_CONFIG);
export default function ConfirmScreen(){
    const router = useRouter();
    const {email} = useLocalSearchParams<{email: string}>();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const[loading, setLoading] = useState(false);

    const handleConfirm = () =>{
        setError('');
        setLoading(true);

        const cognitoUser = new CognitoUser({
            Username: email,
            Pool: userPool
        });
        cognitoUser.confirmRegistration(code, true, (err, result)=>{
            setLoading(false);
            if(err){
                setError(err.message);
                return;
            }
            router.replace('/login');
        });
    };

    return(
        <View>
            <Text style={{fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 32}}>
                Check your email
            </Text>
            <Text style={{textAlign: 'center', color: '#666', marginBottom: 32}}>
            We sent a verification code to {email}
            </Text>

            <TextInput
                style={{borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16}}
                placeholder="Verification code"
                keyboardType="number-pad"
                onChangeText={setCode}
                value={code}
                />

            {error ? <Text style={{color: 'red', marginBottom: 12}}>{error}</Text> : null}

            <TouchableOpacity
                style={{backgroundColor: '#2e7d32', borderRadius: 8, padding: 14, alignItems: 'center'}}
                onPress={handleConfirm}
                disabled={loading}
            >
                {loading ? <ActivityIndicator color="#fff" />
                : <Text style={{color: '#fff', fontSize: 16}}>Verify</Text>
                }
                </TouchableOpacity>
        </View>
    );
}