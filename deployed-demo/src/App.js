import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import TreatmentPlanPage from './pages/TreatmentPlanPage';
import UserPlanPage from './pages/UserPlanPage';
import { demoDataManager } from './data/demoData';
import './styles/App.css';

function NavigationBar({ onDataChange }) {
  const navigate = useNavigate();
  const [isResetting, setIsResetting] = useState(false);

  const handleResetDemo = () => {
    if (!window.confirm('This will reset all demo data. Continue?')) {
      return;
    }

    setIsResetting(true);

    // Reset the data manager
    setTimeout(() => {
      demoDataManager.reset();

      // Navigate to therapist view to show the new pending treatment plan
      navigate('/therapist');

      // Notify parent of data change
      if (onDataChange) {
        onDataChange();
      }

      // Force reload to reset all component state
      window.location.reload();
    }, 500);
  };

  return (
    <nav className="app-nav">
      <div className="nav-content">
        <div className="nav-logo">
          CopeAI
        </div>

        <div className="nav-links">
          <Link to="/user" className="nav-link">
            Patient View
          </Link>

          <Link to="/therapist" className="nav-link">
            Therapist Review
          </Link>

          <button
            onClick={handleResetDemo}
            disabled={isResetting}
            className="nav-reset-button"
          >
            <span>{isResetting ? '⏳' : '🔄'}</span>
            <span>{isResetting ? 'Resetting...' : 'Reset Demo'}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

function App() {
  const [dataVersion, setDataVersion] = useState(0);

  const handleDataChange = () => {
    setDataVersion(v => v + 1);
  };

  return (
    <Router>
      <div className="app-container">
        <NavigationBar onDataChange={handleDataChange} />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Navigate to="/user" replace />} />
          <Route
            path="/user"
            element={<UserPlanPage key={`user-${dataVersion}`} onDataChange={handleDataChange} />}
          />
          <Route
            path="/therapist"
            element={<TreatmentPlanPage key={`therapist-${dataVersion}`} onDataChange={handleDataChange} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
