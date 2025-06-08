import { getDatabase, ref, push, get, set, child } from 'firebase/database';
import { initializeApp } from 'firebase/app';

// Firebase config (should match your src/firebase.ts)
const firebaseConfig = {
  apiKey: "AIzaSyAqu-Fxt2WaZJeAfG-Uji9CJT8I3sdgj5Q",
  authDomain: "refueling-management.firebaseapp.com",
  databaseURL: "https://refueling-management-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "refueling-management",
  storageBucket: "refueling-management.firebasestorage.app",
  messagingSenderId: "85863531237",
  appId: "1:85863531237:web:5867d51b24047b892f8a0c",
  measurementId: "G-BHTWFLPVLR"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Type definitions
export interface OperatorDetails {
  name: string;
  phone: string;
  license: string;
  vehicleNo: string;
}

export interface SubAssetDetails {
  vehicleNumber: string;
  vehicleType: string;
  tankCapacity: string;
}

export interface RefuelingHistory {
  timestamp: string;
  vehicleNumber: string;
}

export const dataService = {
  // Operator Details
  addOperatorDetails: async (data: OperatorDetails) => {
    await push(ref(db, 'operators'), data);
  },
  getOperatorDetails: async () => {
    const snapshot = await get(ref(db, 'operators'));
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    }
    return [];
  },

  // Sub Asset Details
  addSubAssetDetails: async (data: SubAssetDetails) => {
    await push(ref(db, 'subassets'), data);
  },
  getSubAssetDetails: async () => {
    const snapshot = await get(ref(db, 'subassets'));
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    }
    return [];
  },

  // Refueling History
  addRefuelingHistory: async (data: RefuelingHistory) => {
    await push(ref(db, 'refueling'), data);
  },
  getRefuelingHistory: async () => {
    const snapshot = await get(ref(db, 'refueling'));
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    }
    return [];
  },

  // Alerts
  addUnregisteredVehicleAlert: async (data: { timestamp: string; vehicleNumber: string }) => {
    await push(ref(db, 'alerts'), data);
  },
  getUnregisteredVehicleAlerts: async () => {
    const snapshot = await get(ref(db, 'alerts'));
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    }
    return [];
  },

  // Join operations (in-memory join)
  getOperatorWithAssetDetails: async () => {
    const ops = await dataService.getOperatorDetails();
    const assets = await dataService.getSubAssetDetails();
    return ops.map((operator: any) => {
      const asset = assets.find((asset: any) => (asset as any).vehicleNumber === operator.vehicleNo);
      return {
        operatorName: operator.name,
        phoneNumber: operator.phone,
        licenseNumber: operator.license,
        vehicleType: asset ? (asset as any).vehicleType : 'N/A',
        vehicleNumber: operator.vehicleNo
      };
    });
  },
  getRefuelingWithOperator: async () => {
    const refuels = await dataService.getRefuelingHistory();
    const ops = await dataService.getOperatorDetails();
    return refuels.map((refuel: any) => {
      const operator = ops.find((op: any) => op.vehicleNo === refuel.vehicleNumber);
      return {
        timestamp: refuel.timestamp,
        vehicleNumber: refuel.vehicleNumber,
        operatorName: operator ? (operator as any).name : 'Unknown'
      };
    });
  },
  getUnregisteredVehicleAlertsFromRefuel: async () => {
    const refuels = await dataService.getRefuelingHistory();
    const assets = await dataService.getSubAssetDetails();
    const registeredVehicles = assets.map((asset: any) => asset.vehicleNumber);
    return refuels
      .filter((refuel: any) => !registeredVehicles.includes(refuel.vehicleNumber))
      .map((refuel: any) => ({
        timestamp: refuel.timestamp,
        vehicleNumber: refuel.vehicleNumber
      }));
  }
};

// Utility: Generate sample data for alerts and refueling history
export function generateSampleData() {
  // Not supported for backend API
}
