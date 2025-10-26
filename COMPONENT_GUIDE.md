# CopeAI Component Architecture Guide

## Overview

CopeAI follows a modular component architecture with clear separation between patient and therapist views, while sharing reusable components for consistency.

## Theme System

**File:** [`frontend/src/theme.js`](frontend/src/theme.js)

A centralized design system with healthcare-friendly aesthetics:

- **Color Palette**: Calming blues and teals (primary), soft greens (secondary), warm accents
- **Typography**: Accessible font sizes and weights with comfortable line heights
- **Spacing**: Consistent spacing scale from xs to xxl
- **Shadows**: Subtle elevation system for depth
- **Transitions**: Smooth animations for better UX

### Usage Example:
```javascript
import theme from '../theme';

<div style={{
  color: theme.colors.primary,
  padding: theme.spacing.lg,
  borderRadius: theme.borderRadius.large,
  boxShadow: theme.shadows.medium
}}>
```

## Reusable Components

### SuggestionBox Component

**File:** [`frontend/src/components/SuggestionBox.js`](frontend/src/components/SuggestionBox.js)

A versatile component used in both patient and therapist views to display coping strategy suggestions.

**Props:**
- `suggestion` (object, required): The suggestion data
  - `id`: Unique identifier
  - `type`: 'journaling' | 'exercise' | 'breathing' | 'custom'
  - `title`: Activity title
  - `description`: Detailed description
  - `prompt`: Guided prompt for the activity
  - `frequency`: How often to perform (e.g., "Daily", "3x per week")
  - `status`: 'pending' | 'in_progress' | 'completed' | 'skipped'
  - `notes`: Patient reflection notes

- `onStatusChange` (function): Callback when status/notes change
- `isEditable` (boolean): Whether notes can be edited
- `showCheckbox` (boolean): Show completion checkbox
- `viewMode` (string): 'user' | 'therapist' - Adjusts UI and behavior

**Features:**
- Icon selection based on activity type
- Status color coding
- Expandable notes section
- Approve/Revise buttons (therapist mode)
- Checkbox for completion (patient mode)

## Page Components

### TreatmentPlanPage (Therapist View)

**File:** [`frontend/src/pages/TreatmentPlanPage.js`](frontend/src/pages/TreatmentPlanPage.js)

Interface for therapists to review AI-generated treatment plans before they're sent to patients.

**Key Features:**
- Displays pending treatment plan with session summary
- Shows patient name and session date
- Lists all AI-generated coping strategies
- Approve/Request Revision workflow
- Uses SuggestionBox in therapist mode

**API Endpoints Used:**
- `GET /api/treatment-plan/pending` - Fetch pending plan
- `POST /api/treatment-plan/approve` - Approve and activate plan
- `POST /api/treatment-plan/revise` - Request AI regeneration

**User Flow:**
1. Therapist sees pending plan generated from session transcript
2. Reviews each suggested coping strategy
3. Can add notes or request revision
4. Approves plan → Patient receives notifications

### UserPlanPage (Patient View)

**File:** [`frontend/src/pages/UserPlanPage.js`](frontend/src/pages/UserPlanPage.js)

Patient-facing interface for tracking wellness activities and progress.

**Key Features:**
- Visual progress bar showing completion rate
- List of active coping strategies
- Interactive checkboxes for marking completion
- Notes section for personal reflections
- Weekly summary display (when available)
- Next session reminder

**API Endpoints Used:**
- `GET /api/user-plan/current` - Fetch active plan
- `POST /api/user-plan/update-activity` - Update status/notes
- `GET /api/user-plan/summary` - Get weekly summary

**User Flow:**
1. Patient sees their personalized coping strategies
2. Completes activities and checks them off
3. Adds reflective notes about experiences
4. Views progress and weekly insights
5. Summary shared with therapist before next session

## Main App Component

**File:** [`frontend/src/App.js`](frontend/src/App.js)

Root component with routing and navigation.

**Structure:**
- Navigation bar with CopeAI branding
- Links to switch between Patient and Therapist views
- React Router setup with three routes:
  - `/` - Redirects to `/user`
  - `/user` - UserPlanPage
  - `/therapist` - TreatmentPlanPage

## Component Relationships

```
App
├── Navigation Bar
└── Router
    ├── Route: /user → UserPlanPage
    │   └── SuggestionBox (user mode) × N
    └── Route: /therapist → TreatmentPlanPage
        └── SuggestionBox (therapist mode) × N
```

## Data Flow

### Therapist Approval Flow:
1. Transcript → `/api/treatment-plan/parse-transcript` (GenAI)
2. Generated plan → `TreatmentPlanPage`
3. Therapist approves → `/api/treatment-plan/approve`
4. Creates active user plan → `/api/notifications/schedule`
5. Patient receives plan → `UserPlanPage`

### Patient Engagement Flow:
1. Patient views plan → `/api/user-plan/current`
2. Completes activity → Updates state
3. Adds notes → `/api/user-plan/update-activity`
4. End of week → `/api/user-plan/summary` (GenAI)
5. Summary shared with therapist

## Styling Approach

All components use inline styles with the theme system rather than CSS classes. This provides:
- Type safety with theme constants
- Component-scoped styling
- Easy dynamic styling based on props/state
- No CSS specificity issues

## Best Practices

1. **Reusability**: SuggestionBox adapts to different contexts via props
2. **Consistency**: All components use the centralized theme
3. **Separation of Concerns**: Pages handle data fetching, components handle UI
4. **Accessibility**: Semantic HTML, readable fonts, sufficient color contrast
5. **User Feedback**: Loading states, success messages, visual progress indicators

## Adding New Features

### To add a new activity type:
1. Add icon mapping in `SuggestionBox.getSuggestionIcon()`
2. Update backend to include new type in sample data
3. No other changes needed - components are type-agnostic

### To add a new page:
1. Create component in `frontend/src/pages/`
2. Import in `App.js`
3. Add route in Router
4. Add navigation link if needed

### To modify the theme:
1. Update `frontend/src/theme.js`
2. Changes automatically apply to all components
3. Maintains visual consistency across the app
