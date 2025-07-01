import { NextRequest, NextResponse } from 'next/server'

// Mock food logs data
const mockFoodLogs = [
  {
    id: '1',
    donorId: '1',
    foodType: 'Apples',
    category: 'produce',
    condition: 'good',
    quantity: 50,
    unit: 'kg',
    expiryDate: new Date('2025-07-05'),
    description: 'Fresh apples, slight cosmetic imperfections',
    isMatched: false,
    createdAt: new Date('2025-06-29'),
    updatedAt: new Date('2025-06-29'),
  },
  {
    id: '2',
    donorId: '2',
    foodType: 'Bread',
    category: 'prepared',
    condition: 'near-expiry',
    quantity: 30,
    unit: 'loaves',
    expiryDate: new Date('2025-07-01'),
    description: 'Day-old bread, perfect for immediate distribution',
    isMatched: false,
    createdAt: new Date('2025-06-28'),
    updatedAt: new Date('2025-06-28'),
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const donorId = searchParams.get('donorId')
    const isMatched = searchParams.get('matched')
    const category = searchParams.get('category')

    let filteredLogs = mockFoodLogs

    if (donorId) {
      filteredLogs = filteredLogs.filter(log => log.donorId === donorId)
    }

    if (isMatched !== null) {
      const matchedFilter = isMatched === 'true'
      filteredLogs = filteredLogs.filter(log => log.isMatched === matchedFilter)
    }

    if (category) {
      filteredLogs = filteredLogs.filter(log => log.category === category)
    }

    return NextResponse.json({
      success: true,
      data: filteredLogs,
      total: filteredLogs.length,
    })
  } catch (error) {
    console.error('Error fetching food logs:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch food logs',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      donorId, 
      foodType, 
      category, 
      condition, 
      quantity, 
      unit, 
      expiryDate, 
      description 
    } = body

    // Validate required fields
    if (!donorId || !foodType || !category || !condition || !quantity || !unit || !expiryDate) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      )
    }

    const newFoodLog = {
      id: (mockFoodLogs.length + 1).toString(),
      donorId,
      foodType,
      category,
      condition,
      quantity: Number(quantity),
      unit,
      expiryDate: new Date(expiryDate),
      description,
      isMatched: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockFoodLogs.push(newFoodLog)

    return NextResponse.json({
      success: true,
      data: newFoodLog,
      message: 'Food donation logged successfully',
    })
  } catch (error) {
    console.error('Error logging food donation:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to log food donation',
      },
      { status: 500 }
    )
  }
}
