import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './constant/ScrollToTop'; 
import HomeScreen from './HomeScreen'; 

import Dashboard from './pages/Dashboard';
import MirrorGame from './pages/mirrorgame';
import MirrorBusiness from './pages/mirror_business';
import MirrorNursing from './pages/mirror_nursing';
import MirrorShopping from './pages/mirror_shopping';
import MirrorVendors from './pages/mirror_vendor';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path='/Home-Screen' element={<HomeScreen/>}/>
<Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/mirror-game" element={<MirrorGame />} />
        <Route path="/mirror-business" element={<MirrorBusiness />} />
        <Route path="/mirror-nursing" element={<MirrorNursing />} />
        <Route path="/mirror-shopping" element={<MirrorShopping />} />
        <Route path="/mirror-vendors" element={<MirrorVendors />} />
      </Routes>
    </Router>
  );
}

export default App;
