'use client'

import { useState, useEffect } from 'react'
import { 
  Leaf, 
  MapPin, 
  TrendingUp, 
  Package, 
  Zap,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react'
import { verticalFarmingService } from '@/lib/verticalFarmingService'

interface FarmingContainer {
  id: string
  name: string
  type: 'vertical_farm' | 'hydroponic' | 'aeroponic'
  coordinates: [number, number]
  foodDesertId: string
  status: 'planned' | 'active' | 'maintenance'
  capacity: {
    monthly_yield_kg: number
    crop_types: number
    growing_cycles_per_year: number
  }
  recommendations: CropRecommendation[]
  impact: {
    current_severity: 'high' | 'medium' | 'low'
    projected_severity: 'high' | 'medium' | 'low'
    population_served: number
    reduction_percentage: number
  }
  installation: {
    cost_estimate: number
    installation_time_weeks: number
    maintenance_cost_annual: number
  }
}

interface CropRecommendation {
  crop: string
  suitability_score: number
  yield_per_cycle_kg: number
  growth_time_days: number
  nutritional_value: 'high' | 'medium' | 'low'
  local_demand: 'high' | 'medium' | 'low'
  reason: string
}

const VerticalFarmingPanel = () => {
  const [containers, setContainers] = useState<FarmingContainer[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedContainer, setSelectedContainer] = useState<FarmingContainer | null>(null)
  const [showRecommendations, setShowRecommendations] = useState(false)

  // Generate AI-powered container recommendations
  const generateRecommendations = async () => {
    try {
      setIsLoading(true)
      const recommendations = await verticalFarmingService.generateContainerRecommendations()
      
      setContainers(recommendations)
      setShowRecommendations(true)
      alert(`Generated ${recommendations.length} vertical farming container recommendations!`)
    } catch (error) {
      console.error('Error generating recommendations:', error)
      alert('Error generating container recommendations')
    } finally {
      setIsLoading(false)
    }
  }

  // Load existing containers
  const loadExistingContainers = async () => {
    try {
      setIsLoading(true)
      const existingContainers = await verticalFarmingService.getExistingContainers()
      
      setContainers(existingContainers)
      setShowRecommendations(false)
    } catch (error) {
      console.error('Error loading existing containers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Save container configuration
  const saveContainer = async (container: FarmingContainer) => {
    try {
      const success = await verticalFarmingService.saveContainer({ ...container, status: 'planned' })
      
      if (success) {
        alert('Container configuration saved successfully!')
      } else {
        alert('Failed to save container')
      }
    } catch (error) {
      console.error('Error saving container:', error)
      alert('Error saving container')
    }
  }

  const getContainerIcon = (type: string) => {
    switch (type) {
      case 'vertical_farm':
        return <Package className="h-5 w-5" />
      case 'hydroponic':
        return <Zap className="h-5 w-5" />
      case 'aeroponic':
        return <Leaf className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600 bg-red-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'low':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getNutritionalValueColor = (value: string) => {
    switch (value) {
      case 'high':
        return 'text-green-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  useEffect(() => {
    loadExistingContainers()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Leaf className="h-6 w-6 mr-2 text-green-600" />
            Vertical Farming Containers
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            AI-powered container placement for high-severity food deserts
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={loadExistingContainers}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          
          <button
            onClick={generateRecommendations}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 transition-colors"
          >
            <Leaf className="h-4 w-4 mr-2" />
            {isLoading ? 'Generating...' : 'Generate AI Recommendations'}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing food deserts and generating container recommendations...</p>
        </div>
      )}

      {/* Recommendations Banner */}
      {showRecommendations && containers.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <div>
              <h4 className="font-medium text-green-900">
                AI Recommendations Generated
              </h4>
              <p className="text-sm text-green-700">
                Found {containers.length} optimal locations for vertical farming containers in high-severity food deserts.
                Each container is designed to reduce food desert intensity through local fresh produce production.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Container Grid */}
      {containers.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {containers.map((container) => (
            <div key={container.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              {/* Container Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    {getContainerIcon(container.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{container.name}</h4>
                    <p className="text-sm text-gray-600 capitalize">{container.type.replace('_', ' ')}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(container.impact.current_severity)}`}>
                    {container.impact.current_severity.toUpperCase()}
                  </span>
                  <span className="text-gray-400">→</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(container.impact.projected_severity)}`}>
                    {container.impact.projected_severity.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Impact Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {container.impact.reduction_percentage}%
                  </div>
                  <div className="text-xs text-gray-600">Reduction</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {container.impact.population_served.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">People Served</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {container.capacity.monthly_yield_kg}kg
                  </div>
                  <div className="text-xs text-gray-600">Monthly Yield</div>
                </div>
              </div>

              {/* Top Crop Recommendations */}
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-900 mb-2">Top AI Crop Recommendations</h5>
                <div className="space-y-2">
                  {container.recommendations.slice(0, 2).map((crop, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded p-2">
                      <div>
                        <div className="font-medium text-sm">{crop.crop}</div>
                        <div className="text-xs text-gray-600">{crop.reason}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${getNutritionalValueColor(crop.nutritional_value)}`}>
                          {crop.suitability_score}%
                        </div>
                        <div className="text-xs text-gray-600">{crop.yield_per_cycle_kg}kg/cycle</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Installation Info */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-gray-600">Installation Cost:</span>
                  <div className="font-medium">${container.installation.cost_estimate.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-600">Installation Time:</span>
                  <div className="font-medium">{container.installation.installation_time_weeks} weeks</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedContainer(container)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  View Details
                </button>
                
                {showRecommendations && (
                  <button
                    onClick={() => saveContainer(container)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve Plan
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : !isLoading && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Containers Yet</h3>
          <p className="text-gray-600 mb-4">
            Generate AI-powered recommendations to place vertical farming containers in high-severity food deserts.
          </p>
          <button
            onClick={generateRecommendations}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Leaf className="h-4 w-4 mr-2" />
            Generate Recommendations
          </button>
        </div>
      )}

      {/* Detailed Container Modal */}
      {selectedContainer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">{selectedContainer.name}</h3>
                <button
                  onClick={() => setSelectedContainer(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  ✕
                </button>
              </div>

              {/* Detailed Container Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Basic Info */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Container Specifications</h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium capitalize">{selectedContainer.type.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Yield:</span>
                        <span className="font-medium">{selectedContainer.capacity.monthly_yield_kg}kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Crop Types:</span>
                        <span className="font-medium">{selectedContainer.capacity.crop_types} varieties</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Growing Cycles/Year:</span>
                        <span className="font-medium">{selectedContainer.capacity.growing_cycles_per_year}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Food Desert Impact</h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Current Severity:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(selectedContainer.impact.current_severity)}`}>
                          {selectedContainer.impact.current_severity.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Projected Severity:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(selectedContainer.impact.projected_severity)}`}>
                          {selectedContainer.impact.projected_severity.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reduction:</span>
                        <span className="font-medium text-green-600">{selectedContainer.impact.reduction_percentage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Population Served:</span>
                        <span className="font-medium">{selectedContainer.impact.population_served.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Crop Recommendations */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">AI Crop Recommendations</h4>
                  <div className="space-y-3">
                    {selectedContainer.recommendations.map((crop, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium text-gray-900">{crop.crop}</div>
                          <div className="text-right">
                            <div className={`text-lg font-bold ${getNutritionalValueColor(crop.nutritional_value)}`}>
                              {crop.suitability_score}%
                            </div>
                            <div className="text-xs text-gray-600">Suitability</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                          <div>
                            <span className="text-gray-600">Yield:</span>
                            <div className="font-medium">{crop.yield_per_cycle_kg}kg</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Growth Time:</span>
                            <div className="font-medium">{crop.growth_time_days} days</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Nutrition:</span>
                            <div className={`font-medium ${getNutritionalValueColor(crop.nutritional_value)}`}>
                              {crop.nutritional_value}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600 italic">
                          {crop.reason}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Installation Details */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-2">Installation & Costs</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <DollarSign className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-blue-600">
                      ${selectedContainer.installation.cost_estimate.toLocaleString()}
                    </div>
                    <div className="text-sm text-blue-600">Installation Cost</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <Clock className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-purple-600">
                      {selectedContainer.installation.installation_time_weeks} weeks
                    </div>
                    <div className="text-sm text-purple-600">Installation Time</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <TrendingUp className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-orange-600">
                      ${selectedContainer.installation.maintenance_cost_annual.toLocaleString()}
                    </div>
                    <div className="text-sm text-orange-600">Annual Maintenance</div>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setSelectedContainer(null)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
                {showRecommendations && (
                  <button
                    onClick={() => {
                      saveContainer(selectedContainer)
                      setSelectedContainer(null)
                    }}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Approve & Save Container
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VerticalFarmingPanel
