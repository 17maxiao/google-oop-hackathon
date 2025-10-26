import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import TreatmentPlanPage from './pages/TreatmentPlanPage';
import UserPlanPage from './pages/UserPlanPage';
import './styles/App.scss';

function NavigationBar() {
  const navigate = useNavigate();
  const [isResetting, setIsResetting] = useState(false);

  const handleResetDemo = async () => {
    if (!window.confirm('This will reset all demo data. Continue?')) {
      return;
    }

    setIsResetting(true);

    try {
      const response = await fetch('http://localhost:5001/api/demo/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        // Navigate to therapist view to show the new pending treatment plan
        navigate('/therapist');

        // Force reload the current page to fetch fresh data
        window.location.reload();
      } else {
        alert('Failed to reset demo. Please try again.');
      }
    } catch (error) {
      console.error('Error resetting demo:', error);
      alert('Error resetting demo. Please check if backend is running.');
    } finally {
      setIsResetting(false);
    }
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
  return (
    <Router>
      <div className="app-container">
        <NavigationBar />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Navigate to="/user" replace />} />
          <Route path="/user" element={<UserPlanPage />} />
          <Route path="/therapist" element={<TreatmentPlanPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
