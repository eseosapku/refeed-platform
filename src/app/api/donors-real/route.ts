import { NextRequest, NextResponse } from 'next/server'
import { realDataService } from '@/lib/realDataService'

// Helper functions
function categorizeStoreType(types: string[]): string {
  if (types.includes('supermarket') || types.includes('grocery_or_supermarket')) {
    return 'supermarket'
  }
  if (types.includes('restaurant') || types.includes('meal_takeaway')) {
    return 'restaurant'
  }
  if (types.includes('store')) {
    return 'distributor'
  }
  return 'supermarket' // Default
}

function estimateCapacity(types: string[], rating?: number): string {
  const isLargeStore = types.some(type => 
    ['department_store', 'shopping_mall', 'supermarket'].includes(type)
  )
  
  if (isLargeStore) return 'large'
  if (rating && rating > 4.0) return 'medium'
  return 'small'
}

function getAvailableItems(types: string[]): string[] {
  if (types.includes('supermarket') || types.includes('grocery_or_supermarket')) {
    return ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery']
  }
  if (types.includes('restaurant')) {
    return ['prepared_foods', 'beverages']
  }
  return ['general']
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const useRealData = searchParams.get('real') === 'true'
    const radius = parseInt(searchParams.get('radius') || '50000') // 50km radius
    
    if (!useRealData) {
      return NextResponse.json({
        success: false,
        error: 'Real data not requested. Use ?real=true to fetch real data.',
        message: 'Add ?real=true to your request to fetch real grocery store data from Google Places.'
      })
    }

    // Check if APIs are configured
    if (!realDataService.isConfigured()) {
      return NextResponse.json({
        success: false,
        error: 'APIs not configured',
        message: 'Please add GOOGLE_PLACES_API_KEY to your environment variables.',
        instructions: {
          google: 'Get your key at: https://developers.google.com/maps/documentation/places/web-service/get-api-key'
        }
      }, { status: 400 })
    }

    // Get API status
    const apiStatus = await realDataService.getApiStatus()
    
    // If APIs are not available, use fallback data
    if (!apiStatus.google && !apiStatus.census) {
      console.log('APIs not available, using fallback data')
      const fallbackStores = await realDataService.getFallbackGroceryStores()
      
      const transformedStores = fallbackStores.map((store: any, index: number) => ({
        id: `fallback_${index + 1}`,
        name: store.name,
        type: categorizeStoreType(store.types),
        location: {
          lat: store.location.lat,
          lng: store.location.lng,
          address: store.address
        },
        contactInfo: {
          website: null,
          phone: null
        },
        isActive: store.isOpen || true,
        capacity: estimateCapacity(store.types, store.rating),
        availableItems: getAvailableItems(store.types),
        credibilityScore: 3, // Lower score for fallback data
        dataSource: 'Fallback Data',
        operatingHours: 'Hours vary',
        lastVerified: new Date().toISOString(),
        exportCapability: false
      }))

      return NextResponse.json({
        success: true,
        data: transformedStores,
        total: transformedStores.length,
        dataSource: 'Fallback data (APIs not configured)',
        apiStatus,
        lastFetched: new Date().toISOString(),
        searchCriteria: {
          cities: ['Major US Cities'],
          radius: '50km',
          storeTypes: ['grocery_or_supermarket', 'supermarket', 'food']
        },
        credibilityScore: 3,
        limitations: [
          'Using fallback data - not from live APIs',
          'Limited coverage - sample locations only',
          'Data accuracy not verified',
          'For demo purposes only'
        ]
      })
    }

    // Get major cities to search for stores
    const cities = await realDataService.getMajorUSCities()
    let allStores: any[] = []

    // Search for grocery stores in major cities (limit to first 3 cities for demo)
    for (const city of cities.slice(0, 3)) {
      try {
        const stores = await realDataService.getGroceryStores(city.lat, city.lng, radius)
        
        // Transform stores to match our format
        const transformedStores = await Promise.all(
          stores.slice(0, 8).map(async (store, index) => { // Limit to 8 stores per city
            // Get additional details for each store
            const details = await realDataService.getStoreDetails(store.place_id)
            
            return {
              id: `real_${city.name.replace(/[^a-zA-Z0-9]/g, '_')}_${index + 1}`,
              name: store.name,
              type: categorizeStoreType(store.types),
              location: {
                lat: store.location.lat,
                lng: store.location.lng,
                address: details?.formatted_address || store.address
              },
              contactInfo: {
                phone: details?.formatted_phone_number || 'Not available',
                email: `contact@${store.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}.com`,
                contactPerson: 'Store Manager',
                website: details?.website
              },
              isActive: store.isOpen !== undefined ? store.isOpen : true,
              registeredAt: new Date(),
              foodLogs: [],
              capacity: estimateCapacity(store.types, store.rating),
              availableItems: getAvailableItems(store.types),
              rating: store.rating,
              openingHours: details?.opening_hours?.weekday_text || [],
              placeId: store.place_id,
              dataSource: 'Google Places API',
              credibilityScore: 4, // 4 stars for Google Places data
            }
          })
        )
        
        allStores = [...allStores, ...transformedStores]
      } catch (error) {
        console.error(`Error fetching stores for ${city.name}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      data: allStores,
      total: allStores.length,
      dataSource: 'Real data from Google Places API',
      apiStatus,
      lastFetched: new Date().toISOString(),
      searchCriteria: {
        cities: cities.slice(0, 3).map(c => c.name),
        radius: `${radius / 1000}km`,
        storeTypes: ['grocery_or_supermarket', 'supermarket', 'food']
      },
      credibilityScore: 4, // 4 stars for Google Places data
      limitations: [
        'Data limited to Google Places database coverage',
        'Store hours and contact info may not be current',
        'Capacity estimates are algorithmic, not verified',
        'Limited to major metropolitan areas',
        'API quota limits number of results'
      ]
    })
  } catch (error) {
    console.error('Error fetching real donor data:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch real donor data',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        suggestion: 'Try using mock data endpoint: /api/donors'
      },
      { status: 500 }
    )
  }
}
