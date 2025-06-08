# pushRefuelingHistoryToFirebase.py
# This script pushes refueling history details from a JSON file to Firebase Realtime Database
import json
import firebase_admin
from firebase_admin import credentials, db

# Path to your service account key (update if needed)
SERVICE_ACCOUNT_PATH = 'refueling-management-firebase-adminsdk-fbsvc-67182e13f5.json'
FIREBASE_DB_URL = 'https://refueling-management-default-rtdb.asia-southeast1.firebasedatabase.app/'

# Only initialize if not already initialized
if not firebase_admin._apps:
    cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
    firebase_admin.initialize_app(cred, {
        'databaseURL': FIREBASE_DB_URL
    })

# Load refueling history details from JSON file
with open('refueling_history.json', 'r') as f:
    refueling_history = json.load(f)

# Push each refueling record to Firebase under 'refueling' node
ref = db.reference('refueling')
for item in refueling_history:
    ref.push(item)
print('✅ All refueling history records pushed to Firebase!')
