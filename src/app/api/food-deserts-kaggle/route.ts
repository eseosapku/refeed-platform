import { NextRequest, NextResponse } from 'next/server'
import { kaggleDataService } from '@/lib/kaggleDataService'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const useKaggle = searchParams.get('kaggle') === 'true'
    
    if (!useKaggle) {
      return NextResponse.json({
        success: false,
        error: 'Kaggle data not requested. Use ?kaggle=true to get Kaggle data.',
        message: 'This endpoint serves processed Kaggle food desert data.'
      })
    }

    // Check if processed Kaggle data file exists
    const processedDataPath = path.resolve('./data/kaggle/processed-food-deserts.json')
    
    if (fs.existsSync(processedDataPath)) {
      console.log('Loading pre-processed Kaggle data...')
      const processedData = JSON.parse(fs.readFileSync(processedDataPath, 'utf8'))
      
      return NextResponse.json({
        success: true,
        data: processedData,
        total: processedData.length,
        dataSource: 'USDA Food Access Research Atlas (Kaggle Dataset)',
        lastFetched: new Date().toISOString(),
        credibilityScore: 5,
        limitations: [
          'Official USDA Food Access Research Atlas data',
          'Census tract level granularity',
          'Updated annually by USDA',
          `Covers ${processedData.length} food desert locations across all US states`
        ]
      })
    }

    // Process fresh data
    console.log('Processing fresh Kaggle data...')
    const kaggleData = await kaggleDataService.processFoodDesertData()
    
    if (kaggleData.length > 0) {
      // Save processed data for faster future access
      fs.writeFileSync(processedDataPath, JSON.stringify(kaggleData, null, 2))
      console.log(`Saved ${kaggleData.length} processed food desert locations`)
    }

    return NextResponse.json({
      success: true,
      data: kaggleData,
      total: kaggleData.length,
      dataSource: 'USDA Food Access Research Atlas (Kaggle Dataset)',
      lastFetched: new Date().toISOString(),
      credibilityScore: 5,
      limitations: [
        'Official USDA Food Access Research Atlas data',
        'Census tract level granularity', 
        'Updated annually by USDA',
        `Covers ${kaggleData.length} food desert locations across all US states`
      ]
    })

  } catch (error) {
    console.error('Kaggle food deserts API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process Kaggle data',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}
