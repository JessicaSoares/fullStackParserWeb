import './App.css';
import MainDash from './components/MainDash/MainDash';
import Sidebar from './components/Sidebar';
import HistoryInvoice from './components/HistoryInvoice/HistoryInvoice';
import { BrowserRouter as Router, Route, Link, Routes, Outlet } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="AppGlass">
          <Sidebar />
          <Routes>
            <Route path="/dashboard" element={<MainDash />} />
            <Route path="/history-invoice" element={<HistoryInvoice />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
