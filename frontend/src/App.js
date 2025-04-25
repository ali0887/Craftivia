import React from 'react';
import { Route,Routes} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import DarkModeToggle from './components/DarkModeToggle';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <DarkModeToggle />
      <Routes>
        <Route exact path='/' component={Home} />
        <Route path='/product/:id' component={ProductDetail} />
        <Route path='/cart' component={Cart} />
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
        <Route path='/profile' component={Profile} />
        <Route path='/admin' component={AdminDashboard} />
      </Routes>
    </AuthProvider>
  );
}
export default App;