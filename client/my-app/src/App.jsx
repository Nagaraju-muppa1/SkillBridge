import {Routes,Route} from 'react-router'
import Login from './components/Login/Login'
import Lprofile from './components/Learner/Lprofile'
import Pprofile from './components/Profesional/Pprofile'
import Signin from './components/Login/Signn.jsx';
import LearnerDb from './components/Learner/LearnerDb'
import ProfesionalDb from './components/Profesional/ProfesionalDb'
import LandingPage from './components/LandingPage/LandingPage';


function App() {

  return (
    // <>
    //  <Routes>
    //      <Route path='/' element={<h1>Your are in Home</h1>}></Route>
    //      <Route path='/login' element={<Login/>}></Route>
    //      <Route path='/signin' element={<Signin/>}></Route>
    //      <Route path='/Lprofile' element={<Lprofile/>}></Route>
    //      <Route path='/learner-dashboard' element={<LearnerDb/>}/>
    //      <Route path='/Pprofile' element={<Pprofile/>}></Route>
    //      <Route path='/Profesional-dashboard' element={<ProfesionalDb/>}/>
    //  </Routes>
    // </>
        <div className="App">
      {/* Render our entire landing page content here */}
      <LandingPage />
      {/* You can add other global components here if needed by your existing app,
          e.g., a global notification system, a main router, etc. */}
    </div>
  )
}

export default App;
