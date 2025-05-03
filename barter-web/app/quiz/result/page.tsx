import { Suspense } from 'react';
import ResultClient from './ResultClient';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-white">Loading result...</div>}>
      <ResultClient />
    </Suspense>
  );
}
