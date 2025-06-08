!pip install easyocr
!pip install opencv-python-headless pandas firebase-admin
# ✅ Step 2: Import necessary libraries
import cv2
import easyocr
import pandas as pd
import numpy as np
from datetime import datetime
from google.colab import files
import matplotlib.pyplot as plt
import firebase_admin
from firebase_admin import credentials, db

# ✅ Step 3: Upload files (video/image and vehicle_details.csv)
print("📤 Upload a video or image file AND the 'vehicle_details.csv' file:")
uploaded = files.upload()

# --- Firebase Setup ---
SERVICE_ACCOUNT_PATH = 'refueling-management-firebase-adminsdk-fbsvc-67182e13f5.json'  # <-- update if needed
FIREBASE_DB_URL = 'https://refueling-management-default-rtdb.asia-southeast1.firebasedatabase.app/'

if not firebase_admin._apps:
    cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
    firebase_admin.initialize_app(cred, {
        'databaseURL': FIREBASE_DB_URL
    })
db_ref = db.reference()
subassets_ref = db_ref.child('subassets')
refueling_ref = db_ref.child('refueling')
alerts_ref = db_ref.child('alerts')

# Fetch all sub-asset vehicle numbers from Firebase (sync at start)
subasset_plates = set()
try:
    subassets_snapshot = subassets_ref.get()
    if subassets_snapshot:
        for item in subassets_snapshot.values():
            plate = item.get('vehicleNumber', '').strip().upper().replace(' ', '').replace('-', '')
            if plate:
                subasset_plates.add(plate)
except Exception as e:
    print(f"Error fetching sub-asset details from Firebase: {e}")

# ✅ Step 4: Load vehicle database
vehicle_db = pd.read_csv("/content/SubAsset_details.csv")
known_plates = set(vehicle_db["License Plate"].str.upper().str.replace(" ", "").str.replace("-", ""))

# ✅ Step 5: Initialize EasyOCR reader
reader = easyocr.Reader(['en'])

# ✅ Step 6: Preprocessing function to improve OCR
def preprocess_image(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    sharpen = cv2.GaussianBlur(gray, (0, 0), 3)
    sharpen = cv2.addWeighted(gray, 1.5, sharpen, -0.5, 0)
    _, thresh = cv2.threshold(sharpen, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    return thresh

# ✅ Step 7: Initialize detection tracking
detected_vehicles = {}
frame_count = 0

# ✅ Step 8: Plate detection and verification function
def process_frame(frame):
    global detected_vehicles
    processed = preprocess_image(frame)
    results = reader.readtext(processed)

    for (bbox, text, confidence) in results:
        if confidence > 0.4 and 6 <= len(text) <= 12:
            plate = text.strip().upper().replace(" ", "").replace("-", "")

            # ✅ Filter for "MH" only plates
            if not plate.startswith("MH"):
                continue

            if plate in detected_vehicles:
                continue

            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            if plate in subasset_plates:
                print(f"[{timestamp}] ✅ Vehicle recognized: {plate} (registered)")
                detected_vehicles[plate] = timestamp
                try:
                    refueling_ref.push({
                        'vehicleNumber': plate,
                        'timestamp': timestamp
                    })
                except Exception as e:
                    print(f"Firebase push to refueling failed: {e}")
            else:
                print(f"[{timestamp}] ❌ ALERT! Unknown vehicle: {plate}")
                try:
                    alerts_ref.push({
                        'vehicleNumber': plate,
                        'timestamp': timestamp
                    })
                except Exception as e:
                    print(f"Firebase push to alerts failed: {e}")

# ✅ Step 9: Process uploaded file(s)
for fname in uploaded:
    if fname.endswith(('.jpg', '.jpeg', '.png')):
        # Image processing
        img = cv2.imread(fname)
        process_frame(img)

        # Show image
        plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        plt.title("Uploaded Image")
        plt.axis('off')
        plt.show()

    elif fname.endswith(('.mp4', '.avi', '.mov')):
        # Video processing
        cap = cv2.VideoCapture(fname)
        print("⏳ Processing video...")
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            frame_count += 1
            if frame_count % 10 != 0:
                continue
            resized = cv2.resize(frame, (640, 480))
            process_frame(resized)
        cap.release()

print("✅ All recognized vehicles pushed to Firebase!")