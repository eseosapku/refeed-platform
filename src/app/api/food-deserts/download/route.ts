import { NextRequest, NextResponse } from 'next/server'
import { kaggleDataService } from '@/lib/kaggleDataService'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const useKaggle = searchParams.get('kaggle') === 'true'
    
    if (useKaggle) {
      // Check if processed Kaggle data exists
      const processedDataPath = path.resolve('./data/kaggle/processed-food-deserts.json')
      
      if (fs.existsSync(processedDataPath)) {
        // Load processed data and convert to CSV
        const data = JSON.parse(fs.readFileSync(processedDataPath, 'utf8'))
        const csvContent = convertToCSV(data)
        
        return new NextResponse(csvContent, {
          status: 200,
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="food-deserts-kaggle-data.csv"'
          }
        })
      } else {
        // Process fresh data and convert to CSV
        const data = await kaggleDataService.processFoodDesertData()
        const csvContent = convertToCSV(data)
        
        return new NextResponse(csvContent, {
          status: 200,
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="food-deserts-kaggle-data.csv"'
          }
        })
      }
    } else {
      // Return mock data as CSV
      const mockData = generateMockFoodDeserts()
      const csvContent = convertToCSV(mockData)
      
      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="food-deserts-mock-data.csv"'
        }
      })
    }
  } catch (error) {
    console.error('Error generating CSV download:', error)
    return NextResponse.json(
      { error: 'Failed to generate CSV download' },
      { status: 500 }
    )
  }
}

function convertToCSV(data: any[]): string {
  if (!data || data.length === 0) {
    return 'No data available'
  }

  // Define CSV headers
  const headers = [
    'ID',
    'Name',
    'Census Tract',
    'Type',
    'Country',
    'State',
    'County',
    'Population',
    'Low Access Numbers',
    'Severity',
    'Latitude',
    'Longitude',
    'Low Income Population',
    'Senior Population',
    'Children Population',
    'Households Without Vehicles',
    'Access Half Mile',
    'Access One Mile',
    'Access Ten Miles',
    'Access Twenty Miles'
  ]

  // Convert data to CSV rows
  const csvRows = data.map(item => [
    item.id || '',
    item.name || '',
    item.censusTract || '',
    item.type || '',
    item.country || '',
    item.state || '',
    item.county || '',
    item.population || 0,
    item.lowAccessNumbers || 0,
    item.severity || '',
    item.coordinates?.[0] || 0,
    item.coordinates?.[1] || 0,
    item.demographics?.lowIncome || 0,
    item.demographics?.seniors || 0,
    item.demographics?.children || 0,
    item.demographics?.vehicles || 0,
    item.access?.oneHalf || 0,
    item.access?.one || 0,
    item.access?.ten || 0,
    item.access?.twenty || 0
  ])

  // Combine headers and rows
  const allRows = [headers, ...csvRows]
  
  // Convert to CSV string
  return allRows.map(row => 
    row.map(field => {
      // Escape fields that contain commas, quotes, or newlines
      if (typeof field === 'string' && (field.includes(',') || field.includes('"') || field.includes('\n'))) {
        return `"${field.replace(/"/g, '""')}"`
      }
      return field
    }).join(',')
  ).join('\n')
}

function generateMockFoodDeserts() {
  return [
    {
      id: 'mock_1',
      name: 'Downtown Food Desert',
      type: 'food_desert',
      country: 'USA',
      state: 'California',
      county: 'Los Angeles',
      population: 15000,
      lowAccessNumbers: 8500,
      severity: 'high',
      coordinates: [34.0522, -118.2437],
      demographics: {
        lowIncome: 12000,
        seniors: 2500,
        children: 3500,
        vehicles: 4000
      },
      access: {
        oneHalf: 5000,
        one: 7500,
        ten: 14000,
        twenty: 15000
      }
    },
    {
      id: 'mock_2',
      name: 'Rural Food Desert',
      type: 'food_desert',
      country: 'USA',
      state: 'Texas',
      county: 'Harris',
      population: 5000,
      lowAccessNumbers: 3200,
      severity: 'medium',
      coordinates: [29.7604, -95.3698],
      demographics: {
        lowIncome: 3800,
        seniors: 800,
        children: 1200,
        vehicles: 1500
      },
      access: {
        oneHalf: 2000,
        one: 2800,
        ten: 4500,
        twenty: 5000
      }
    }
  ]
}
