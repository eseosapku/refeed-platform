import { NextRequest, NextResponse } from 'next/server'
import { kaggleDataService } from '@/lib/kaggleDataService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'status'

    switch (action) {
      case 'status':
        // Get download status for all datasets
        const status = kaggleDataService.getDownloadStatus()
        const kaggleSetup = await kaggleDataService.checkKaggleSetup()
        
        return NextResponse.json({
          success: true,
          kaggleSetup,
          datasets: status,
          message: 'Kaggle integration status retrieved'
        })

      case 'setup-check':
        // Check if Kaggle CLI is set up
        const setupStatus = await kaggleDataService.checkKaggleSetup()
        return NextResponse.json({
          success: true,
          setup: setupStatus
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
          availableActions: ['status', 'setup-check']
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Kaggle API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, dataset } = await request.json()

    switch (action) {
      case 'download':
        if (!dataset) {
          return NextResponse.json({
            success: false,
            error: 'Dataset ID required'
          }, { status: 400 })
        }

        const downloadResult = await kaggleDataService.downloadDataset(dataset)
        return NextResponse.json(downloadResult)

      case 'download-all-high-priority':
        const downloadAllResult = await kaggleDataService.downloadAllHighPriority()
        return NextResponse.json(downloadAllResult)

      case 'process-food-deserts':
        try {
          const foodDeserts = await kaggleDataService.processFoodDesertData()
          return NextResponse.json({
            success: true,
            data: foodDeserts.slice(0, 100), // Return first 100 for preview
            total: foodDeserts.length,
            message: `Processed ${foodDeserts.length} food desert locations`
          })
        } catch (error) {
          return NextResponse.json({
            success: false,
            error: 'Failed to process food desert data',
            message: error instanceof Error ? error.message : 'Processing failed'
          }, { status: 500 })
        }

      case 'process-us-prices':
        try {
          const priceData = await kaggleDataService.processUSPriceData()
          return NextResponse.json({
            success: true,
            data: {
              fruits: priceData.fruits.slice(0, 50),
              vegetables: priceData.vegetables.slice(0, 50)
            },
            total: {
              fruits: priceData.fruits.length,
              vegetables: priceData.vegetables.length
            },
            message: `Processed ${priceData.fruits.length} fruits and ${priceData.vegetables.length} vegetables`
          })
        } catch (error) {
          return NextResponse.json({
            success: false,
            error: 'Failed to process US price data',
            message: error instanceof Error ? error.message : 'Processing failed'
          }, { status: 500 })
        }

      case 'process-global-prices':
        try {
          const globalPrices = await kaggleDataService.processGlobalPriceData()
          return NextResponse.json({
            success: true,
            data: globalPrices.slice(0, 100), // Return first 100 for preview
            total: globalPrices.length,
            message: `Processed ${globalPrices.length} global price records`
          })
        } catch (error) {
          return NextResponse.json({
            success: false,
            error: 'Failed to process global price data',
            message: error instanceof Error ? error.message : 'Processing failed'
          }, { status: 500 })
        }

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
          availableActions: [
            'download',
            'download-all-high-priority',
            'process-food-deserts',
            'process-us-prices',
            'process-global-prices'
          ]
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Kaggle API POST error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
