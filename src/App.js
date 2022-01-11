import {
  BrowserRouter,
  Routes,
  Route,
  Outlet
} from "react-router-dom";
import Burnup from './Burnup/Burnup';
import HealthCheck from './HealthCheck/HealthCheck';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <div className="App">

      <Navbar />

      <div className="page">
        <Outlet />
      </div>

    </div>
  );
}

export default App;
