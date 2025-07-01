import { NextRequest, NextResponse } from 'next/server'

// Mock price data
const mockPrices = [
  {
    id: '1',
    region: 'Bronx, NY',
    country: 'USA',
    item: 'Apples',
    price: 3.50,
    currency: 'USD',
    unit: 'per lb',
    source: 'manual',
    priceDate: new Date('2025-06-29'),
    recordedAt: new Date('2025-06-29'),
  },
  {
    id: '2',
    region: 'Kigali',
    country: 'Rwanda',
    item: 'Maize',
    price: 850,
    currency: 'RWF',
    unit: 'per kg',
    source: 'api',
    priceDate: new Date('2025-06-29'),
    recordedAt: new Date('2025-06-29'),
  },
  {
    id: '3',
    region: 'Cleveland, OH',
    country: 'USA',
    item: 'Milk',
    price: 4.25,
    currency: 'USD',
    unit: 'per gallon',
    source: 'scraped',
    priceDate: new Date('2025-06-29'),
    recordedAt: new Date('2025-06-29'),
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const region = searchParams.get('region')
    const item = searchParams.get('item')
    const country = searchParams.get('country')

    let filteredPrices = mockPrices

    if (region) {
      filteredPrices = filteredPrices.filter(price => 
        price.region.toLowerCase().includes(region.toLowerCase())
      )
    }

    if (item) {
      filteredPrices = filteredPrices.filter(price => 
        price.item.toLowerCase().includes(item.toLowerCase())
      )
    }

    if (country) {
      filteredPrices = filteredPrices.filter(price => price.country === country)
    }

    return NextResponse.json({
      success: true,
      data: filteredPrices,
      total: filteredPrices.length,
    })
  } catch (error) {
    console.error('Error fetching prices:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch prices',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { region, country, item, price, currency, unit, priceDate, sourceDetails } = body

    // Validate required fields
    if (!region || !country || !item || !price || !currency || !unit || !priceDate) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      )
    }

    const newPrice = {
      id: (mockPrices.length + 1).toString(),
      region,
      country,
      item,
      price: Number(price),
      currency,
      unit,
      source: 'manual',
      sourceDetails,
      priceDate: new Date(priceDate),
      recordedAt: new Date(),
    }

    mockPrices.push(newPrice)

    // Check for price spikes (simplified logic)
    const recentPrices = mockPrices
      .filter(p => p.region === region && p.item === item)
      .sort((a, b) => new Date(b.priceDate).getTime() - new Date(a.priceDate).getTime())

    if (recentPrices.length > 1) {
      const currentPrice = recentPrices[0].price
      const previousPrice = recentPrices[1].price
      const percentageIncrease = ((currentPrice - previousPrice) / previousPrice) * 100

      if (percentageIncrease > 20) {
        // In a real app, you would trigger alerts/notifications here
        console.log(`Price spike detected for ${item} in ${region}: ${percentageIncrease.toFixed(1)}% increase`)
      }
    }

    return NextResponse.json({
      success: true,
      data: newPrice,
      message: 'Price data recorded successfully',
    })
  } catch (error) {
    console.error('Error recording price:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to record price',
      },
      { status: 500 }
    )
  }
}
