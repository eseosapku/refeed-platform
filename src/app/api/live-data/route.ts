import { NextRequest, NextResponse } from 'next/server'

// Simulated live agricultural data
const liveAgricultureData = {
  rwanda: {
    lastUpdated: new Date().toISOString(),
    regions: [
      {
        id: 'northern-province',
        name: 'Northern Province - Potato Belt',
        currentHarvest: {
          potatoes: {
            quantity: 12500, // tons
            quality: 'Grade A',
            harvestDate: '2024-06-15',
            exportReady: 8500,
            pricePerTon: 450, // USD
          },
          vegetables: {
            quantity: 3200,
            quality: 'Premium',
            harvestDate: '2024-06-20',
            exportReady: 2100,
            pricePerTon: 680,
          }
        },
        nextHarvest: '2024-09-15',
        weatherConditions: 'Favorable',
        soilHealth: 'Excellent',
      },
      {
        id: 'eastern-province',
        name: 'Eastern Province - Rice Fields',
        currentHarvest: {
          rice: {
            quantity: 18200,
            quality: 'Premium',
            harvestDate: '2024-06-10',
            exportReady: 15000,
            pricePerTon: 520,
          }
        },
        nextHarvest: '2024-10-01',
        weatherConditions: 'Good',
        soilHealth: 'Good',
      },
      {
        id: 'southern-province',
        name: 'Southern Province - Coffee & Maize',
        currentHarvest: {
          coffee: {
            quantity: 2400,
            quality: 'Specialty Grade',
            harvestDate: '2024-05-25',
            exportReady: 2200,
            pricePerTon: 3200,
          },
          maize: {
            quantity: 9800,
            quality: 'Grade A',
            harvestDate: '2024-06-05',
            exportReady: 7500,
            pricePerTon: 380,
          }
        },
        nextHarvest: '2024-11-15',
        weatherConditions: 'Excellent',
        soilHealth: 'Excellent',
      }
    ],
    totalExportCapacity: {
      monthly: 15000, // tons per month
      currentAvailable: 33300, // tons ready for export
    },
    logisticsStatus: {
      ports: 'Operational',
      transportation: 'Good',
      processing_facilities: 'Fully Operational',
    }
  },
  usa: {
    lastUpdated: new Date().toISOString(),
    foodDeserts: {
      totalIdentified: 45, // Increased from 8
      populationAffected: 1250000, // Increased from 355000
      urgentNeed: [
        {
          region: 'South Bronx, NY',
          population: 45000,
          priority: 'High',
          neededItems: ['fresh_vegetables', 'fruits', 'dairy'],
          monthlyneed: 450, // tons
        },
        {
          region: 'East Cleveland, OH',
          population: 17000,
          priority: 'High',
          neededItems: ['grains', 'vegetables', 'protein'],
          monthlyneed: 170,
        },
        {
          region: 'West Oakland, CA',
          population: 32000,
          priority: 'High',
          neededItems: ['fresh_produce', 'grains'],
          monthlyneed: 320,
        },
        {
          region: 'South Side Chicago, IL',
          population: 78000,
          priority: 'High',
          neededItems: ['fresh_produce', 'meat', 'dairy'],
          monthlyneed: 780,
        },
        {
          region: 'West Detroit, MI',
          population: 52000,
          priority: 'High',
          neededItems: ['vegetables', 'grains', 'protein'],
          monthlyneed: 520,
        },
        {
          region: 'South Central LA, CA',
          population: 85000,
          priority: 'High',
          neededItems: ['fresh_produce', 'dairy'],
          monthlyneed: 850,
        },
        {
          region: 'Liberty City Miami, FL',
          population: 67000,
          priority: 'High',
          neededItems: ['fresh_produce', 'grains'],
          monthlyneed: 670,
        }
      ],
      retailSupport: {
        totalStores: 67, // Major retailers participating
        monthlyCapacity: 15000, // tons per month from retail donations
        coverage: 'National'
      }
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country')
    const dataType = searchParams.get('type') // 'harvest', 'logistics', 'needs'

    if (country === 'rwanda') {
      if (dataType === 'harvest') {
        return NextResponse.json({
          success: true,
          data: liveAgricultureData.rwanda.regions.map(region => ({
            id: region.id,
            name: region.name,
            currentHarvest: region.currentHarvest,
            nextHarvest: region.nextHarvest,
            weatherConditions: region.weatherConditions,
          })),
          lastUpdated: liveAgricultureData.rwanda.lastUpdated,
        })
      }
      
      if (dataType === 'logistics') {
        return NextResponse.json({
          success: true,
          data: {
            exportCapacity: liveAgricultureData.rwanda.totalExportCapacity,
            logisticsStatus: liveAgricultureData.rwanda.logisticsStatus,
          },
          lastUpdated: liveAgricultureData.rwanda.lastUpdated,
        })
      }

      return NextResponse.json({
        success: true,
        data: liveAgricultureData.rwanda,
        lastUpdated: liveAgricultureData.rwanda.lastUpdated,
      })
    }

    if (country === 'usa') {
      return NextResponse.json({
        success: true,
        data: liveAgricultureData.usa,
        lastUpdated: liveAgricultureData.usa.lastUpdated,
      })
    }

    // Return all data
    return NextResponse.json({
      success: true,
      data: liveAgricultureData,
      lastUpdated: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Error fetching live data:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch live data',
      },
      { status: 500 }
    )
  }
}

// Update live data (simulate real-time updates)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { country, region, data } = body

    if (country === 'rwanda' && region && data) {
      const regionIndex = liveAgricultureData.rwanda.regions.findIndex(r => r.id === region)
      if (regionIndex !== -1) {
        liveAgricultureData.rwanda.regions[regionIndex] = {
          ...liveAgricultureData.rwanda.regions[regionIndex],
          ...data,
        }
        liveAgricultureData.rwanda.lastUpdated = new Date().toISOString()
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Live data updated successfully',
      lastUpdated: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Error updating live data:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update live data',
      },
      { status: 500 }
    )
  }
}
