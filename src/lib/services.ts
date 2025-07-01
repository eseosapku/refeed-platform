import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  type DocumentSnapshot,
  type QuerySnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { FoodDesert, Donor, FoodLog, PriceEntry, Match, User, Alert } from '@/types';

// Generic Firestore service
class FirestoreService<T> {
  constructor(private collectionName: string) {}

  async create(data: Omit<T, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error(`Error creating ${this.collectionName}:`, error);
      throw error;
    }
  }

  async getById(id: string): Promise<T | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (error) {
      console.error(`Error getting ${this.collectionName} by ID:`, error);
      throw error;
    }
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error(`Error updating ${this.collectionName}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting ${this.collectionName}:`, error);
      throw error;
    }
  }

  async getAll(limitCount?: number): Promise<T[]> {
    try {
      const q = limitCount 
        ? query(collection(db, this.collectionName), limit(limitCount))
        : query(collection(db, this.collectionName));
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
    } catch (error) {
      console.error(`Error getting all ${this.collectionName}:`, error);
      throw error;
    }
  }

  async getByField(field: string, value: any, limitCount?: number): Promise<T[]> {
    try {
      const q = limitCount
        ? query(collection(db, this.collectionName), where(field, '==', value), limit(limitCount))
        : query(collection(db, this.collectionName), where(field, '==', value));
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
    } catch (error) {
      console.error(`Error getting ${this.collectionName} by field:`, error);
      throw error;
    }
  }
}

// Specific services
export const foodDesertService = new FirestoreService<FoodDesert>('food-deserts');
export const donorService = new FirestoreService<Donor>('donors');
export const foodLogService = new FirestoreService<FoodLog>('food-logs');
export const priceService = new FirestoreService<PriceEntry>('prices');
export const matchService = new FirestoreService<Match>('matches');
export const userService = new FirestoreService<User>('users');
export const alertService = new FirestoreService<Alert>('alerts');

// Enhanced services with specific methods
export class FoodDesertService extends FirestoreService<FoodDesert> {
  constructor() {
    super('food-deserts');
  }

  async getByCountry(country: 'USA' | 'Rwanda'): Promise<FoodDesert[]> {
    return this.getByField('country', country);
  }

  async uploadGeoJSON(name: string, country: 'USA' | 'Rwanda', geojson: GeoJSON.Polygon): Promise<string> {
    return this.create({
      name,
      country,
      polygon: geojson,
      lastUpdated: new Date(),
      createdAt: new Date(),
    });
  }
}

export class DonorService extends FirestoreService<Donor> {
  constructor() {
    super('donors');
  }

  async getActiveDonors(): Promise<Donor[]> {
    return this.getByField('isActive', true);
  }

  async getNearbyDonors(lat: number, lng: number, radiusKm: number): Promise<Donor[]> {
    // This is a simplified version - in production, you'd use geohash or GeoFirestore
    const allDonors = await this.getActiveDonors();
    return allDonors.filter(donor => {
      const distance = this.calculateDistance(lat, lng, donor.location.lat, donor.location.lng);
      return distance <= radiusKm;
    });
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

export class FoodLogService extends FirestoreService<FoodLog> {
  constructor() {
    super('food-logs');
  }

  async getByDonor(donorId: string): Promise<FoodLog[]> {
    return this.getByField('donorId', donorId);
  }

  async getUnmatchedFood(): Promise<FoodLog[]> {
    return this.getByField('isMatched', false);
  }

  async getExpiringFood(daysAhead: number = 3): Promise<FoodLog[]> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() + daysAhead);
      
      const q = query(
        collection(db, 'food-logs'),
        where('expiryDate', '<=', Timestamp.fromDate(cutoffDate)),
        where('isMatched', '==', false),
        orderBy('expiryDate', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as FoodLog[];
    } catch (error) {
      console.error('Error getting expiring food:', error);
      throw error;
    }
  }
}

export class PriceService extends FirestoreService<PriceEntry> {
  constructor() {
    super('prices');
  }

  async getByRegion(region: string, item?: string): Promise<PriceEntry[]> {
    try {
      let q;
      if (item) {
        q = query(
          collection(db, 'prices'),
          where('region', '==', region),
          where('item', '==', item),
          orderBy('priceDate', 'desc')
        );
      } else {
        q = query(
          collection(db, 'prices'),
          where('region', '==', region),
          orderBy('priceDate', 'desc')
        );
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as PriceEntry[];
    } catch (error) {
      console.error('Error getting prices by region:', error);
      throw error;
    }
  }

  async getLatestPrices(region: string): Promise<PriceEntry[]> {
    try {
      const q = query(
        collection(db, 'prices'),
        where('region', '==', region),
        orderBy('priceDate', 'desc'),
        limit(10)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as PriceEntry[];
    } catch (error) {
      console.error('Error getting latest prices:', error);
      throw error;
    }
  }

  async detectPriceSpikes(region: string, item: string, threshold: number = 20): Promise<boolean> {
    try {
      const prices = await this.getByRegion(region, item);
      if (prices.length < 2) return false;

      const [latest, previous] = prices;
      const change = ((latest.price - previous.price) / previous.price) * 100;
      
      return change > threshold;
    } catch (error) {
      console.error('Error detecting price spikes:', error);
      return false;
    }
  }
}

export class MatchService extends FirestoreService<Match> {
  constructor() {
    super('matches');
  }

  async getByStatus(status: Match['status']): Promise<Match[]> {
    return this.getByField('status', status);
  }

  async getByDonor(donorId: string): Promise<Match[]> {
    return this.getByField('donorId', donorId);
  }

  async getByFoodDesert(foodDesertId: string): Promise<Match[]> {
    return this.getByField('foodDesertId', foodDesertId);
  }

  async createMatch(
    donorId: string,
    foodLogId: string,
    foodDesertId: string,
    distance: number,
    priority: Match['priority'] = 'medium'
  ): Promise<string> {
    const matchId = await this.create({
      donorId,
      foodLogId,
      foodDesertId,
      distance,
      priority,
      status: 'pending',
      matchedAt: new Date(),
    });

    // Update food log as matched
    await foodLogService.update(foodLogId, { isMatched: true, matchedTo: foodDesertId });

    return matchId;
  }
}

// Initialize enhanced services
export const enhancedFoodDesertService = new FoodDesertService();
export const enhancedDonorService = new DonorService();
export const enhancedFoodLogService = new FoodLogService();
export const enhancedPriceService = new PriceService();
export const enhancedMatchService = new MatchService();
