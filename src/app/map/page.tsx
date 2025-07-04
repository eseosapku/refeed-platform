'use client'

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Search, Upload, Filter, Download, MapPin, Database, Zap } from 'lucide-react'
import LiveDataDashboard from '@/components/LiveDataDashboard'
import DataCredibilityIndicator from '@/components/DataCredibilityIndicator'
import { FarmingContainer } from '@/types'
import { verticalFarmingService } from '@/lib/verticalFarmingService'

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Polygon = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polygon),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

// Import leaflet CSS
import 'leaflet/dist/leaflet.css'

// Fix for default markers in React Leaflet - moved to useEffect
interface FoodDesertData {
  id: string
  name: string
  country: 'USA' | 'Rwanda'
  coordinates: [number, number][]
  population?: number
  severity: 'high' | 'medium' | 'low' | 'food_source'
  cropType?: string
}

interface DonorMarker {
  id: string
  name: string
  type: string
  position: [number, number]
  isActive: boolean
  capacity?: string
  availableItems?: string[]
  exportCapability?: boolean
}

const MapPage = () => {
  const [foodDeserts, setFoodDeserts] = useState<FoodDesertData[]>([])
  const [donors, setDonors] = useState<DonorMarker[]>([])
  const [verticalFarms, setVerticalFarms] = useState<FarmingContainer[]>([])
  const [selectedCountry, setSelectedCountry] = useState<'USA' | 'Rwanda' | 'all'>('all')
  const [showDonors, setShowDonors] = useState(true)
  const [showFoodDeserts, setShowFoodDeserts] = useState(true)
  const [showVerticalFarms, setShowVerticalFarms] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [useRealData, setUseRealData] = useState(false)
  const [dataSource, setDataSource] = useState('Mock Data')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load data from APIs or mock data for static deployment
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        console.log('🔄 Starting data loading...')
        
        // Check if we're in a static build environment
        const isStaticBuild = typeof window === 'undefined' || !window.location.href.includes('localhost:3000')
        
        // Always load vertical farming containers first
        const verticalFarmData = await verticalFarmingService.getExistingContainers()
        console.log('🌱 Vertical farms loaded:', verticalFarmData.length)
        setVerticalFarms(verticalFarmData)
        
        // Use mock data immediately in static builds or as fallback
        const mockDeserts = getMockFoodDeserts()
        const mockDonorsData = getMockDonors()
        
        console.log('📊 Mock data prepared:', { 
          deserts: mockDeserts.length, 
          donors: mockDonorsData.length 
        })
        
        // Set mock data immediately for static builds
        setFoodDeserts(mockDeserts)
        setDonors(mockDonorsData)
        setDataSource('Mock Data (Static Build)')
        
        // Only try API calls if we're in dev mode
        if (!isStaticBuild && typeof window !== 'undefined') {
          try {
            // Determine which API endpoints to use
            const foodDesertsEndpoint = useRealData ? '/api/food-deserts-kaggle?kaggle=true' : '/api/food-deserts'
            const donorsEndpoint = useRealData ? '/api/donors-real?real=true' : '/api/donors'
            
            console.log('📡 Trying API endpoints:', { foodDesertsEndpoint, donorsEndpoint })
            
            // Fetch food deserts
            const foodDesertsResponse = await fetch(foodDesertsEndpoint)
            const foodDesertData = await foodDesertsResponse.json()
            
            if (foodDesertData.success) {
              console.log('✅ Food deserts API success:', foodDesertData.data.length)
              const transformedDeserts = foodDesertData.data.map((desert: any) => ({
                id: desert.id,
                name: desert.name,
                country: desert.country,
                coordinates: desert.polygon.coordinates[0].map(([lng, lat]: [number, number]) => [lat, lng]),
                population: desert.population,
                severity: desert.severity || 'medium',
                cropType: desert.cropType,
              }))
              setFoodDeserts(transformedDeserts)
              setDataSource(foodDesertData.dataSource || (useRealData ? 'Real Data' : 'API Data'))
            }

            // Fetch donors
            const donorsResponse = await fetch(donorsEndpoint)
            const donorData = await donorsResponse.json()
            
            if (donorData.success) {
              console.log('✅ Donors API success:', donorData.data.length)
              const transformedDonors = donorData.data.map((donor: any) => ({
                id: donor.id,
                name: donor.name,
                type: donor.type,
                position: [donor.location.lat, donor.location.lng],
                isActive: donor.isActive,
                capacity: donor.capacity,
                availableItems: donor.availableItems,
                exportCapability: donor.exportCapability,
                credibilityScore: donor.credibilityScore,
                dataSource: donor.dataSource,
              }))
              setDonors(transformedDonors)
            }
            
          } catch (apiError) {
            console.warn('⚠️ API calls failed, keeping mock data:', apiError)
            // Mock data is already set, just update data source
            setDataSource('Mock Data (API Fallback)')
          }
        }

      } catch (error) {
        console.error('❌ Error loading data:', error)
        // Final fallback to mock data
        try {
          const mockDeserts = getMockFoodDeserts()
          const mockDonorsData = getMockDonors()
          const mockVerticalFarms = await verticalFarmingService.getExistingContainers()
          
          console.log('🆘 Final fallback mock data:', { 
            deserts: mockDeserts.length, 
            donors: mockDonorsData.length,
            farms: mockVerticalFarms.length
          })
          
          setFoodDeserts(mockDeserts)
          setDonors(mockDonorsData)
          setVerticalFarms(mockVerticalFarms)
          setDataSource('Mock Data (Error Fallback)')
        } catch (fallbackError) {
          console.error('💥 Even mock data failed:', fallbackError)
          setFoodDeserts([])
          setDonors([])
          setVerticalFarms([])
          setDataSource('Error - No Data')
        }
      } finally {
        setIsLoading(false)
        console.log('✅ Data loading complete')
      }
    }

    loadData()
  }, [useRealData]) // Re-run when data source changes

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return '#ef4444' // Red for high severity food deserts
      case 'medium':
        return '#f59e0b' // Orange for medium severity food deserts
      case 'low':
        return '#eab308' // Yellow for low severity food deserts
      case 'food_source':
        return '#22c55e' // Green for food sources (Rwanda agricultural areas)
      default:
        return '#6b7280' // Gray as default
    }
  }

  const getDonorIcon = (type: string, exportCapability?: boolean) => {
    // Check if we're on the client side and Leaflet is available
    if (typeof window === 'undefined') return null
    
    const L = require('leaflet')
    
    let iconUrl = ''
    let iconColor = ''
    
    switch (type.toLowerCase()) {
      case 'farm':
        iconColor = exportCapability ? '#10b981' : '#22c55e' // Darker green for export farms
        iconUrl = 'data:image/svg+xml;base64,' + btoa(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L13 7H19L14 12L17 18H7L10 12L5 7H11L12 2Z" fill="${iconColor}"/>
            <circle cx="12" cy="12" r="2" fill="white"/>
          </svg>
        `)
        break
      case 'restaurant':
        iconColor = '#f59e0b'
        iconUrl = 'data:image/svg+xml;base64,' + btoa(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.5 14v2.5c0 1.1.9 2 2 2s2-.9 2-2V14" fill="${iconColor}"/>
            <path d="M8.5 8.5c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5-2.5-1.1-2.5-2.5z" fill="${iconColor}"/>
            <rect x="10" y="11" width="4" height="3" fill="${iconColor}"/>
          </svg>
        `)
        break
      case 'supermarket':
        iconColor = '#3b82f6'
        iconUrl = 'data:image/svg+xml;base64,' + btoa(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3H21L19 13H5L3 3Z" fill="${iconColor}"/>
            <circle cx="8" cy="18" r="2" fill="${iconColor}"/>
            <circle cx="16" cy="18" r="2" fill="${iconColor}"/>
          </svg>
        `)
        break
      case 'distributor':
        iconColor = '#8b5cf6'
        iconUrl = 'data:image/svg+xml;base64,' + btoa(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12H20L18 6H6L4 12Z" fill="${iconColor}"/>
            <path d="M12 14V20" stroke="${iconColor}" stroke-width="2"/>
            <path d="M8 17L16 17" stroke="${iconColor}" stroke-width="2"/>
          </svg>
        `)
        break
      default:
        iconColor = '#6b7280'
        iconUrl = 'data:image/svg+xml;base64,' + btoa(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" fill="${iconColor}"/>
          </svg>
        `)
    }

    return new L.Icon({
      iconUrl,
      iconSize: [60, 60], // Massively increased from 40x40 to 60x60
      iconAnchor: [30, 60], // Adjusted anchor point
      popupAnchor: [0, -60], // Adjusted popup anchor
    })
  }

  const getVerticalFarmIcon = (type: string, status: string) => {
    // Check if we're on the client side and Leaflet is available
    if (typeof window === 'undefined') return null
    
    const L = require('leaflet')
    
    let iconColor = ''
    let iconSymbol = ''
    
    // Color based on status
    switch (status) {
      case 'active':
        iconColor = '#10b981' // Green for active
        break
      case 'planned':
        iconColor = '#3b82f6' // Blue for planned
        break
      case 'maintenance':
        iconColor = '#f59e0b' // Orange for maintenance
        break
      default:
        iconColor = '#6b7280' // Gray as default
    }
    
    // Symbol based on type (using text letters instead of emojis)
    switch (type) {
      case 'vertical_farm':
        iconSymbol = 'VF'
        break
      case 'hydroponic':
        iconSymbol = 'HY'
        break
      case 'aeroponic':
        iconSymbol = 'AE'
        break
      default:
        iconSymbol = 'VF'
    }
    
    const svgString = `
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="${iconColor}" stroke="white" stroke-width="2"/>
        <text x="16" y="20" text-anchor="middle" font-size="10" font-weight="bold" fill="white">${iconSymbol}</text>
      </svg>
    `
    
    const iconUrl = 'data:image/svg+xml;base64,' + btoa(svgString)
    
    return L.icon({
      iconUrl: iconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    })
  }

  const getVerticalFarmStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981' // Green
      case 'planned':
        return '#3b82f6' // Blue
      case 'maintenance':
        return '#f59e0b' // Orange
      default:
        return '#6b7280' // Gray
    }
  }

  const filteredFoodDeserts = foodDeserts.filter(desert => {
    if (selectedCountry !== 'all' && desert.country !== selectedCountry) return false
    if (searchQuery && !desert.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const filteredDonors = donors.filter(donor => {
    if (!showDonors) return false
    if (searchQuery && !donor.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/json') {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const geojson = JSON.parse(e.target?.result as string)
          console.log('Uploaded GeoJSON:', geojson)
          // Here you would process the GeoJSON and add it to the map
        } catch (error) {
          console.error('Error parsing GeoJSON:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  const exportData = () => {
    const data = {
      foodDeserts: filteredFoodDeserts,
      donors: filteredDonors,
      exportDate: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'refeed-map-data.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadCSV = async () => {
    try {
      const endpoint = `/api/food-deserts/download?kaggle=${useRealData}`
      const response = await fetch(endpoint)
      
      if (!response.ok) {
        throw new Error('Failed to download CSV')
      }
      
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = useRealData ? 'food-deserts-kaggle-data.csv' : 'food-deserts-mock-data.csv'
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading CSV:', error)
      alert('Failed to download CSV file. Please try again.')
    }
  }

  // Mock data for static deployment
  const getMockFoodDeserts = (): FoodDesertData[] => {
    return [
      {
        id: 'detroit-downtown',
        name: 'Detroit Downtown Food Desert',
        country: 'USA',
        coordinates: [
          [42.3314, -83.0458],
          [42.3400, -83.0400],
          [42.3350, -83.0300],
          [42.3250, -83.0350],
          [42.3314, -83.0458]
        ],
        population: 12500,
        severity: 'high'
      },
      {
        id: 'chicago-south',
        name: 'Chicago South Side Food Desert',
        country: 'USA',
        coordinates: [
          [41.8781, -87.6298],
          [41.8850, -87.6200],
          [41.8800, -87.6100],
          [41.8700, -87.6200],
          [41.8781, -87.6298]
        ],
        population: 18000,
        severity: 'high'
      },
      {
        id: 'memphis-downtown',
        name: 'Memphis Downtown Food Desert',
        country: 'USA',
        coordinates: [
          [35.1495, -90.0490],
          [35.1550, -90.0400],
          [35.1500, -90.0350],
          [35.1450, -90.0450],
          [35.1495, -90.0490]
        ],
        population: 8900,
        severity: 'high'
      },
      {
        id: 'cleveland-east',
        name: 'Cleveland East Side Food Desert',
        country: 'USA',
        coordinates: [
          [41.4993, -81.6944],
          [41.5050, -81.6850],
          [41.5000, -81.6800],
          [41.4950, -81.6900],
          [41.4993, -81.6944]
        ],
        population: 15200,
        severity: 'high'
      },
      {
        id: 'phoenix-south',
        name: 'South Phoenix Food Desert',
        country: 'USA',
        coordinates: [
          [33.4484, -112.0740],
          [33.4550, -112.0650],
          [33.4500, -112.0600],
          [33.4450, -112.0700],
          [33.4484, -112.0740]
        ],
        population: 22000,
        severity: 'high'
      },
      {
        id: 'atlanta-southwest',
        name: 'Southwest Atlanta Food Desert',
        country: 'USA',
        coordinates: [
          [33.7490, -84.3880],
          [33.7550, -84.3800],
          [33.7500, -84.3750],
          [33.7450, -84.3850],
          [33.7490, -84.3880]
        ],
        population: 11200,
        severity: 'high'
      },
      {
        id: 'baltimore-west',
        name: 'West Baltimore Food Desert',
        country: 'USA',
        coordinates: [
          [39.2904, -76.6122],
          [39.2950, -76.6050],
          [39.2920, -76.6000],
          [39.2880, -76.6080],
          [39.2904, -76.6122]
        ],
        population: 16800,
        severity: 'high'
      },
      {
        id: 'milwaukee-north',
        name: 'Milwaukee North Side Food Desert',
        country: 'USA',
        coordinates: [
          [43.0389, -87.9065],
          [43.0450, -87.9000],
          [43.0420, -87.8950],
          [43.0360, -87.9020],
          [43.0389, -87.9065]
        ],
        population: 13400,
        severity: 'high'
      },
      // Medium severity areas
      {
        id: 'sacramento-medium',
        name: 'Sacramento Central',
        country: 'USA',
        coordinates: [
          [38.5816, -121.4944],
          [38.5870, -121.4880],
          [38.5840, -121.4820],
          [38.5780, -121.4900],
          [38.5816, -121.4944]
        ],
        population: 9500,
        severity: 'medium'
      },
      {
        id: 'portland-medium',
        name: 'Portland East Side',
        country: 'USA',
        coordinates: [
          [45.5152, -122.6784],
          [45.5200, -122.6720],
          [45.5180, -122.6680],
          [45.5130, -122.6740],
          [45.5152, -122.6784]
        ],
        population: 7800,
        severity: 'medium'
      },
      // Rwanda food sources
      {
        id: 'kigali-agriculture',
        name: 'Kigali Agricultural Zone',
        country: 'Rwanda',
        coordinates: [
          [-1.9441, 30.0619],
          [-1.9380, 30.0680],
          [-1.9420, 30.0750],
          [-1.9480, 30.0680],
          [-1.9441, 30.0619]
        ],
        population: 15000,
        severity: 'food_source',
        cropType: 'Coffee, Tea, Bananas'
      },
      {
        id: 'butare-agriculture',
        name: 'Butare Farming Region',
        country: 'Rwanda',
        coordinates: [
          [-2.6037, 29.7394],
          [-2.5980, 29.7450],
          [-2.6020, 29.7520],
          [-2.6080, 29.7460],
          [-2.6037, 29.7394]
        ],
        population: 8500,
        severity: 'food_source',
        cropType: 'Maize, Beans, Sweet Potatoes'
      }
    ]
  }

  const getMockDonors = (): DonorMarker[] => {
    return [
      {
        id: 'donor-1',
        name: 'Detroit Urban Farm',
        type: 'farm',
        position: [42.3314, -83.0458],
        isActive: true,
        capacity: '500 lbs/week',
        availableItems: ['Fresh Vegetables', 'Herbs', 'Leafy Greens'],
        exportCapability: false
      },
      {
        id: 'donor-2',
        name: 'Chicago Community Market',
        type: 'supermarket',
        position: [41.8781, -87.6298],
        isActive: true,
        capacity: '1000 lbs/week',
        availableItems: ['Dairy', 'Produce', 'Canned Goods'],
        exportCapability: true
      },
      {
        id: 'donor-3',
        name: 'Memphis Food Hub',
        type: 'distributor',
        position: [35.1495, -90.0490],
        isActive: true,
        capacity: '2000 lbs/week',
        availableItems: ['Grains', 'Proteins', 'Vegetables'],
        exportCapability: true
      },
      {
        id: 'donor-4',
        name: 'Cleveland Restaurant Group',
        type: 'restaurant',
        position: [41.4993, -81.6944],
        isActive: true,
        capacity: '300 lbs/week',
        availableItems: ['Prepared Foods', 'Bread', 'Fruits'],
        exportCapability: false
      },
      {
        id: 'donor-5',
        name: 'Phoenix Fresh Foods',
        type: 'supermarket',
        position: [33.4484, -112.0740],
        isActive: true,
        capacity: '1500 lbs/week',
        availableItems: ['Fresh Produce', 'Packaged Goods', 'Frozen Items'],
        exportCapability: true
      },
      {
        id: 'donor-6',
        name: 'Atlanta Farm Co-op',
        type: 'farm',
        position: [33.7490, -84.3880],
        isActive: true,
        capacity: '800 lbs/week',
        availableItems: ['Seasonal Vegetables', 'Fruits', 'Herbs'],
        exportCapability: false
      },
      {
        id: 'donor-7',
        name: 'Baltimore Distribution Center',
        type: 'distributor',
        position: [39.2904, -76.6122],
        isActive: true,
        capacity: '2500 lbs/week',
        availableItems: ['Bulk Grains', 'Canned Goods', 'Dry Goods'],
        exportCapability: true
      },
      {
        id: 'donor-8',
        name: 'Milwaukee Organic Farm',
        type: 'farm',
        position: [43.0389, -87.9065],
        isActive: true,
        capacity: '600 lbs/week',
        availableItems: ['Organic Vegetables', 'Dairy Products', 'Eggs'],
        exportCapability: false
      },
      {
        id: 'donor-9',
        name: 'Kigali Coffee Cooperative',
        type: 'farm',
        position: [-1.9441, 30.0619],
        isActive: true,
        capacity: '1200 lbs/week',
        availableItems: ['Coffee Beans', 'Tea Leaves', 'Bananas'],
        exportCapability: true
      },
      {
        id: 'donor-10',
        name: 'Butare Agricultural Center',
        type: 'distributor',
        position: [-2.6037, 29.7394],
        isActive: true,
        capacity: '1800 lbs/week',
        availableItems: ['Maize', 'Beans', 'Sweet Potatoes', 'Cassava'],
        exportCapability: true
      }
    ]
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Global Food Network Map</h1>
            <p className="text-gray-600">Live mapping of food deserts, agricultural sources, and supply networks</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Data Source Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setUseRealData(false)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  !useRealData 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Mock Data
              </button>
              <button
                onClick={() => setUseRealData(true)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  useRealData 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Real Data
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Country Filter */}
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value as 'USA' | 'Rwanda' | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Countries</option>
              <option value="USA">USA</option>
              <option value="Rwanda">Rwanda</option>
            </select>

            {/* Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload GeoJSON
            </button>

            {/* Export Button */}
            <button
              onClick={exportData}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="mr-2 h-4 w-4" />
              Export JSON
            </button>

            {/* CSV Download Button */}
            <button
              onClick={downloadCSV}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="mr-2 h-4 w-4" />
              Download CSV
            </button>

            {/* Data Sources Link */}
            <Link href="/data-sources" className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              <Database className="mr-2 h-4 w-4" />
              Data Sources
            </Link>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.geojson"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Toggle Controls */}
        <div className="flex flex-wrap gap-4 mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showFoodDeserts}
              onChange={(e) => setShowFoodDeserts(e.target.checked)}
              className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Show Food Deserts</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showDonors}
              onChange={(e) => setShowDonors(e.target.checked)}
              className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Show Donors</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showVerticalFarms}
              onChange={(e) => setShowVerticalFarms(e.target.checked)}
              className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700 flex items-center">
              <Zap className="h-4 w-4 mr-1" />
              Vertical Farms
            </span>
          </label>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading map data...</p>
            </div>
          </div>
        ) : (
          <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Food Desert Polygons - HIGHLY VISIBLE */}
            {showFoodDeserts && filteredFoodDeserts.map((desert) => (
              <Polygon
                key={desert.id}
                positions={desert.coordinates}
                pathOptions={{
                  color: getSeverityColor(desert.severity),
                  weight: 5, // Increased from 3 - much thicker borders
                  opacity: 1.0, // Maximum opacity
                  fillOpacity: 0.7, // Increased from 0.5 - much more visible fill
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-lg">{desert.name}</h3>
                    <p className="text-sm text-gray-600">Country: {desert.country}</p>
                    {desert.population && (
                      <p className="text-sm text-gray-600">Population: {desert.population.toLocaleString()}</p>
                    )}
                    {desert.cropType && (
                      <p className="text-sm text-green-600 font-medium">
                        🌾 Primary Crops: {desert.cropType.replace('_', ' & ')}
                      </p>
                    )}
                    <p className="text-sm">
                      {desert.severity === 'food_source' ? 'Status' : 'Severity'}:{' '}
                      <span className={`font-medium ${
                        desert.severity === 'high' ? 'text-red-600' :
                        desert.severity === 'medium' ? 'text-yellow-600' :
                        desert.severity === 'low' ? 'text-yellow-500' :
                        desert.severity === 'food_source' ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {desert.severity === 'food_source' ? 'Agricultural Production Zone' : 
                         desert.severity.charAt(0).toUpperCase() + desert.severity.slice(1) + ' Food Desert'}
                      </span>
                    </p>
                    {desert.severity === 'food_source' && (
                      <div className="mt-2 text-xs text-green-700 bg-green-50 p-2 rounded">
                        🌍 Export-ready agricultural region contributing to global food security
                      </div>
                    )}
                  </div>
                </Popup>
              </Polygon>
            ))}

            {/* Donor Markers */}
            {filteredDonors.map((donor) => (
              <Marker
                key={donor.id}
                position={donor.position}
                icon={getDonorIcon(donor.type, donor.exportCapability)}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-lg">{donor.name}</h3>
                    <p className="text-sm text-gray-600">Type: {donor.type.charAt(0).toUpperCase() + donor.type.slice(1)}</p>
                    {donor.capacity && (
                      <p className="text-sm text-gray-600">Capacity: {donor.capacity}</p>
                    )}
                    {donor.availableItems && donor.availableItems.length > 0 && (
                      <p className="text-sm text-gray-600">
                        Items: {donor.availableItems.slice(0, 3).join(', ')}
                        {donor.availableItems.length > 3 && '...'}
                      </p>
                    )}
                    {donor.exportCapability && (
                      <p className="text-sm text-green-600 font-medium">🌍 Export Capable</p>
                    )}
                    <p className="text-sm">
                      Status: <span className={`font-medium ${
                        donor.isActive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {donor.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Vertical Farm Markers */}
            {showVerticalFarms && verticalFarms.map((farm) => (
              <Marker
                key={farm.id}
                position={farm.coordinates}
                icon={getVerticalFarmIcon(farm.type, farm.status)}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-lg">{farm.name}</h3>
                    <p className="text-sm text-gray-600">Type: {farm.type.replace('_', ' ').charAt(0).toUpperCase() + farm.type.replace('_', ' ').slice(1)}</p>
                    <p className="text-sm">
                      Status: <span 
                        className="font-medium" 
                        style={{ color: getVerticalFarmStatusColor(farm.status) }}
                      >
                        {farm.status.charAt(0).toUpperCase() + farm.status.slice(1)}
                      </span>
                    </p>
                    <div className="mt-2 text-xs">
                      <p className="font-medium text-gray-700">🌱 Capacity:</p>
                      <p>Monthly yield: {farm.capacity.monthly_yield_kg}kg</p>
                      <p>Crop types: {farm.capacity.crop_types}</p>
                      <p>Cycles/year: {farm.capacity.growing_cycles_per_year}</p>
                    </div>
                    <div className="mt-2 text-xs">
                      <p className="font-medium text-gray-700">📊 Impact:</p>
                      <p>Population served: {farm.impact.population_served.toLocaleString()}</p>
                      <p>Severity: {farm.impact.current_severity} → {farm.impact.projected_severity}</p>
                      <p>Reduction: {farm.impact.reduction_percentage}%</p>
                    </div>
                    <div className="mt-2 text-xs">
                      <p className="font-medium text-gray-700">🌾 Top Crops:</p>
                      {farm.recommendations.slice(0, 3).map((rec, idx) => (
                        <p key={idx}>{rec.crop} ({rec.suitability_score}% suitable)</p>
                      ))}
                    </div>
                    <div className="mt-2 text-xs">
                      <p className="font-medium text-gray-700">💰 Cost:</p>
                      <p>Installation: ${farm.installation.cost_estimate.toLocaleString()}</p>
                      <p>Annual maintenance: ${farm.installation.maintenance_cost_annual.toLocaleString()}</p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-10 max-w-xs">
          <h4 className="font-bold text-sm mb-3">Legend</h4>
          <div className="space-y-2">
            <div className="border-b pb-2 mb-2">
              <h5 className="font-semibold text-xs text-gray-700 mb-1">Food Access Areas</h5>
              <div className="flex items-center mb-1">
                <div className="w-4 h-4 bg-red-500 rounded mr-2 opacity-60"></div>
                <span className="text-xs">High Severity Food Desert</span>
              </div>
              <div className="flex items-center mb-1">
                <div className="w-4 h-4 bg-yellow-500 rounded mr-2 opacity-60"></div>
                <span className="text-xs">Medium Severity Food Desert</span>
              </div>
              <div className="flex items-center mb-1">
                <div className="w-4 h-4 bg-yellow-400 rounded mr-2 opacity-60"></div>
                <span className="text-xs">Low Severity Food Desert</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-2 opacity-60"></div>
                <span className="text-xs">Food Source Areas (Rwanda)</span>
              </div>
            </div>
            <div>
              <h5 className="font-semibold text-xs text-gray-700 mb-1">Food Providers</h5>
              <div className="flex items-center mb-1">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                <span className="text-xs">🌾 Farms</span>
              </div>
              <div className="flex items-center mb-1">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-xs">🏪 Supermarkets</span>
              </div>
              <div className="flex items-center mb-1">
                <div className="w-4 h-4 bg-amber-500 rounded-full mr-2"></div>
                <span className="text-xs">🍽️ Restaurants</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-xs">🚚 Distributors</span>
              </div>
            </div>
            <div>
              <h5 className="font-semibold text-xs text-gray-700 mb-1">Vertical Farms</h5>
              <div className="flex items-center mb-1">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                <span className="text-xs">🏢 Active Containers</span>
              </div>
              <div className="flex items-center mb-1">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-xs">🌱 Planned Containers</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-amber-500 rounded-full mr-2"></div>
                <span className="text-xs">🔧 Under Maintenance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Credibility Warning */}
        <div className="absolute top-4 right-4 z-20 max-w-sm">
          <DataCredibilityIndicator
            dataType="food_desert"
            source="Mock Data (Development Only)"
            confidence="mock"
            limitations={[
              "All coordinates are estimated for demo purposes",
              "Population figures are not from official census data",
              "Food desert classifications are arbitrary",
              "Store locations may be inaccurate or outdated"
            ]}
            className="mb-4"
          />
        </div>

        {/* Stats Panel */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-10" style={{ marginTop: '280px' }}>
          <h4 className="font-bold text-sm mb-3">📊 Real-Time Statistics</h4>
          <div className="space-y-1 text-xs">
            <p>🔴 Food Deserts (US): <span className="font-medium text-red-600">
              {filteredFoodDeserts.filter(d => d.country === 'USA' && d.severity !== 'food_source').length}
            </span></p>
            <p>🌿 Food Sources (Rwanda): <span className="font-medium text-green-600">
              {filteredFoodDeserts.filter(d => d.country === 'Rwanda' && d.severity === 'food_source').length}
            </span></p>
            <p>🏪 Active Food Providers: <span className="font-medium text-blue-600">{filteredDonors.length}</span></p>
            <p>🏢 Vertical Farms: <span className="font-medium text-purple-600">{verticalFarms.length}</span></p>
            <div className="pt-1 border-t mt-2">
              <p className="text-xs font-semibold text-gray-700 mb-1">Provider Breakdown:</p>
              <p>🌾 Farms: <span className="font-medium">{filteredDonors.filter(d => d.type === 'farm').length}</span></p>
              <p>🏪 Supermarkets: <span className="font-medium">{filteredDonors.filter(d => d.type === 'supermarket').length}</span></p>
              <p>🍽️ Restaurants: <span className="font-medium">{filteredDonors.filter(d => d.type === 'restaurant').length}</span></p>
              <p>🚚 Distributors: <span className="font-medium">{filteredDonors.filter(d => d.type === 'distributor').length}</span></p>
              <p>🌍 Export Ready: <span className="font-medium text-green-700">{filteredDonors.filter(d => d.exportCapability).length}</span></p>
            </div>
            <div className="pt-1 border-t mt-2">
              <p className="text-xs font-semibold text-gray-700 mb-1">Vertical Farm Status:</p>
              <p>🏢 Active: <span className="font-medium text-green-600">{verticalFarms.filter(f => f.status === 'active').length}</span></p>
              <p>🌱 Planned: <span className="font-medium text-blue-600">{verticalFarms.filter(f => f.status === 'planned').length}</span></p>
              <p>🔧 Maintenance: <span className="font-medium text-amber-600">{verticalFarms.filter(f => f.status === 'maintenance').length}</span></p>
            </div>
            <div className="pt-1 border-t mt-2">
              <p className="text-xs font-semibold text-gray-700 mb-1">🌾 Vertical Farm Impact:</p>
              <p className="text-gray-600">Total People Served:</p>
              <p className="font-bold text-green-700">
                {verticalFarms
                  .reduce((total, farm) => total + farm.impact.population_served, 0)
                  .toLocaleString()}
              </p>
              <p className="text-gray-600">Avg. Severity Reduction:</p>
              <p className="font-bold text-green-700">
                {verticalFarms.length > 0 ? 
                  Math.round(verticalFarms.reduce((total, farm) => total + farm.impact.reduction_percentage, 0) / verticalFarms.length)
                  : 0}%
              </p>
            </div>
            <div className="pt-1 border-t mt-2 text-xs">
              <p className="text-gray-600">Total Population Affected:</p>
              <p className="font-bold text-red-700">
                {filteredFoodDeserts
                  .filter(d => d.country === 'USA' && d.severity !== 'food_source')
                  .reduce((total, desert) => total + (desert.population || 0), 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Live Data Dashboard */}
        <div className="absolute top-4 left-4 z-10">
          <LiveDataDashboard selectedCountry={selectedCountry} />
        </div>
      </div>
    </div>
  )
}

export default MapPage
