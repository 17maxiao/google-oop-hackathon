// Mock data store for self-contained demo
// This replaces the backend API with local state management

const generateId = () => Math.random().toString(36).substr(2, 9);

// Initial demo data
export const getInitialDemoData = () => ({
  treatmentPlan: {
    id: generateId(),
    patientName: 'Sarah Johnson',
    sessionDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    sessionSummary: 'Patient discussed increased anxiety around work deadlines and difficulty sleeping. We explored several coping mechanisms including mindfulness and journaling. Patient showed interest in developing a consistent self-care routine.',
    status: 'pending',
    suggestions: [
      {
        id: generateId(),
        type: 'journaling',
        title: 'Evening Reflection Journal',
        description: 'Take 10 minutes before bed to write about your day and any emotions you experienced.',
        prompt: 'What was one challenging moment today, and how did you handle it? What would you do differently next time?',
        frequency: 'Daily',
        status: 'pending',
        notes: ''
      },
      {
        id: generateId(),
        type: 'exercise',
        title: 'Mindful Morning Walk',
        description: 'Start your day with a 15-minute walk, focusing on your surroundings and breathing.',
        prompt: 'Notice the sounds, sights, and sensations around you. How does your body feel?',
        frequency: '3x per week',
        status: 'pending',
        notes: ''
      },
      {
        id: generateId(),
        type: 'breathing',
        title: 'Work Break Breathing Exercise',
        description: 'Practice 4-7-8 breathing technique during work breaks to manage stress.',
        prompt: 'Breathe in for 4 counts, hold for 7, exhale for 8. Repeat 4 times.',
        frequency: '2-3x daily',
        status: 'pending',
        notes: ''
      },
      {
        id: generateId(),
        type: 'custom',
        title: 'Gratitude Practice',
        description: 'Write down three things you\'re grateful for each morning.',
        prompt: 'What are three things, big or small, that brought you joy or comfort today?',
        frequency: 'Daily',
        status: 'pending',
        notes: ''
      }
    ]
  },
  userPlan: {
    id: generateId(),
    patientId: 'user-123',
    startDate: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    nextSession: new Date(Date.now() + 345600000).toISOString(), // 4 days from now
    suggestions: [
      {
        id: generateId(),
        type: 'journaling',
        title: 'Evening Reflection Journal',
        description: 'Take 10 minutes before bed to write about your day and any emotions you experienced.',
        prompt: 'What was one challenging moment today, and how did you handle it? What would you do differently next time?',
        frequency: 'Daily',
        status: 'completed',
        notes: 'This really helped me process my anxiety about the presentation.'
      },
      {
        id: generateId(),
        type: 'exercise',
        title: 'Mindful Morning Walk',
        description: 'Start your day with a 15-minute walk, focusing on your surroundings and breathing.',
        prompt: 'Notice the sounds, sights, and sensations around you. How does your body feel?',
        frequency: '3x per week',
        status: 'completed',
        notes: 'Felt more energized and focused after my walk.'
      },
      {
        id: generateId(),
        type: 'breathing',
        title: 'Work Break Breathing Exercise',
        description: 'Practice 4-7-8 breathing technique during work breaks to manage stress.',
        prompt: 'Breathe in for 4 counts, hold for 7, exhale for 8. Repeat 4 times.',
        frequency: '2-3x daily',
        status: 'in_progress',
        notes: ''
      },
      {
        id: generateId(),
        type: 'custom',
        title: 'Gratitude Practice',
        description: 'Write down three things you\'re grateful for each morning.',
        prompt: 'What are three things, big or small, that brought you joy or comfort today?',
        frequency: 'Daily',
        status: 'pending',
        notes: ''
      }
    ]
  },
  weekSummary: {
    weekNumber: 1,
    completionRate: 50,
    summary: 'This week, you completed 2 out of 4 activities. Your notes show consistent engagement with journaling and mindfulness practices. You mentioned feeling more energized after morning walks. Consider discussing strategies to maintain momentum during busy work periods in your next session.',
    highlights: [
      'Strong engagement with journaling exercises',
      'Positive response to morning walk routine',
      'Breathing exercises helping with work stress'
    ],
    generatedDate: new Date().toISOString()
  }
});

// Demo data manager class
class DemoDataManager {
  constructor() {
    this.reset();
  }

  reset() {
    const initialData = getInitialDemoData();
    this.treatmentPlan = initialData.treatmentPlan;
    this.userPlan = initialData.userPlan;
    this.weekSummary = initialData.weekSummary;
  }

  // Treatment plan methods
  getPendingTreatmentPlan() {
    return this.treatmentPlan.status === 'pending' ? this.treatmentPlan : null;
  }

  approveTreatmentPlan(planId, suggestions) {
    if (this.treatmentPlan.id === planId) {
      this.treatmentPlan.status = 'approved';
      this.treatmentPlan.approvedDate = new Date().toISOString();
      this.treatmentPlan.suggestions = suggestions;

      // Create a new user plan from the approved treatment plan
      this.userPlan = {
        id: generateId(),
        treatmentPlanId: planId,
        patientId: 'user-123',
        patientName: this.treatmentPlan.patientName,
        startDate: new Date().toISOString(),
        nextSession: new Date(Date.now() + 604800000).toISOString(), // 7 days from now
        suggestions: suggestions.map(s => ({...s}))
      };

      return { success: true, message: 'Treatment plan approved and sent to patient' };
    }
    return { success: false, message: 'Treatment plan not found' };
  }

  requestRevision(planId) {
    if (this.treatmentPlan.id === planId) {
      this.treatmentPlan.status = 'needs_revision';
      this.treatmentPlan.revisionRequestDate = new Date().toISOString();
      return { success: true, message: 'Revision requested. AI will regenerate the plan.' };
    }
    return { success: false, message: 'Treatment plan not found' };
  }

  // User plan methods
  getCurrentUserPlan() {
    return this.userPlan;
  }

  updateActivity(planId, suggestionId, status, notes) {
    if (this.userPlan && this.userPlan.id === planId) {
      const suggestion = this.userPlan.suggestions.find(s => s.id === suggestionId);
      if (suggestion) {
        suggestion.status = status;
        if (notes !== undefined) {
          suggestion.notes = notes;
        }
        return { success: true, message: 'Activity updated successfully' };
      }
    }
    return { success: false, message: 'Plan or activity not found' };
  }

  getWeekSummary() {
    if (this.userPlan) {
      const completedCount = this.userPlan.suggestions.filter(s => s.status === 'completed').length;
      const totalCount = this.userPlan.suggestions.length;

      return {
        ...this.weekSummary,
        completionRate: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
      };
    }
    return null;
  }
}

// Export singleton instance
export const demoDataManager = new DemoDataManager();
