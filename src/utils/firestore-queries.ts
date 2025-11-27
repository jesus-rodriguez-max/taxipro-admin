import { collection, query, where, getDocs, getCountFromServer } from 'firebase/firestore';
import { db } from '../firebase/firestore';

export interface DashboardMetrics {
  activeDrivers: number;
  activeTrips: number;
  totalPassengers: number;
  suspendedDrivers: number;
  pendingDocuments: number;
}

export interface PendingDriver {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export async function getActiveDriversCount(): Promise<number> {
  try {
    const q = query(
      collection(db, 'drivers'),
      where('status', '==', 'active')
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (error) {
    console.error('Error getting active drivers count:', error);
    return 0;
  }
}

export async function getActiveTripsCount(): Promise<number> {
  try {
    const q = query(
      collection(db, 'trips'),
      where('status', 'in', ['pending', 'assigned', 'active'])
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (error) {
    console.error('Error getting active trips count:', error);
    return 0;
  }
}

export async function getPassengersCount(): Promise<number> {
  try {
    const q = query(collection(db, 'passengers'));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (error) {
    console.error('Error getting passengers count:', error);
    return 0;
  }
}

export async function getSuspendedDriversCount(): Promise<number> {
  try {
    const q = query(
      collection(db, 'drivers'),
      where('status', '==', 'suspended')
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (error) {
    console.error('Error getting suspended drivers count:', error);
    return 0;
  }
}

export async function getPendingDocumentsDrivers(): Promise<PendingDriver[]> {
  try {
    const q = query(
      collection(db, 'drivers'),
      where('status', '==', 'pending')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || data.displayName || 'Sin nombre',
        email: data.email || 'Sin email',
        createdAt: data.createdAt?.toDate() || new Date(),
      };
    });
  } catch (error) {
    console.error('Error getting pending documents drivers:', error);
    return [];
  }
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    const [
      activeDrivers,
      activeTrips,
      totalPassengers,
      suspendedDrivers,
      pendingDocuments
    ] = await Promise.all([
      getActiveDriversCount(),
      getActiveTripsCount(),
      getPassengersCount(),
      getSuspendedDriversCount(),
      getPendingDocumentsDrivers().then(drivers => drivers.length),
    ]);

    return {
      activeDrivers,
      activeTrips,
      totalPassengers,
      suspendedDrivers,
      pendingDocuments,
    };
  } catch (error) {
    console.error('Error getting dashboard metrics:', error);
    return {
      activeDrivers: 0,
      activeTrips: 0,
      totalPassengers: 0,
      suspendedDrivers: 0,
      pendingDocuments: 0,
    };
  }
}
