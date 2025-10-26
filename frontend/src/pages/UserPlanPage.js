import { useState, useEffect } from 'react';
import SuggestionBox from '../components/SuggestionBox';
import theme from '../theme';

const UserPlanPage = () => {
  const [userPlan, setUserPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weekSummary, setWeekSummary] = useState(null);

  useEffect(() => {
    // Fetch the current user's active treatment plan
    fetch('http://localhost:5001/api/user-plan/current')
      .then(response => response.json())
      .then(data => {
        setUserPlan(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user plan:', error);
        setLoading(false);
      });

    // Check if there's a week summary available
    fetch('http://localhost:5001/api/user-plan/summary')
      .then(response => response.json())
      .then(data => {
        if (data.summary) {
          setWeekSummary(data);
        }
      })
      .catch(error => {
        console.error('Error fetching week summary:', error);
      });
  }, []);

  const handleSuggestionStatusChange = async (suggestionId, status, notes) => {
    // Update local state
    setUserPlan(prev => ({
      ...prev,
      suggestions: prev.suggestions.map(s =>
        s.id === suggestionId
          ? { ...s, status, notes: notes !== undefined ? notes : s.notes }
          : s
      )
    }));

    // Send update to backend
    try {
      await fetch('http://localhost:5001/api/user-plan/update-activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: userPlan.id,
          suggestionId,
          status,
          notes,
        }),
      });
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  };

  const calculateCompletionRate = () => {
    if (!userPlan || !userPlan.suggestions.length) return 0;
    const completed = userPlan.suggestions.filter(s => s.status === 'completed').length;
    return Math.round((completed / userPlan.suggestions.length) * 100);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: theme.colors.background,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{
          fontSize: theme.typography.fontSize.lg,
          color: theme.colors.textSecondary,
        }}>
          Loading your wellness plan...
        </div>
      </div>
    );
  }

  if (!userPlan) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: theme.colors.background,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{
          textAlign: 'center',
          padding: theme.spacing.xl,
        }}>
          <h2 style={{
            fontSize: theme.typography.fontSize['2xl'],
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.md,
          }}>
            No Active Plan
          </h2>
          <p style={{
            fontSize: theme.typography.fontSize.base,
            color: theme.colors.textSecondary,
          }}>
            Your therapist will create a personalized plan after your next session.
          </p>
        </div>
      </div>
    );
  }

  const completionRate = calculateCompletionRate();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme.colors.background,
      padding: theme.spacing.xl,
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.large,
          padding: theme.spacing.xl,
          marginBottom: theme.spacing.xl,
          boxShadow: theme.shadows.medium,
        }}>
          <h1 style={{
            margin: 0,
            fontSize: theme.typography.fontSize['3xl'],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.primary,
            marginBottom: theme.spacing.sm,
          }}>
            Your Wellness Journey
          </h1>
          <p style={{
            margin: 0,
            fontSize: theme.typography.fontSize.lg,
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.lg,
          }}>
            Keep up with your personalized coping strategies
          </p>

          {/* Progress Bar */}
          <div style={{
            backgroundColor: theme.colors.surfaceLight,
            borderRadius: theme.borderRadius.large,
            padding: theme.spacing.lg,
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: theme.spacing.sm,
            }}>
              <span style={{
                fontSize: theme.typography.fontSize.base,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.textPrimary,
              }}>
                This Week's Progress
              </span>
              <span style={{
                fontSize: theme.typography.fontSize.xl,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.primary,
              }}>
                {completionRate}%
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '12px',
              backgroundColor: theme.colors.border,
              borderRadius: theme.borderRadius.large,
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${completionRate}%`,
                height: '100%',
                backgroundColor: theme.colors.secondary,
                transition: theme.transitions.medium,
              }} />
            </div>
          </div>
        </div>

        {/* Week Summary (if available) */}
        {weekSummary && (
          <div style={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.large,
            padding: theme.spacing.xl,
            marginBottom: theme.spacing.xl,
            boxShadow: theme.shadows.medium,
            border: `2px solid ${theme.colors.accent}`,
          }}>
            <h2 style={{
              margin: 0,
              fontSize: theme.typography.fontSize.xl,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.textPrimary,
              marginBottom: theme.spacing.md,
            }}>
              Your Week in Review
            </h2>
            <p style={{
              margin: 0,
              fontSize: theme.typography.fontSize.base,
              color: theme.colors.textSecondary,
              lineHeight: theme.typography.lineHeight.relaxed,
              marginBottom: theme.spacing.md,
            }}>
              {weekSummary.summary}
            </p>
            <div style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.textLight,
            }}>
              This summary has been shared with your therapist to help make your next session more effective.
            </div>
          </div>
        )}

        {/* Daily Activities */}
        <div style={{
          marginBottom: theme.spacing.xl,
        }}>
          <h2 style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.lg,
          }}>
            Your Coping Strategies
          </h2>

          {userPlan.suggestions.map((suggestion) => (
            <SuggestionBox
              key={suggestion.id}
              suggestion={suggestion}
              onStatusChange={handleSuggestionStatusChange}
              isEditable={true}
              showCheckbox={true}
              viewMode="user"
            />
          ))}
        </div>

        {/* Encouragement Card */}
        <div style={{
          backgroundColor: theme.colors.primaryLight,
          color: theme.colors.surface,
          borderRadius: theme.borderRadius.large,
          padding: theme.spacing.xl,
          textAlign: 'center',
          boxShadow: theme.shadows.medium,
        }}>
          <h3 style={{
            margin: 0,
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.semibold,
            marginBottom: theme.spacing.sm,
          }}>
            You're doing great!
          </h3>
          <p style={{
            margin: 0,
            fontSize: theme.typography.fontSize.base,
          }}>
            Every step forward counts. Remember, your therapist is here to support you.
          </p>
        </div>

        {/* Next Session Info */}
        {userPlan.nextSession && (
          <div style={{
            marginTop: theme.spacing.xl,
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.large,
            padding: theme.spacing.lg,
            boxShadow: theme.shadows.small,
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing.xs,
            }}>
              Next Session
            </div>
            <div style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.primary,
            }}>
              {new Date(userPlan.nextSession).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPlanPage;
