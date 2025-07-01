'use client'

import { useEffect, useState } from 'react'
import { Truck, Wheat, TrendingUp, Globe, Clock } from 'lucide-react'

interface LiveDataProps {
  selectedCountry: 'USA' | 'Rwanda' | 'all'
}

interface AgricultureData {
  rwanda?: {
    lastUpdated: string
    regions: Array<{
      id: string
      name: string
      currentHarvest: any
      nextHarvest: string
      weatherConditions: string
    }>
    totalExportCapacity: {
      monthly: number
      currentAvailable: number
    }
  }
  usa?: {
    lastUpdated: string
    foodDeserts: {
      totalIdentified: number
      populationAffected: number
      urgentNeed: Array<{
        region: string
        population: number
        priority: string
        neededItems: string[]
        monthlyneed: number
      }>
    }
  }
}

export default function LiveDataDashboard({ selectedCountry }: LiveDataProps) {
  const [liveData, setLiveData] = useState<AgricultureData>({})
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/live-data')
        const result = await response.json()
        
        if (result.success) {
          setLiveData(result.data)
          setLastUpdate(new Date())
        }
      } catch (error) {
        console.error('Error fetching live data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLiveData()
    
    // Update every 30 seconds to simulate live data
    const interval = setInterval(fetchLiveData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    )
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
          Live Agricultural Data
        </h3>
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="w-3 h-3 mr-1" />
          {formatTime(lastUpdate)}
        </div>
      </div>

      {/* Rwanda Data */}
      {(selectedCountry === 'all' || selectedCountry === 'Rwanda') && liveData.rwanda && (
        <div className="mb-6 border-b pb-4">
          <div className="flex items-center mb-3">
            <Globe className="w-4 h-4 mr-2 text-green-600" />
            <h4 className="font-semibold text-green-800">Rwanda Export Status</h4>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Available for Export</span>
                <span className="font-bold text-green-700">
                  {liveData.rwanda.totalExportCapacity.currentAvailable.toLocaleString()} tons
                </span>
              </div>
              <div className="text-xs text-gray-600">
                Monthly capacity: {liveData.rwanda.totalExportCapacity.monthly.toLocaleString()} tons
              </div>
            </div>
            
            <div className="space-y-1">
              {liveData.rwanda.regions.slice(0, 2).map((region) => (
                <div key={region.id} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{region.name.split(' - ')[1]}</span>
                  <div className="flex items-center">
                    <Wheat className="w-3 h-3 mr-1 text-amber-500" />
                    <span className="font-medium">{region.weatherConditions}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* USA Data */}
      {(selectedCountry === 'all' || selectedCountry === 'USA') && liveData.usa && (
        <div className="mb-4">
          <div className="flex items-center mb-3">
            <Truck className="w-4 h-4 mr-2 text-blue-600" />
            <h4 className="font-semibold text-blue-800">USA Food Desert Status</h4>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Population Affected</span>
                <span className="font-bold text-red-700">
                  {liveData.usa.foodDeserts.populationAffected.toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-gray-600">
                Across {liveData.usa.foodDeserts.totalIdentified} identified food deserts
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs font-medium text-gray-700 mb-1">Urgent Needs:</div>
              {liveData.usa.foodDeserts.urgentNeed.slice(0, 2).map((need, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{need.region.split(',')[0]}</span>
                  <span className="font-medium text-red-600">
                    {need.monthlyneed} tons/month
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Match Potential */}
      {selectedCountry === 'all' && liveData.rwanda && liveData.usa && (
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="font-medium text-blue-800">Export Match Potential</span>
          </div>
          <div className="text-xs text-blue-700">
            Rwanda can supply{' '}
            <span className="font-bold">
              {Math.min(
                liveData.rwanda.totalExportCapacity.currentAvailable,
                liveData.usa.foodDeserts.urgentNeed.reduce((total, need) => total + need.monthlyneed, 0) * 3
              ).toLocaleString()}
            </span>{' '}
            tons to meet urgent US food desert needs
          </div>
          <div className="mt-2 flex items-center text-xs">
            <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
            <span className="text-green-700">Live matching in progress</span>
          </div>
        </div>
      )}
    </div>
  )
}
