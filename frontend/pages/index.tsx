import { LoadingView } from '@components/views';
import { useSessionCheck } from '@hooks/useSession';

export default function Index() {
    useSessionCheck();
    return <LoadingView />;
}
