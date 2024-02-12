import { BrowserRouter, Routes, Route } from 'react-router-dom'


// pages & components
import Home from './pages/Home';
import Login from './pages/login';
import Navbar from './components/Navbar';
import SignUp from './pages/signUp';
import Favs from './pages/favs';
import Settings from './pages/settings';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route
              path="/"
              element={<Home />}
            />
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
          </Routes>

        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

