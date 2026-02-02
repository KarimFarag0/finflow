import {useState, useEffect } from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function App(){
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //Check if the user is already logged in (token in localStorage)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleSignupSuccess = (userData) => {
    setUser(userData);
  };

  

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  if (loading){
    return <div className='flex items-center justify-center min-h-screen'>Loading...</div>;
  }

  //Return the HTML that shows on screen
  return (
    <Router>
      <Routes>
        {/* If user not logged in, show login/signup pages */}
        {!user ? (
          <>
            <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/signup" element={<SignupPage onSignupSuccess={handleSignupSuccess} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            {/* If user IS logged in, show dashboard (we'll build this next) */}
            <Route path="/dashboard" element={<div>Dashboard Coming Soon!</div>} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;




