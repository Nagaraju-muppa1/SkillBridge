import { Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Lprofile from './components/Learner/Lprofile';
import Pprofile from './components/Profesional/Pprofile';
import Signin from './components/Login/Signn.jsx';
import LearnerDb from './components/Learner/LearnerDb';
import ProfesionalDb from './components/Profesional/ProfesionalDb';
import LandingPage from './components/LandingPage/LandingPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/Lprofile" element={<Lprofile />} />
      <Route path="/learner-dashboard" element={<LearnerDb />} />
      <Route path="/Pprofile" element={<Pprofile />} />
      <Route path="/Profesional-dashboard" element={<ProfesionalDb />} />
    </Routes>
  );
}

export default App;
