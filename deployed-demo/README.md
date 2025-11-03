# CopeAI - Self-Contained Demo

This is a fully self-contained demo of the CopeAI application that runs entirely in the browser without any backend dependencies. All functionality is simulated using local state management.

## Features

This demo provides the same user experience as the full application with frontend + backend, but without requiring any server:

- **Patient View**: Interactive wellness plan with progress tracking
- **Therapist Review**: Treatment plan review and approval workflow
- **Demo Reset**: Reset functionality to restore initial demo state
- **Local State Management**: All data is managed in-browser using React state

## Key Differences from Full App

- ✅ No backend server required
- ✅ No API calls - all data is managed locally
- ✅ Fully functional demo experience
- ✅ Instant responses (no network latency)
- ❌ Data resets on page refresh
- ❌ No persistent storage
- ❌ No real AI integration

## Quick Start

### Installation

```bash
npm install
```

### Development

Run the app in development mode:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Production Build

Build the app for production:

```bash
npm run build
```

The build folder will contain a static site ready for deployment.

## Project Structure

```
deployed-demo/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/
│   │   └── SuggestionBox.js    # Reusable activity card component
│   ├── data/
│   │   └── demoData.js         # Mock data store and manager
│   ├── pages/
│   │   ├── UserPlanPage.js     # Patient view
│   │   └── TreatmentPlanPage.js # Therapist review view
│   ├── styles/
│   │   ├── index.css
│   │   ├── App.css
│   │   ├── SuggestionBox.css
│   │   └── TreatmentPlanPage.css
│   ├── App.js              # Main app with routing
│   ├── index.js            # Entry point
│   └── theme.js            # Theme configuration
├── package.json
└── README.md
```

## How It Works

### Local Data Management

The `demoData.js` module provides a `DemoDataManager` class that simulates backend functionality:

- **Treatment Plans**: Manages pending treatment plans for therapist review
- **User Plans**: Manages active patient wellness plans
- **Activity Tracking**: Updates activity status and notes
- **Demo Reset**: Restores initial demo state

### Component Architecture

- **App.js**: Main router with navigation bar
- **UserPlanPage**: Patient view with progress tracking and activity completion
- **TreatmentPlanPage**: Therapist view for reviewing and approving plans
- **SuggestionBox**: Reusable component for displaying activities/suggestions

### Data Flow

1. Components read data from `demoDataManager` on mount
2. User interactions update local component state
3. Changes are persisted to `demoDataManager`
4. Parent components are notified to trigger re-renders
5. Demo reset clears all data and reinitializes

## Deployment

This is a standard Create React App that can be deployed to any static hosting service:

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Drag and drop the build folder to Netlify
```

### GitHub Pages

```bash
npm install --save-dev gh-pages

# Add to package.json:
"homepage": "https://yourusername.github.io/deployed-demo",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}

npm run deploy
```

## Demo Workflow

### Patient View (/user)

1. View personalized coping strategies
2. Check off completed activities
3. Add notes about experiences
4. Track weekly progress
5. See week-in-review summary

### Therapist Review (/therapist)

1. Review pending treatment plan
2. See session summary and context
3. Review AI-generated coping strategies
4. Approve plan to send to patient
5. Request revision if needed

### Reset Demo

Click "Reset Demo" button to:
- Clear all current data
- Restore initial demo state
- Navigate to therapist view
- Reload to show fresh data

## Technologies Used

- React 18
- React Router v6
- CSS (converted from SCSS)
- Local state management (no Redux/Context needed for demo)

## License

See main project LICENSE file.
