import { LoginView } from '@components/views';
import { useLogin } from '@hooks/useLogin';

export default function LoginScreen() {
    const {
        email,
        setEmail,
        password,
        setPassword,
        error,
        loading,
        handleLogin,
        handleForgotPassword,
    } = useLogin();

    return (
        <LoginView
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            error={error}
            loading={loading}
            onLogin={handleLogin}
            onForgotPassword={handleForgotPassword}
        />
    );
}
