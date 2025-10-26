import { useState } from 'react';
import '../styles/SuggestionBox.scss';

const SuggestionBox = ({
  suggestion,
  onComplete,
  onStatusChange,
  isEditable = false,
  showCheckbox = true,
  viewMode = 'user' // 'user' or 'therapist'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [notes, setNotes] = useState(suggestion.notes || '');

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'journaling':
        return '📝';
      case 'exercise':
        return '🚶';
      case 'breathing':
        return '🧘';
      case 'custom':
        return '💡';
      default:
        return '✨';
    }
  };

  const getStatusClass = (status) => {
    const statusMap = {
      'completed': 'suggestion-box__status--completed',
      'in_progress': 'suggestion-box__status--in_progress',
      'pending': 'suggestion-box__status--pending',
      'skipped': 'suggestion-box__status--skipped',
    };
    return `suggestion-box__status ${statusMap[status] || statusMap['pending']}`;
  };

  const handleCheckboxChange = () => {
    const newStatus = suggestion.status === 'completed' ? 'pending' : 'completed';
    if (onStatusChange) {
      onStatusChange(suggestion.id, newStatus);
    }
  };

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
    if (onStatusChange) {
      onStatusChange(suggestion.id, suggestion.status, e.target.value);
    }
  };

  return (
    <div className="suggestion-box">
      <div className="suggestion-box__content">
        {showCheckbox && viewMode === 'user' && (
          <input
            type="checkbox"
            checked={suggestion.status === 'completed'}
            onChange={handleCheckboxChange}
            className="suggestion-box__checkbox"
          />
        )}

        <div className="suggestion-box__icon">
          {getSuggestionIcon(suggestion.type)}
        </div>

        <div className="suggestion-box__body">
          <div className="suggestion-box__header">
            <div>
              <h3 className="suggestion-box__title">
                {suggestion.title}
              </h3>
              <span className={getStatusClass(suggestion.status)}>
                {suggestion.status?.replace('_', ' ') || 'Pending'}
              </span>
            </div>

            {suggestion.frequency && (
              <span className="suggestion-box__frequency">
                {suggestion.frequency}
              </span>
            )}
          </div>

          <p className="suggestion-box__description">
            {suggestion.description}
          </p>

          {suggestion.prompt && (
            <div className="suggestion-box__prompt">
              <p>"{suggestion.prompt}"</p>
            </div>
          )}

          {(isEditable || (viewMode === 'user' && suggestion.status === 'completed')) && (
            <div className="suggestion-box__notes-section">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="suggestion-box__notes-toggle"
              >
                {isExpanded ? '▼' : '▶'} {viewMode === 'user' ? 'Add Notes' : 'View Notes'}
              </button>

              {isExpanded && (
                <textarea
                  value={notes}
                  onChange={handleNotesChange}
                  placeholder={viewMode === 'user' ? 'How did this activity make you feel? Any insights?' : 'Patient notes...'}
                  readOnly={!isEditable && viewMode === 'therapist'}
                  className={`suggestion-box__notes-textarea ${(!isEditable && viewMode === 'therapist') ? 'suggestion-box__notes-textarea--readonly' : ''}`}
                />
              )}
            </div>
          )}

          {viewMode === 'therapist' && isEditable && (
            <div className="suggestion-box__actions">
              <button
                onClick={() => onStatusChange && onStatusChange(suggestion.id, 'approved')}
                className="suggestion-box__button suggestion-box__button--approve"
              >
                Approve
              </button>
              <button
                onClick={() => onStatusChange && onStatusChange(suggestion.id, 'needs_revision')}
                className="suggestion-box__button suggestion-box__button--revise"
              >
                Needs Revision
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuggestionBox;
