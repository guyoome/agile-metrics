import { Outlet } from "react-router-dom";
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
