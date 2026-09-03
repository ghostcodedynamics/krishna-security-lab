import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* Future routes: /login, /register, /dashboard, /world, etc. */}
    </Routes>
  );
}

export default App;
