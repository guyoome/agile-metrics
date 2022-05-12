import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Burnup from './Pages/Burnup/Burnup';
import HealthCheck from './Pages/HealthCheck/HealthCheck';
import GlobalHealthCheck from './Pages/HealthCheck/GlobalHealthCheck';
import Commitment from './Pages/Velocity/Commitment';
import Kanban from './Pages/Kanban/Kanban';


ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Burnup />} />
          <Route path="burnup" element={<Burnup />} />
          <Route path="health-check" element={<HealthCheck />} />
          <Route path="health-check-multi" element={<GlobalHealthCheck />}/>
          <Route path="velocity" element={<Commitment />}/>
          <Route path="kanban" element={<Kanban />}/>
        </Route>
      </Routes>
    </BrowserRouter>

  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
