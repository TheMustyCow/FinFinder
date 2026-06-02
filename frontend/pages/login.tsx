import { LoginView } from '@components/views';
import { useLogin } from '@hooks/useLogin';

export default function LoginScreen() {//creates the loginscreen fiber. Each of these props will be stored
                                                //in a linked list and useLogin() will also be stored in this fiber.
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
