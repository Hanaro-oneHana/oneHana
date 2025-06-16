'use client';

import ProgressBarButton from '@/components/ProgressBarButton';
import BottomNavigation from '@/components/atoms/BottomNavigation';

export default function Store() {
  return (
    <>
      <ProgressBarButton selectedItem={1} progress={false} onClick={() => {}} />
      <BottomNavigation selectedItem='store' />
      <ProgressBarButton selectedItem={2} progress={true} onClick={() => {}} />
    </>
  );
}
