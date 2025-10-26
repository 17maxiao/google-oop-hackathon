from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
import uuid

app = Flask(__name__)
CORS(app)

# In-memory storage for demo purposes
treatment_plans = []
user_plans = []
activity_logs = []

# Sample data initialization
def init_sample_data():
    # Create a sample treatment plan for therapist review
    sample_treatment_plan = {
        'id': str(uuid.uuid4()),
        'patientName': 'Sarah Johnson',
        'sessionDate': (datetime.now() - timedelta(days=1)).isoformat(),
        'sessionSummary': 'Patient discussed increased anxiety around work deadlines and difficulty sleeping. We explored several coping mechanisms including mindfulness and journaling. Patient showed interest in developing a consistent self-care routine.',
        'status': 'pending',
        'suggestions': [
            {
                'id': str(uuid.uuid4()),
                'type': 'journaling',
                'title': 'Evening Reflection Journal',
                'description': 'Take 10 minutes before bed to write about your day and any emotions you experienced.',
                'prompt': 'What was one challenging moment today, and how did you handle it? What would you do differently next time?',
                'frequency': 'Daily',
                'status': 'pending',
                'notes': ''
            },
            {
                'id': str(uuid.uuid4()),
                'type': 'exercise',
                'title': 'Mindful Morning Walk',
                'description': 'Start your day with a 15-minute walk, focusing on your surroundings and breathing.',
                'prompt': 'Notice the sounds, sights, and sensations around you. How does your body feel?',
                'frequency': '3x per week',
                'status': 'pending',
                'notes': ''
            },
            {
                'id': str(uuid.uuid4()),
                'type': 'breathing',
                'title': 'Work Break Breathing Exercise',
                'description': 'Practice 4-7-8 breathing technique during work breaks to manage stress.',
                'prompt': 'Breathe in for 4 counts, hold for 7, exhale for 8. Repeat 4 times.',
                'frequency': '2-3x daily',
                'status': 'pending',
                'notes': ''
            },
            {
                'id': str(uuid.uuid4()),
                'type': 'custom',
                'title': 'Gratitude Practice',
                'description': 'Write down three things you\'re grateful for each morning.',
                'prompt': 'What are three things, big or small, that brought you joy or comfort today?',
                'frequency': 'Daily',
                'status': 'pending',
                'notes': ''
            }
        ]
    }

    # Create a sample active user plan
    sample_user_plan = {
        'id': str(uuid.uuid4()),
        'patientId': 'user-123',
        'startDate': (datetime.now() - timedelta(days=3)).isoformat(),
        'nextSession': (datetime.now() + timedelta(days=4)).isoformat(),
        'suggestions': [
            {
                'id': str(uuid.uuid4()),
                'type': 'journaling',
                'title': 'Evening Reflection Journal',
                'description': 'Take 10 minutes before bed to write about your day and any emotions you experienced.',
                'prompt': 'What was one challenging moment today, and how did you handle it? What would you do differently next time?',
                'frequency': 'Daily',
                'status': 'completed',
                'notes': 'This really helped me process my anxiety about the presentation.'
            },
            {
                'id': str(uuid.uuid4()),
                'type': 'exercise',
                'title': 'Mindful Morning Walk',
                'description': 'Start your day with a 15-minute walk, focusing on your surroundings and breathing.',
                'prompt': 'Notice the sounds, sights, and sensations around you. How does your body feel?',
                'frequency': '3x per week',
                'status': 'completed',
                'notes': 'Felt more energized and focused after my walk.'
            },
            {
                'id': str(uuid.uuid4()),
                'type': 'breathing',
                'title': 'Work Break Breathing Exercise',
                'description': 'Practice 4-7-8 breathing technique during work breaks to manage stress.',
                'prompt': 'Breathe in for 4 counts, hold for 7, exhale for 8. Repeat 4 times.',
                'frequency': '2-3x daily',
                'status': 'in_progress',
                'notes': ''
            },
            {
                'id': str(uuid.uuid4()),
                'type': 'custom',
                'title': 'Gratitude Practice',
                'description': 'Write down three things you\'re grateful for each morning.',
                'prompt': 'What are three things, big or small, that brought you joy or comfort today?',
                'frequency': 'Daily',
                'status': 'pending',
                'notes': ''
            }
        ]
    }

    treatment_plans.append(sample_treatment_plan)
    user_plans.append(sample_user_plan)

