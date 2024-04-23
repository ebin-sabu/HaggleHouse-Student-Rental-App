import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react';


// Pages & components
import Home from './pages/Home';
import Login from './pages/login';
import Navbar from './components/Navbar';
import FooterCustom from './components/footer';
import SignUp from './pages/signUp';
import Favs from './pages/favs';
import Settings from './pages/settings';
import CreatePropertyForm from './pages/create';
import Bids from './pages/bids';
import Groups from './pages/groups';
import MyProperties from './pages/myProperties';
import EditPropertyForm from './components/EditPropertyForm';
import ViewBids from './components/viewBids';

const NavigateToHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirects to homepage on component mount
    navigate('/');
  }, [navigate]);

  return null; // This component does not render anything
};


function App() {

  return (
    <div className="App d-flex flex-column min-vh-100">
      <BrowserRouter>
        <Navbar />
        <div className="flex-grow-1">
          <Routes>
            <Route
              path="/"
              element={<Home />}
            />
            <Route path="*" element={<NavigateToHome />} />
            <Route
              path="/login"
              element={<Login />}
            />
            <Route
              path="/sign-up"
              element={<SignUp />}
            />
            <Route
              path="/saved"
              element={<Favs />}
            />
            <Route
              path="/settings"
              element={<Settings />} />

            <Route
              path="/create-property"
              element={<CreatePropertyForm />} />

            <Route
              path="/myBids"
              element={<Bids />} />

            <Route
              path="/groups"
              element={<Groups />} />

            <Route
              path="/my-properties"
              element={<MyProperties />} // This forces React to remount the component
            />

            <Route path="/edit-property/:propertyId" element={<EditPropertyForm />} />

            <Route path="/viewbids/:propertyId" element={<ViewBids />} />

          </Routes>

        </div>
        <FooterCustom />
      </BrowserRouter>
    </div>
  );
}

export default App;

