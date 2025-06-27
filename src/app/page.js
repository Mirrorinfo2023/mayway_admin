'use client';

import Dashboard from '../pages/Dashboard';
import HomeScreen from '@/pages/HomeScreen';
import MirrorGame from '../pages/mirrorgame';
import MirrorBusiness from '../pages/mirror_business';
import MirrorNursing from '../pages/mirror_nursing';
import MirrorShopping from '../pages/mirror_shopping';
import MirrorVendors from '../pages/mirror_vendor';

export default function HomePage() {
  return (
    <main>
      <HomeScreen />
      {/* <Dashboard />
      <MirrorGame />
      <MirrorBusiness />
      <MirrorNursing />
      <MirrorShopping />
      <MirrorVendors /> */}
    </main>
  );
}
