# pushOperatorDetailsToFirebase.py
# This script pushes operator details from a JSON file to Firebase Realtime Database
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

# Load operator details from JSON file
with open('operator_details.json', 'r') as f:
    operators = json.load(f)

# Push each operator to Firebase under 'operators' node
ref = db.reference('operators')
for item in operators:
    ref.push(item)
print('✅ All operator records pushed to Firebase!')
