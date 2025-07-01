import { NextRequest, NextResponse } from 'next/server'

// Mock matches data
const mockMatches = [
  {
    id: '1',
    donorId: '1',
    foodLogId: '1',
    foodDesertId: '1',
    distance: 2.5,
    priority: 'high',
    status: 'pending',
    matchedAt: new Date('2025-06-29T10:00:00'),
    estimatedDelivery: new Date('2025-06-30T14:00:00'),
  },
  {
    id: '2',
    donorId: '2',
    foodLogId: '2',
    foodDesertId: '2',
    distance: 5.2,
    priority: 'medium',
    status: 'accepted',
    matchedAt: new Date('2025-06-28T15:30:00'),
    estimatedDelivery: new Date('2025-06-30T10:00:00'),
  },
]

// Simple matchmaking algorithm
function findMatches(foodLogs: any[], foodDeserts: any[], donors: any[]) {
  const matches = []

  for (const foodLog of foodLogs) {
    if (foodLog.isMatched) continue

    const donor = donors.find(d => d.id === foodLog.donorId)
    if (!donor) continue

    // Find nearby food deserts (simplified distance calculation)
    for (const desert of foodDeserts) {
      const distance = calculateDistance(
        donor.location.lat,
        donor.location.lng,
        desert.polygon.coordinates[0][0][1], // Using first coordinate of polygon
        desert.polygon.coordinates[0][0][0]
      )

      if (distance <= 10) { // Within 10km
        const priority = getPriority(foodLog, distance)
        
        matches.push({
          id: `match_${foodLog.id}_${desert.id}`,
          donorId: donor.id,
          foodLogId: foodLog.id,
          foodDesertId: desert.id,
          distance: Math.round(distance * 100) / 100,
          priority,
          status: 'potential',
          matchScore: calculateMatchScore(foodLog, desert, distance),
          foodType: foodLog.foodType,
          quantity: foodLog.quantity,
          expiryDate: foodLog.expiryDate,
          donorName: donor.name,
          desertName: desert.name,
        })
      }
    }
  }

  // Sort by match score (higher is better)
  return matches.sort((a, b) => b.matchScore - a.matchScore)
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in kilometers
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

function getPriority(foodLog: any, distance: number): 'high' | 'medium' | 'low' {
  const daysUntilExpiry = Math.ceil(
    (new Date(foodLog.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  if (daysUntilExpiry <= 1 || distance <= 2) return 'high'
  if (daysUntilExpiry <= 3 || distance <= 5) return 'medium'
  return 'low'
}

function calculateMatchScore(foodLog: any, desert: any, distance: number): number {
  let score = 100

  // Distance factor (closer is better)
  score -= distance * 5

  // Urgency factor (expiring soon gets higher score)
  const daysUntilExpiry = Math.ceil(
    (new Date(foodLog.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )
  if (daysUntilExpiry <= 1) score += 50
  else if (daysUntilExpiry <= 3) score += 30
  else if (daysUntilExpiry <= 7) score += 10

  // Quantity factor (larger quantities get slight bonus)
  if (foodLog.quantity > 100) score += 10
  else if (foodLog.quantity > 50) score += 5

  return Math.max(0, score)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const donorId = searchParams.get('donorId')

    let filteredMatches = mockMatches

    if (status) {
      filteredMatches = filteredMatches.filter(match => match.status === status)
    }

    if (priority) {
      filteredMatches = filteredMatches.filter(match => match.priority === priority)
    }

    if (donorId) {
      filteredMatches = filteredMatches.filter(match => match.donorId === donorId)
    }

    return NextResponse.json({
      success: true,
      data: filteredMatches,
      total: filteredMatches.length,
    })
  } catch (error) {
    console.error('Error fetching matches:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch matches',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, matchId, ...data } = body

    if (action === 'find') {
      // Run matchmaking algorithm
      // In a real app, you would fetch actual data from database
      const mockFoodLogs = [
        {
          id: '1',
          donorId: '1',
          foodType: 'Apples',
          quantity: 50,
          expiryDate: new Date('2025-07-02'),
          isMatched: false,
        },
      ]

      const mockFoodDeserts = [
        {
          id: '1',
          name: 'South Bronx',
          polygon: {
            coordinates: [[[-73.9482, 40.8176]]]
          },
        },
      ]

      const mockDonors = [
        {
          id: '1',
          name: 'Fresh Market Co.',
          location: { lat: 40.8176, lng: -73.9282 },
        },
      ]

      const potentialMatches = findMatches(mockFoodLogs, mockFoodDeserts, mockDonors)

      return NextResponse.json({
        success: true,
        data: potentialMatches,
        message: `Found ${potentialMatches.length} potential matches`,
      })
    }

    if (action === 'create') {
      const { donorId, foodLogId, foodDesertId, priority = 'medium' } = data

      if (!donorId || !foodLogId || !foodDesertId) {
        return NextResponse.json(
          {
            success: false,
            error: 'Missing required fields for match creation',
          },
          { status: 400 }
        )
      }

      const newMatch = {
        id: (mockMatches.length + 1).toString(),
        donorId,
        foodLogId,
        foodDesertId,
        distance: Math.random() * 10, // Mock distance
        priority,
        status: 'pending',
        matchedAt: new Date(),
        estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      }

      mockMatches.push(newMatch)

      return NextResponse.json({
        success: true,
        data: newMatch,
        message: 'Match created successfully',
      })
    }

    if (action === 'update' && matchId) {
      const matchIndex = mockMatches.findIndex(m => m.id === matchId)
      if (matchIndex === -1) {
        return NextResponse.json(
          {
            success: false,
            error: 'Match not found',
          },
          { status: 404 }
        )
      }

      mockMatches[matchIndex] = { ...mockMatches[matchIndex], ...data }

      return NextResponse.json({
        success: true,
        data: mockMatches[matchIndex],
        message: 'Match updated successfully',
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid action',
      },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error processing match request:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process match request',
      },
      { status: 500 }
    )
  }
}
