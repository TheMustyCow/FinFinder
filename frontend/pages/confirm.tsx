import { ConfirmView } from '@components/views';
import { useConfirm } from '@hooks/useConfirm';

export default function ConfirmScreen() {
    const {
        code,
        setCode,
        error,
        loading,
        handleConfirm,
    } = useConfirm();

    return (
        <ConfirmView
            code={code}
            setCode={setCode}
            error={error}
            loading={loading}
            onConfirm={handleConfirm}
        />
    );
}
