import { useState, useEffect } from 'react';
import SuggestionBox from '../components/SuggestionBox';
import '../styles/TreatmentPlanPage.css';
import { demoDataManager } from '../data/demoData';

const TreatmentPlanPage = ({ onDataChange }) => {
  const [treatmentPlan, setTreatmentPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approvalStatus, setApprovalStatus] = useState('pending');

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const plan = demoDataManager.getPendingTreatmentPlan();
      setTreatmentPlan(plan);
      setLoading(false);
    }, 300);
  }, []);

  const handleSuggestionStatusChange = (suggestionId, status, notes) => {
    setTreatmentPlan(prev => ({
      ...prev,
      suggestions: prev.suggestions.map(s =>
        s.id === suggestionId
          ? { ...s, status, notes: notes !== undefined ? notes : s.notes }
          : s
      )
    }));
  };

  const handleApproveAll = () => {
    const result = demoDataManager.approveTreatmentPlan(treatmentPlan.id, treatmentPlan.suggestions);

    if (result.success) {
      setApprovalStatus('approved');
      alert('Treatment plan approved! Patient will receive notifications.');

      // Notify parent of data change
      if (onDataChange) {
        onDataChange();
      }
    } else {
      alert('Failed to approve treatment plan. Please try again.');
    }
  };

  const handleRequestRevision = () => {
    const result = demoDataManager.requestRevision(treatmentPlan.id);

    if (result.success) {
      alert('Revision request sent. Plan will be regenerated.');
    }
  };

  if (loading) {
    return (
      <div className="treatment-plan-page__loading">
        <div className="treatment-plan-page__loading-text">
          Loading treatment plan...
        </div>
      </div>
    );
  }

  if (!treatmentPlan) {
    return (
      <div className="treatment-plan-page__empty">
        <div className="treatment-plan-page__empty-content">
          <h2 className="treatment-plan-page__empty-title">
            No Pending Treatment Plans
          </h2>
          <p className="treatment-plan-page__empty-description">
            All treatment plans have been reviewed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="treatment-plan-page">
      <div className="treatment-plan-page__container">
        {/* Header */}
        <div className="treatment-plan-page__header">
          <div className="treatment-plan-page__header-top">
            <div>
              <h1 className="treatment-plan-page__title">
                Treatment Plan Review
              </h1>
              <p className="treatment-plan-page__patient-name">
                Patient: {treatmentPlan.patientName}
              </p>
            </div>
            <span className="treatment-plan-page__session-date">
              Session: {new Date(treatmentPlan.sessionDate).toLocaleDateString()}
            </span>
          </div>

          <div className="treatment-plan-page__session-summary">
            <h3 className="treatment-plan-page__summary-title">
              Session Summary
            </h3>
            <p className="treatment-plan-page__summary-text">
              {treatmentPlan.sessionSummary}
            </p>
          </div>
        </div>

        {/* Suggestions Section */}
        <div className="treatment-plan-page__suggestions">
          <h2 className="treatment-plan-page__suggestions-title">
            Recommended Coping Strategies
          </h2>

          {treatmentPlan.suggestions.map((suggestion) => (
            <SuggestionBox
              key={suggestion.id}
              suggestion={suggestion}
              onStatusChange={handleSuggestionStatusChange}
              isEditable={true}
              showCheckbox={false}
              viewMode="therapist"
            />
          ))}
        </div>

        {/* Action Buttons */}
        {approvalStatus === 'pending' && (
          <div className="treatment-plan-page__actions">
            <button
              onClick={handleRequestRevision}
              className="treatment-plan-page__button treatment-plan-page__button--revise"
            >
              Request Revision
            </button>
            <button
              onClick={handleApproveAll}
              className="treatment-plan-page__button treatment-plan-page__button--approve"
            >
              Approve & Send to Patient
            </button>
          </div>
        )}

        {approvalStatus === 'approved' && (
          <div className="treatment-plan-page__approved">
            <h3 className="treatment-plan-page__approved-title">
              Treatment Plan Approved!
            </h3>
            <p className="treatment-plan-page__approved-text">
              The patient will begin receiving their personalized reminders.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TreatmentPlanPage;
