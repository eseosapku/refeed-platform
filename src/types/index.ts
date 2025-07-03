export interface FoodDesert {
  id: string;
  name: string;
  country: 'USA' | 'Rwanda';
  polygon: GeoJSON.Polygon;
  population?: number;
  lastUpdated: Date;
  createdAt: Date;
}

export interface Donor {
  id: string;
  name: string;
  type: 'supermarket' | 'farm' | 'distributor' | 'restaurant';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  contactInfo: {
    phone?: string;
    email?: string;
    contactPerson?: string;
  };
  isActive: boolean;
  registeredAt: Date;
  foodLogs: string[]; // Array of FoodLog IDs
}

export interface FoodLog {
  id: string;
  donorId: string;
  foodType: string;
  category: 'produce' | 'dairy' | 'meat' | 'grains' | 'prepared' | 'other';
  condition: 'excellent' | 'good' | 'fair' | 'near-expiry';
  quantity: number;
  unit: 'kg' | 'lbs' | 'pieces' | 'boxes';
  expiryDate: Date;
  imageURL?: string;
  description?: string;
  isMatched: boolean;
  matchedTo?: string; // FoodDesert ID
  createdAt: Date;
  updatedAt: Date;
}

export interface PriceEntry {
  id: string;
  region: string;
  country: 'USA' | 'Rwanda';
  item: string;
  price: number;
  currency: 'USD' | 'RWF';
  unit: string;
  source: 'manual' | 'scraped' | 'api';
  sourceDetails?: string;
  priceDate: Date;
  recordedAt: Date;
  recordedBy?: string; // User ID
}

export interface Match {
  id: string;
  donorId: string;
  foodLogId: string;
  foodDesertId: string;
  distance: number; // in kilometers
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'accepted' | 'in-transit' | 'delivered' | 'cancelled';
  matchedAt: Date;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  notes?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'donor' | 'logistics' | 'price-agent';
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Alert {
  id: string;
  type: 'price-spike' | 'new-donation' | 'match-found' | 'delivery-update';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  isRead: boolean;
  userId?: string;
  data?: Record<string, any>;
  createdAt: Date;
}

// Form types
export interface DonorRegistrationForm {
  name: string;
  type: Donor['type'];
  address: string;
  phone?: string;
  email?: string;
  contactPerson?: string;
}

export interface FoodDonationForm {
  foodType: string;
  category: FoodLog['category'];
  condition: FoodLog['condition'];
  quantity: number;
  unit: FoodLog['unit'];
  expiryDate: string;
  description?: string;
  image?: File;
}

export interface PriceInputForm {
  region: string;
  country: PriceEntry['country'];
  item: string;
  price: number;
  currency: PriceEntry['currency'];
  unit: string;
  priceDate: string;
  sourceDetails?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Map types
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapMarker {
  id: string;
  type: 'donor' | 'food-desert' | 'match';
  position: {
    lat: number;
    lng: number;
  };
  data: Donor | FoodDesert | Match;
}

export interface FarmingContainer {
  id: string;
  name: string;
  type: 'vertical_farm' | 'hydroponic' | 'aeroponic';
  coordinates: [number, number];
  foodDesertId: string;
  status: 'planned' | 'active' | 'maintenance';
  capacity: {
    monthly_yield_kg: number;
    crop_types: number;
    growing_cycles_per_year: number;
  };
  recommendations: CropRecommendation[];
  impact: {
    current_severity: 'high' | 'medium' | 'low';
    projected_severity: 'high' | 'medium' | 'low';
    population_served: number;
    reduction_percentage: number;
  };
  installation: {
    cost_estimate: number;
    installation_time_weeks: number;
    maintenance_cost_annual: number;
  };
}

export interface CropRecommendation {
  crop: string;
  suitability_score: number; // 0-100
  yield_per_cycle_kg: number;
  growth_time_days: number;
  nutritional_value: 'high' | 'medium' | 'low';
  local_demand: 'high' | 'medium' | 'low';
  reason: string;
}
