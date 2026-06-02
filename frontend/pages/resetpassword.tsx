import { ResetPasswordView } from '@components/views';
import { useResetPassword } from '@hooks/useResetPassword';

export default function ResetPasswordScreen() {
    const {
        code,
        setCode,
        newPassword,
        setNewPassword,
        error,
        loading,
        handleReset,
    } = useResetPassword();

    return (
        <ResetPasswordView
            code={code}
            setCode={setCode}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            error={error}
            loading={loading}
            onReset={handleReset}
        />
    );
}
