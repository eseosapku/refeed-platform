'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  MapPin, 
  Users, 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  Clock,
  CheckCircle,
  XCircle,
  Activity
} from 'lucide-react'
import KaggleIntegrationPanel from './KaggleIntegrationPanel'
import VerticalFarmingPanel from './VerticalFarmingPanel'

interface DashboardStats {
  totalFoodDeserts: number
  activeDonors: number
  pendingDonations: number
  activeMatches: number
  priceAlerts: number
  totalDeliveries: number
}

interface RecentActivity {
  id: string
  type: 'donation' | 'match' | 'price_alert' | 'delivery'
  description: string
  timestamp: Date
  status: 'success' | 'warning' | 'error' | 'info'
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalFoodDeserts: 0,
    activeDonors: 0,
    pendingDonations: 0,
    activeMatches: 0,
    priceAlerts: 0,
    totalDeliveries: 0,
  })

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setStats({
        totalFoodDeserts: 1247,
        activeDonors: 156,
        pendingDonations: 23,
        activeMatches: 18,
        priceAlerts: 8,
        totalDeliveries: 2891,
      })

      setRecentActivity([
        {
          id: '1',
          type: 'price_alert',
          description: 'Price spike detected: Tomatoes in Kigali increased by 20%',
          timestamp: new Date('2025-06-29T10:30:00'),
          status: 'warning'
        },
        {
          id: '2',
          type: 'donation',
          description: 'New donation: 50kg Apples from Fresh Market Co.',
          timestamp: new Date('2025-06-29T09:15:00'),
          status: 'success'
        },
        {
          id: '3',
          type: 'match',
          description: 'Match created: Bread donation → South Bronx Community',
          timestamp: new Date('2025-06-29T08:45:00'),
          status: 'info'
        },
        {
          id: '4',
          type: 'delivery',
          description: 'Delivery completed: 30kg Rice to Nyamirambo',
          timestamp: new Date('2025-06-29T07:20:00'),
          status: 'success'
        },
        {
          id: '5',
          type: 'match',
          description: 'Match expired: Vegetables not collected within timeframe',
          timestamp: new Date('2025-06-28T16:30:00'),
          status: 'error'
        },
      ])

      setIsLoading(false)
    }, 1000)
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'donation':
        return <Package className="h-4 w-4" />
      case 'match':
        return <Users className="h-4 w-4" />
      case 'price_alert':
        return <TrendingUp className="h-4 w-4" />
      case 'delivery':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100'
      case 'error':
        return 'text-red-600 bg-red-100'
      case 'info':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const runMatchmakingEngine = async () => {
    try {
      const response = await fetch('/api/cron/matchmaking')
      const result = await response.json()
      
      if (result.success) {
        alert(`Matchmaking completed! Found ${result.data.newMatches} new matches, ${result.data.priceAlerts} price alerts.`)
      } else {
        alert('Matchmaking failed. Check console for details.')
      }
    } catch (error) {
      console.error('Error running matchmaking:', error)
      alert('Error running matchmaking engine.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage the ReFeed platform operations</p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={runMatchmakingEngine}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Activity className="mr-2 h-4 w-4" />
                Run Matchmaking
              </button>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to App
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-100">
                <MapPin className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Food Deserts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalFoodDeserts.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Donors</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeDonors}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Donations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingDonations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Matches</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeMatches}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Price Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.priceAlerts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-indigo-100">
                <CheckCircle className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Deliveries</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDeliveries.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          <Link
            href="/map"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-center">
              <MapPin className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">View Map</h3>
              <p className="text-sm text-gray-600 mt-1">Monitor food deserts</p>
            </div>
          </Link>

          <Link
            href="/donors"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-center">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Manage Donors</h3>
              <p className="text-sm text-gray-600 mt-1">View all donors</p>
            </div>
          </Link>

          <Link
            href="/prices"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-center">
              <TrendingUp className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Price Monitor</h3>
              <p className="text-sm text-gray-600 mt-1">Track food prices</p>
            </div>
          </Link>

          <Link
            href="/matches"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-center">
              <Package className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">View Matches</h3>
              <p className="text-sm text-gray-600 mt-1">Monitor deliveries</p>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading activity...</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start">
                    <div className={`p-2 rounded-full ${getActivityColor(activity.status)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.description}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {activity.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!isLoading && recentActivity.length === 0 && (
            <div className="p-8 text-center">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No recent activity</p>
            </div>
          )}
        </div>

        {/* Kaggle Dataset Integration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Kaggle Dataset Integration</h2>
            <p className="text-sm text-gray-600 mt-1">Manage real dataset downloads and processing</p>
          </div>
          
          <div className="p-6">
            <KaggleIntegrationPanel />
          </div>
        </div>

        {/* Vertical Farming Container Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Vertical Farming Containers</h2>
            <p className="text-sm text-gray-600 mt-1">AI-powered container placement for high-severity food deserts</p>
          </div>
          
          <div className="p-6">
            <VerticalFarmingPanel />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
