import { NextRequest, NextResponse } from 'next/server'

// This would be a cron job endpoint that runs every few minutes
// In production, you'd use a service like Vercel Cron, GitHub Actions, or a dedicated cron service

interface MatchmakingResult {
  newMatches: number
  priceAlerts: number
  processedDonations: number
}

async function runMatchmakingEngine(): Promise<MatchmakingResult> {
  console.log('🔄 Running automated matchmaking engine...')
  
  const result: MatchmakingResult = {
    newMatches: 0,
    priceAlerts: 0,
    processedDonations: 0,
  }

  try {
    // 1. Check for new unmatched donations
    console.log('📦 Checking for unmatched donations...')
    // This would fetch from your database
    const unmatchedDonations = [
      // Mock data
      {
        id: '1',
        donorId: '1',
        foodType: 'Apples',
        quantity: 50,
        expiryDate: new Date('2025-07-02'),
        location: { lat: 40.8176, lng: -73.9282 }
      }
    ]

    // 2. Check for price spikes that might trigger priority matches
    console.log('📈 Checking for price spikes...')
    const priceSpikes = await checkPriceSpikes()
    result.priceAlerts = priceSpikes.length

    // 3. For each unmatched donation, find nearby food deserts
    for (const donation of unmatchedDonations) {
      console.log(`🎯 Finding matches for donation ${donation.id}...`)
      
      // Mock food deserts nearby
      const nearbyDeserts = [
        {
          id: '1',
          name: 'South Bronx',
          location: { lat: 40.8176, lng: -73.9482 },
          hasPriceSpike: priceSpikes.some(spike => spike.region.includes('Bronx'))
        }
      ]

      for (const desert of nearbyDeserts) {
        const distance = calculateDistance(
          donation.location.lat,
          donation.location.lng,
          desert.location.lat,
          desert.location.lng
        )

        // Only match if within reasonable distance (10km)
        if (distance <= 10) {
          const priority = determinePriority(donation, desert, distance)
          
          // Create match
          await createMatch({
            donationId: donation.id,
            foodDesertId: desert.id,
            distance,
            priority,
            reason: desert.hasPriceSpike ? 'price_spike' : 'proximity',
          })

          result.newMatches++
          console.log(`✅ Created match: ${donation.foodType} → ${desert.name} (${distance.toFixed(1)}km, ${priority} priority)`)
        }
      }
    }

    result.processedDonations = unmatchedDonations.length

    // 4. Send notifications for high-priority matches
    if (result.newMatches > 0) {
      console.log(`📧 Sending notifications for ${result.newMatches} new matches...`)
      await sendMatchNotifications()
    }

    console.log('✅ Matchmaking engine completed successfully')
    return result

  } catch (error) {
    console.error('❌ Error in matchmaking engine:', error)
    throw error
  }
}

async function checkPriceSpikes() {
  // Mock price spike detection
  return [
    {
      region: 'Bronx, NY',
      item: 'Apples',
      currentPrice: 3.50,
      previousPrice: 3.00,
      percentageIncrease: 16.7,
      triggeredAt: new Date()
    }
  ]
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}

function determinePriority(
  donation: any, 
  desert: any, 
  distance: number
): 'high' | 'medium' | 'low' {
  const daysUntilExpiry = Math.ceil(
    (new Date(donation.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  // High priority if:
  // - Food expires in 1 day or less
  // - Desert has price spike and distance < 5km
  // - Distance < 2km
  if (
    daysUntilExpiry <= 1 || 
    (desert.hasPriceSpike && distance < 5) ||
    distance < 2
  ) {
    return 'high'
  }

  // Medium priority if:
  // - Food expires in 3 days or less
  // - Distance < 7km
  if (daysUntilExpiry <= 3 || distance < 7) {
    return 'medium'
  }

  return 'low'
}

async function createMatch(matchData: any) {
  // In real implementation, this would save to database
  console.log('Creating match:', matchData)
  return Promise.resolve()
}

async function sendMatchNotifications() {
  // In real implementation, this would send emails/SMS/push notifications
  console.log('Sending match notifications...')
  return Promise.resolve()
}

export async function POST(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const result = await runMatchmakingEngine()

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Matchmaking engine executed successfully',
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Matchmaking engine failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

// Also allow GET for testing
export async function GET(request: NextRequest) {
  try {
    const result = await runMatchmakingEngine()

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Matchmaking engine test completed',
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Manual matchmaking test error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Matchmaking engine test failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
