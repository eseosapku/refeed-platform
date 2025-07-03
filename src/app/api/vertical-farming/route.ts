import { NextRequest, NextResponse } from 'next/server'
import { verticalFarmingService } from '@/lib/verticalFarmingService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const type = searchParams.get('type')

    // Handle both 'action' and 'type' parameters for backward compatibility
    const requestType = action || type

    switch (requestType) {
      case 'recommendations':
        const recommendations = await verticalFarmingService.generateContainerRecommendations()
        return NextResponse.json({
          success: true,
          data: recommendations,
          message: `Generated ${recommendations.length} container recommendations for high-severity food deserts`
        })

      case 'existing':
        const existing = await verticalFarmingService.getExistingContainers()
        return NextResponse.json({
          success: true,
          data: existing,
          message: `Found ${existing.length} existing containers`
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use ?action=recommendations or ?action=existing'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Vertical farming API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process vertical farming request'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, container } = body

    switch (action) {
      case 'save-container':
        if (!container) {
          return NextResponse.json({
            success: false,
            error: 'Container data is required'
          }, { status: 400 })
        }

        const saved = await verticalFarmingService.saveContainer(container)
        return NextResponse.json({
          success: saved,
          message: saved ? 'Container saved successfully' : 'Failed to save container'
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Vertical farming POST API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process vertical farming request'
    }, { status: 500 })
  }
}
