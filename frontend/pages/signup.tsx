import { SignupView } from '@components/views';
import { useSignup } from '@hooks/useSignup';

export default function SignupScreen() {
    const {
        email,
        setEmail,
        password,
        setPassword,
        error,
        loading,
        handleSignup,
    } = useSignup();

    return (
        <SignupView
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            error={error}
            loading={loading}
            onSignup={handleSignup}
        />
    );
}
