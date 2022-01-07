import './App.css';
import Burnup from './Burnup/Burnup';
import HealthCheck from './HealthCheck/HealthCheck';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      
      <Navbar />

      <div className='page'>
        <Burnup />
        <hr />
        <HealthCheck />
      </div>

    </div>
  );
}

export default App;