# Initialize sample data on startup
init_sample_data()

# Legacy endpoints (keeping for backward compatibility)
@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({
        'message': 'Welcome to CopeAI - Bridging therapy and daily life!',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({
        'items': [
            {'id': 1, 'name': 'Item 1', 'description': 'First item'},
            {'id': 2, 'name': 'Item 2', 'description': 'Second item'},
            {'id': 3, 'name': 'Item 3', 'description': 'Third item'}
        ]
    })

@app.route('/api/echo', methods=['POST'])
def echo():
    data = request.get_json()
    return jsonify({
        'received': data,
        'timestamp': datetime.now().isoformat()
    })

# TREATMENT PLAN ENDPOINTS (Therapist View)

@app.route('/api/treatment-plan/pending', methods=['GET'])
def get_pending_treatment_plan():
    """Get the latest treatment plan that needs therapist review"""
    pending_plans = [p for p in treatment_plans if p.get('status') == 'pending']

    if pending_plans:
        return jsonify(pending_plans[0])
    else:
        return jsonify(None)

@app.route('/api/treatment-plan/approve', methods=['POST'])
def approve_treatment_plan():
    """Approve a treatment plan and activate it for the patient"""
    data = request.get_json()
    plan_id = data.get('planId')
    suggestions = data.get('suggestions')

    # Update the treatment plan status
    for plan in treatment_plans:
        if plan['id'] == plan_id:
            plan['status'] = 'approved'
            plan['approvedDate'] = datetime.now().isoformat()
            plan['suggestions'] = suggestions

            # Create an active user plan from the approved treatment plan
            user_plan = {
                'id': str(uuid.uuid4()),
                'treatmentPlanId': plan_id,
                'patientId': 'user-123',  # In real app, this would be dynamic
                'patientName': plan['patientName'],
                'startDate': datetime.now().isoformat(),
                'nextSession': (datetime.now() + timedelta(days=7)).isoformat(),
                'suggestions': suggestions
            }
            user_plans.append(user_plan)

            return jsonify({
                'success': True,
                'message': 'Treatment plan approved and sent to patient',
                'userPlanId': user_plan['id']
            })

    return jsonify({'success': False, 'message': 'Treatment plan not found'}), 404

@app.route('/api/treatment-plan/revise', methods=['POST'])
def revise_treatment_plan():
    """Request revision of a treatment plan"""
    data = request.get_json()
    plan_id = data.get('planId')

    for plan in treatment_plans:
        if plan['id'] == plan_id:
            plan['status'] = 'needs_revision'
            plan['revisionRequestDate'] = datetime.now().isoformat()

            return jsonify({
                'success': True,
                'message': 'Revision requested. AI will regenerate the plan.'
            })

    return jsonify({'success': False, 'message': 'Treatment plan not found'}), 404

@app.route('/api/treatment-plan/parse-transcript', methods=['POST'])
def parse_transcript():
    """
    Parse therapy session transcript and generate treatment plan.
    This would use GenAI in production.
    """
    data = request.get_json()
    transcript = data.get('transcript', '')
    patient_name = data.get('patientName', 'Patient')

    # In production, this would call GenAI to analyze the transcript
    # For demo, we'll create a sample plan
    new_plan = {
        'id': str(uuid.uuid4()),
        'patientName': patient_name,
        'sessionDate': datetime.now().isoformat(),
        'sessionSummary': 'AI-generated summary based on transcript analysis...',
        'status': 'pending',
        'suggestions': [
            {
                'id': str(uuid.uuid4()),
                'type': 'journaling',
                'title': 'AI-Generated Journaling Prompt',
                'description': 'Generated based on session themes',
                'prompt': 'Reflect on today\'s conversation...',
                'frequency': 'Daily',
                'status': 'pending',
                'notes': ''
            }
        ]
    }

    treatment_plans.append(new_plan)

    return jsonify({
        'success': True,
        'message': 'Treatment plan generated from transcript',
        'planId': new_plan['id']
    })

# USER PLAN ENDPOINTS (Patient View)

@app.route('/api/user-plan/current', methods=['GET'])
def get_current_user_plan():
    """Get the current active plan for the user"""
    # In real app, this would filter by authenticated user ID
    if user_plans:
        # Return the most recent user plan
        return jsonify(user_plans[-1])
    else:
        return jsonify(None)

@app.route('/api/user-plan/update-activity', methods=['POST'])
def update_activity():
    """Update a specific activity's status and notes"""
    data = request.get_json()
    plan_id = data.get('planId')
    suggestion_id = data.get('suggestionId')
    status = data.get('status')
    notes = data.get('notes')

    for plan in user_plans:
        if plan['id'] == plan_id:
            for suggestion in plan['suggestions']:
                if suggestion['id'] == suggestion_id:
                    suggestion['status'] = status
                    if notes is not None:
                        suggestion['notes'] = notes

                    # Log the activity
                    activity_logs.append({
                        'id': str(uuid.uuid4()),
                        'planId': plan_id,
                        'suggestionId': suggestion_id,
                        'status': status,
                        'notes': notes,
                        'timestamp': datetime.now().isoformat()
                    })

                    return jsonify({
                        'success': True,
                        'message': 'Activity updated successfully'
                    })

    return jsonify({'success': False, 'message': 'Plan or activity not found'}), 404

@app.route('/api/user-plan/summary', methods=['GET'])
def get_week_summary():
    """
    Get AI-generated summary of the week's activities.
    This would be sent to both patient and therapist.
    """
    # Check if it's time for a weekly summary (e.g., end of week)
    # For demo, we'll return a sample summary

    if user_plans and len(user_plans) > 0:
        current_plan = user_plans[-1]
        completed_count = sum(1 for s in current_plan['suggestions'] if s['status'] == 'completed')
        total_count = len(current_plan['suggestions'])

        summary = {
            'weekNumber': 1,
            'completionRate': round((completed_count / total_count) * 100) if total_count > 0 else 0,
            'summary': f'This week, you completed {completed_count} out of {total_count} activities. Your notes show consistent engagement with journaling and mindfulness practices. You mentioned feeling more energized after morning walks. Consider discussing strategies to maintain momentum during busy work periods in your next session.',
            'highlights': [
                'Strong engagement with journaling exercises',
                'Positive response to morning walk routine',
                'Breathing exercises helping with work stress'
            ],
            'generatedDate': datetime.now().isoformat()
        }

        return jsonify(summary)

    return jsonify({'summary': None})

# DEMO RESET ENDPOINT

@app.route('/api/demo/reset', methods=['POST'])
def reset_demo():
    """
    Reset the demo to initial state with fresh data.
    Clears all data and regenerates sample treatment plan and user plan.
    """
    global treatment_plans, user_plans, activity_logs

    # Clear all existing data
    treatment_plans.clear()
    user_plans.clear()
    activity_logs.clear()

    # Reinitialize with fresh sample data
    init_sample_data()

    return jsonify({
        'success': True,
        'message': 'Demo reset successfully',
        'timestamp': datetime.now().isoformat(),
        'data': {
            'treatment_plans_count': len(treatment_plans),
            'user_plans_count': len(user_plans),
            'activity_logs_count': len(activity_logs)
        }
    })

# NOTIFICATION ENDPOINTS (Twilio integration points)

@app.route('/api/notifications/send', methods=['POST'])
def send_notification():
    """
    Send notification to patient (would integrate with Twilio).
    Called by cron job or scheduler.
    """
    data = request.get_json()
    patient_id = data.get('patientId')
    message = data.get('message')
    suggestion_id = data.get('suggestionId')

    # In production, this would send via Twilio
    # For demo, we'll just log it

    return jsonify({
        'success': True,
        'message': 'Notification sent (demo)',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/notifications/schedule', methods=['POST'])
def schedule_notifications():
    """
    Schedule notifications for a user's treatment plan.
    Called after treatment plan approval.
    """
    data = request.get_json()
    plan_id = data.get('planId')

    # In production, this would create scheduled jobs

    return jsonify({
        'success': True,
        'message': 'Notifications scheduled',
        'scheduledCount': 7  # Example: 7 notifications for the week
    })

if __name__ == '__main__':
    app.run(debug=True, port=5001)
