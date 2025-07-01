import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Distance calculation using Haversine formula
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in kilometers
  return Math.round(d * 100) / 100; // Round to 2 decimal places
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Format currency
export function formatCurrency(amount: number, currency: 'USD' | 'RWF'): string {
  const formatters = {
    USD: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }),
    RWF: new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
    }),
  };

  return formatters[currency].format(amount);
}

// Format date
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

// Calculate days until expiry
export function getDaysUntilExpiry(expiryDate: Date | string): number {
  const expiry = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate;
  const now = new Date();
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Get urgency level based on expiry date
export function getUrgencyLevel(expiryDate: Date | string): 'critical' | 'high' | 'medium' | 'low' {
  const days = getDaysUntilExpiry(expiryDate);
  if (days <= 1) return 'critical';
  if (days <= 3) return 'high';
  if (days <= 7) return 'medium';
  return 'low';
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Validate GeoJSON
export function isValidGeoJSON(geojson: any): boolean {
  try {
    if (!geojson || typeof geojson !== 'object') return false;
    if (!geojson.type || !geojson.coordinates) return false;
    return true;
  } catch {
    return false;
  }
}

// Convert address to coordinates (mock function - would use real geocoding service)
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  // This is a mock implementation
  // In a real app, you'd use Google Maps Geocoding API or similar
  console.log(`Geocoding address: ${address}`);
  return null;
}

// Check if point is inside polygon
export function isPointInPolygon(point: [number, number], polygon: number[][]): boolean {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }

  return inside;
}

// Price change calculation
export function calculatePriceChange(currentPrice: number, previousPrice: number): {
  change: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
} {
  const change = currentPrice - previousPrice;
  const percentage = previousPrice > 0 ? (change / previousPrice) * 100 : 0;
  
  let trend: 'up' | 'down' | 'stable';
  if (Math.abs(percentage) < 0.01) {
    trend = 'stable';
  } else if (change > 0) {
    trend = 'up';
  } else {
    trend = 'down';
  }

  return {
    change: Math.round(change * 100) / 100,
    percentage: Math.round(percentage * 100) / 100,
    trend,
  };
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
}
