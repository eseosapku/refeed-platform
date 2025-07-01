import { NextRequest, NextResponse } from 'next/server'
import { realDataService } from '@/lib/realDataService'
import { kaggleDataService } from '@/lib/kaggleDataService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country') || 'USA'
    const useRealData = searchParams.get('real') === 'true'
    
    if (!useRealData) {
      return NextResponse.json({
        success: false,
        error: 'Real data not requested. Use ?real=true to fetch real data.',
        message: 'Add ?real=true to your request to fetch real food desert data from government sources.'
      })
    }

    // Check if Kaggle data is available first (highest priority - official USDA data)
    let kaggleData: any[] = []
    try {
      kaggleData = await kaggleDataService.processFoodDesertData()
      console.log(`Found ${kaggleData.length} Kaggle food desert locations`)
    } catch (error) {
      console.log('Kaggle data not available, will try API data')
    }

    // If we have Kaggle data, use it (it's the highest quality)
    if (kaggleData.length > 0) {
      const transformedKaggleDeserts = kaggleData.map((desert: any, index: number) => ({
        id: `kaggle_${desert.id}`,
        name: desert.name,
        country: desert.country,
        polygon: {
          type: 'Polygon',
          coordinates: [[
            [desert.coordinates[1] - 0.01, desert.coordinates[0] - 0.01],
            [desert.coordinates[1] + 0.01, desert.coordinates[0] - 0.01],
            [desert.coordinates[1] + 0.01, desert.coordinates[0] + 0.01],
            [desert.coordinates[1] - 0.01, desert.coordinates[0] + 0.01],
            [desert.coordinates[1] - 0.01, desert.coordinates[0] - 0.01]
          ]]
        },
        population: desert.population,
        severity: desert.severity,
        lowAccessNumbers: desert.lowAccessNumbers,
        demographics: desert.demographics,
        access: desert.access,
        dataSource: 'USDA Food Access Research Atlas (Kaggle)',
        lastUpdated: new Date(),
        createdAt: new Date(),
      }))

      return NextResponse.json({
        success: true,
        data: transformedKaggleDeserts,
        total: transformedKaggleDeserts.length,
        dataSource: 'Real USDA data from Kaggle Food Access Research Atlas',
        apiStatus: { kaggle: true, census: false, google: false },
        lastFetched: new Date().toISOString(),
        credibilityScore: 5, // 5 stars for official USDA data
        limitations: [
          'Data is from official USDA Food Access Research Atlas',
          'Census tract level granularity',
          'Updated annually by USDA',
          'Covers all US states and territories'
        ]
      })
    }

    // Check if APIs are configured for fallback
    if (!realDataService.isConfigured()) {
      console.log('APIs not configured, using fallback food desert data')
      const fallbackDeserts = await realDataService.getFallbackFoodDesertsData()
      
      const transformedDeserts = fallbackDeserts.map((desert: any, index: number) => ({
        id: `fallback_${index + 1}`,
        name: `${desert.county}, ${desert.state}`,
        country: 'USA',
        polygon: {
          type: 'Polygon',
          coordinates: [[
            [desert.coordinates[1] - 0.01, desert.coordinates[0] - 0.01],
            [desert.coordinates[1] + 0.01, desert.coordinates[0] - 0.01],
            [desert.coordinates[1] + 0.01, desert.coordinates[0] + 0.01],
            [desert.coordinates[1] - 0.01, desert.coordinates[0] + 0.01],
            [desert.coordinates[1] - 0.01, desert.coordinates[0] - 0.01]
          ]]
        },
        population: desert.population,
        severity: desert.severity,
        lowAccessNumbers: desert.lowAccessNumbers,
        lowIncomeTracts: desert.lowIncomeTracts,
        dataSource: 'Fallback Data',
        lastUpdated: new Date(),
        createdAt: new Date(),
      }))

      return NextResponse.json({
        success: true,
        data: transformedDeserts,
        total: transformedDeserts.length,
        dataSource: 'Fallback data (APIs not configured)',
        apiStatus: { kaggle: false, census: false, google: false },
        lastFetched: new Date().toISOString(),
        credibilityScore: 3,
        limitations: [
          'Using fallback data - not from live APIs',
          'Limited coverage - sample locations only',
          'Data accuracy not verified',
          'For demo purposes only'
        ]
      })
    }

    // Get API status for remaining checks
    const apiStatus = await realDataService.getApiStatus()
    
    // If APIs are not available, use fallback data
    if (!apiStatus.census && !apiStatus.google) {
      console.log('APIs not available, using fallback food desert data')
      const fallbackDeserts = await realDataService.getFallbackFoodDesertsData()
      
      const transformedDeserts = fallbackDeserts.map((desert: any, index: number) => ({
        id: `fallback_${index + 1}`,
        name: `${desert.county}, ${desert.state}`,
        country: 'USA',
        polygon: {
          type: 'Polygon',
          coordinates: [[
            [desert.coordinates[1] - 0.01, desert.coordinates[0] - 0.01],
            [desert.coordinates[1] + 0.01, desert.coordinates[0] - 0.01],
            [desert.coordinates[1] + 0.01, desert.coordinates[0] + 0.01],
            [desert.coordinates[1] - 0.01, desert.coordinates[0] + 0.01],
            [desert.coordinates[1] - 0.01, desert.coordinates[0] - 0.01]
          ]]
        },
        population: desert.population,
        severity: desert.severity,
        lowAccessNumbers: desert.lowAccessNumbers,
        lowIncomeTracts: desert.lowIncomeTracts,
        dataSource: 'Fallback Data',
        lastUpdated: new Date(),
        createdAt: new Date(),
      }))

      return NextResponse.json({
        success: true,
        data: transformedDeserts,
        total: transformedDeserts.length,
        dataSource: 'Fallback data (APIs not configured)',
        apiStatus,
        lastFetched: new Date().toISOString(),
        credibilityScore: 3,
        limitations: [
          'Using fallback data - not from live APIs',
          'Limited coverage - sample locations only',
          'Data accuracy not verified',
          'For demo purposes only'
        ]
      })
    }

    // Fetch real food desert data from APIs as final fallback
    const realFoodDeserts = await realDataService.getFoodDeserts()
    
    // Transform to match our existing format
    const transformedDeserts = realFoodDeserts.map((desert, index) => ({
      id: `real_${index + 1}`,
      name: `${desert.county}, ${desert.state}`,
      country: 'USA',
      polygon: {
        type: 'Polygon',
        coordinates: [[
          [desert.coordinates[1] - 0.01, desert.coordinates[0] - 0.01],
          [desert.coordinates[1] + 0.01, desert.coordinates[0] - 0.01],
          [desert.coordinates[1] + 0.01, desert.coordinates[0] + 0.01],
          [desert.coordinates[1] - 0.01, desert.coordinates[0] + 0.01],
          [desert.coordinates[1] - 0.01, desert.coordinates[0] - 0.01]
        ]]
      },
      population: desert.population,
      severity: desert.severity,
      lowAccessNumbers: desert.lowAccessNumbers,
      lowIncomeTracts: desert.lowIncomeTracts,
      dataSource: 'US Census Bureau',
      lastUpdated: new Date(),
      createdAt: new Date(),
    }))

    return NextResponse.json({
      success: true,
      data: transformedDeserts,
      total: transformedDeserts.length,
      dataSource: 'Real data from US Census Bureau and USDA',
      apiStatus,
      lastFetched: new Date().toISOString(),
      credibilityScore: apiStatus.census ? 5 : 3, // 5 stars for government data
      limitations: [
        'Data is based on Census income and transportation metrics',
        'Exact food desert boundaries may vary from USDA classifications',
        'Population estimates are approximate',
        'Data freshness depends on Census Bureau update cycles'
      ]
    })
  } catch (error) {
    console.error('Error fetching real food desert data:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch real food desert data',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        suggestion: 'Try using mock data endpoint: /api/food-deserts'
      },
      { status: 500 }
    )
  }
}
