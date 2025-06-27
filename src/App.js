import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './constant/ScrollToTop'; 
import HomeScreen from './pages/HomeScreen'; 

import Dashboard from './pages/Dashboard';
import MirrorGame from './pages/mirrorgame';
import MirrorBusiness from './pages/mirror_business';
import MirrorNursing from './pages/mirror_nursing';
import MirrorShopping from './pages/mirror_shopping';
import MirrorVendors from './pages/mirror_vendor';
import CartScreen from './pages/cart';
import Shopping from './pages/Shopping';
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
          <Route path="/Cart" element={<CartScreen />} />
          <Route path="/Shopping" element={<Shopping />} />

      </Routes>
    </Router>
  );
}

export default App;
