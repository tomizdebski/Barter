import { BarterPage } from './BarterPage';
import { useParams } from 'next/navigation';

export default function BarterRoutePage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id ?? '';

  return <BarterPage barterId={id} />;
}







