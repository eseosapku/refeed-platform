import React from 'react'
import { AlertTriangle, Database, Calendar, Shield, ExternalLink } from 'lucide-react'

interface DataCredibilityProps {
  dataType: 'food_desert' | 'donor' | 'agricultural_zone'
  source: string
  lastUpdated?: Date
  confidence: 'high' | 'medium' | 'low' | 'mock'
  limitations?: string[]
  className?: string
}

const DataCredibilityIndicator: React.FC<DataCredibilityProps> = ({
  dataType,
  source,
  lastUpdated,
  confidence,
  limitations = [],
  className = ''
}) => {
  const getConfidenceColor = () => {
    switch (confidence) {
      case 'high': return 'text-green-600 bg-green-50 border-green-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'mock': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getConfidenceIcon = () => {
    switch (confidence) {
      case 'high': return <Shield className="w-4 h-4" />
      case 'medium': return <Database className="w-4 h-4" />
      case 'low': return <AlertTriangle className="w-4 h-4" />
      case 'mock': return <AlertTriangle className="w-4 h-4" />
      default: return <Database className="w-4 h-4" />
    }
  }

  const getDataTypeLabel = () => {
    switch (dataType) {
      case 'food_desert': return 'Food Desert Data'
      case 'donor': return 'Food Donor Data'
      case 'agricultural_zone': return 'Agricultural Data'
      default: return 'Data'
    }
  }

  return (
    <div className={`border rounded-lg p-3 ${getConfidenceColor()} ${className}`}>
      <div className="flex items-start space-x-2">
        {getConfidenceIcon()}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">{getDataTypeLabel()}</h4>
            <span className="text-xs font-medium capitalize">{confidence} Confidence</span>
          </div>
          
          <div className="mt-1 space-y-1 text-xs">
            <div className="flex items-center space-x-1">
              <Database className="w-3 h-3" />
              <span>Source: {source}</span>
            </div>
            
            {lastUpdated && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>Updated: {lastUpdated.toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {confidence === 'mock' && (
            <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-xs">
              <div className="flex items-start space-x-1">
                <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Development Data Only</strong>
                  <p className="mt-1">This is simulated data for demonstration purposes. Not suitable for production use.</p>
                </div>
              </div>
            </div>
          )}

          {limitations.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium">Data Limitations:</p>
              <ul className="mt-1 text-xs space-y-0.5">
                {limitations.map((limitation, index) => (
                  <li key={index} className="flex items-start space-x-1">
                    <span className="w-1 h-1 bg-current rounded-full mt-1.5 flex-shrink-0" />
                    <span>{limitation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DataCredibilityIndicator

// Example usage:
export const ExampleUsage = () => {
  return (
    <div className="space-y-4 p-4">
      <DataCredibilityIndicator
        dataType="food_desert"
        source="Mock Data (Development)"
        confidence="mock"
        limitations={[
          "Coordinates are estimated, not surveyed",
          "Population figures are approximate",
          "Severity ratings are arbitrary",
          "Polygon boundaries are simplified"
        ]}
      />
      
      <DataCredibilityIndicator
        dataType="donor"
        source="USDA Food Access Research Atlas"
        lastUpdated={new Date('2024-01-01')}
        confidence="high"
        limitations={[
          "Data updated annually",
          "May not reflect recent closures"
        ]}
      />
      
      <DataCredibilityIndicator
        dataType="agricultural_zone"
        source="Google Places API + Manual Verification"
        lastUpdated={new Date('2024-06-15')}
        confidence="medium"
        limitations={[
          "Crowd-sourced data may have inaccuracies",
          "Business hours may be outdated"
        ]}
      />
    </div>
  )
}
