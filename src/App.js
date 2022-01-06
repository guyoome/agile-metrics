import './App.css';
import Burnup from './Burnup/Burnup';
import HealthCheck from './HealthCheck/HealthCheck';

function App() {
  return (
    <div className="App">
      <Burnup />
      <hr/>
      <HealthCheck />
    </div>
  );
}

export default App;
