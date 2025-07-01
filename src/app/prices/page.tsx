'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Plus, Download, Filter } from 'lucide-react'

interface PriceData {
  id: string
  region: string
  country: 'USA' | 'Rwanda'
  item: string
  price: number
  currency: 'USD' | 'RWF'
  unit: string
  priceDate: Date
  source: 'manual' | 'scraped' | 'api'
  change?: {
    amount: number
    percentage: number
    trend: 'up' | 'down' | 'stable'
  }
}

interface PriceAlert {
  id: string
  region: string
  item: string
  currentPrice: number
  threshold: number
  percentageIncrease: number
  triggeredAt: Date
}

const PricesPage = () => {
  const [priceData, setPriceData] = useState<PriceData[]>([])
  const [alerts, setAlerts] = useState<PriceAlert[]>([])
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [selectedItem, setSelectedItem] = useState<string>('all')
  const [selectedCountry, setSelectedCountry] = useState<'USA' | 'Rwanda' | 'all'>('all')
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [isLoading, setIsLoading] = useState(true)
  const [showAddPriceModal, setShowAddPriceModal] = useState(false)

  // Mock data
  useEffect(() => {
    setTimeout(() => {
      setPriceData([
        {
          id: '1',
          region: 'Bronx, NY',
          country: 'USA',
          item: 'Apples',
          price: 3.50,
          currency: 'USD',
          unit: 'per lb',
          priceDate: new Date('2025-06-29'),
          source: 'manual',
          change: { amount: 0.25, percentage: 7.7, trend: 'up' }
        },
        {
          id: '2',
          region: 'Bronx, NY',
          country: 'USA',
          item: 'Bread',
          price: 2.99,
          currency: 'USD',
          unit: 'per loaf',
          priceDate: new Date('2025-06-29'),
          source: 'scraped',
          change: { amount: -0.10, percentage: -3.2, trend: 'down' }
        },
        {
          id: '3',
          region: 'Kigali',
          country: 'Rwanda',
          item: 'Maize',
          price: 850,
          currency: 'RWF',
          unit: 'per kg',
          priceDate: new Date('2025-06-29'),
          source: 'api',
          change: { amount: 120, percentage: 16.4, trend: 'up' }
        },
        {
          id: '4',
          region: 'Kigali',
          country: 'Rwanda',
          item: 'Tomatoes',
          price: 1200,
          currency: 'RWF',
          unit: 'per kg',
          priceDate: new Date('2025-06-29'),
          source: 'manual',
          change: { amount: 200, percentage: 20.0, trend: 'up' }
        },
        {
          id: '5',
          region: 'Cleveland, OH',
          country: 'USA',
          item: 'Milk',
          price: 4.25,
          currency: 'USD',
          unit: 'per gallon',
          priceDate: new Date('2025-06-29'),
          source: 'scraped',
          change: { amount: 0.15, percentage: 3.7, trend: 'up' }
        },
      ])

      setAlerts([
        {
          id: '1',
          region: 'Kigali',
          item: 'Tomatoes',
          currentPrice: 1200,
          threshold: 1000,
          percentageIncrease: 20.0,
          triggeredAt: new Date('2025-06-29T08:30:00')
        },
        {
          id: '2',
          region: 'Kigali',
          item: 'Maize',
          currentPrice: 850,
          threshold: 750,
          percentageIncrease: 16.4,
          triggeredAt: new Date('2025-06-29T10:15:00')
        },
      ])

      setIsLoading(false)
    }, 1000)
  }, [])

  // Mock chart data
  const chartData = [
    { date: '2025-06-22', apples: 3.25, bread: 3.09, maize: 730 },
    { date: '2025-06-23', apples: 3.30, bread: 3.05, maize: 740 },
    { date: '2025-06-24', apples: 3.35, bread: 3.02, maize: 760 },
    { date: '2025-06-25', apples: 3.40, bread: 3.00, maize: 780 },
    { date: '2025-06-26', apples: 3.45, bread: 2.98, maize: 800 },
    { date: '2025-06-27', apples: 3.48, bread: 2.95, maize: 820 },
    { date: '2025-06-28', apples: 3.50, bread: 2.99, maize: 850 },
  ]

  const filteredData = priceData.filter(item => {
    if (selectedRegion !== 'all' && !item.region.includes(selectedRegion)) return false
    if (selectedItem !== 'all' && item.item !== selectedItem) return false
    if (selectedCountry !== 'all' && item.country !== selectedCountry) return false
    return true
  })

  const regions = Array.from(new Set(priceData.map(item => item.region)))
  const items = Array.from(new Set(priceData.map(item => item.item)))

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-green-500" />
      case 'stable':
        return <Minus className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-red-600'
      case 'down':
        return 'text-green-600'
      case 'stable':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  const formatCurrency = (amount: number, currency: 'USD' | 'RWF') => {
    return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'rw-RW', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  const exportData = () => {
    const data = {
      prices: filteredData,
      alerts: alerts,
      exportDate: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'price-data.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Food Price Monitor</h1>
              <p className="text-gray-600">Track live food prices and detect price spikes across regions</p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddPriceModal(true)}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Price Data
              </button>
              <button
                onClick={exportData}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Price Alerts */}
        {alerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Price Alerts</h2>
            <div className="grid gap-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-red-800">
                        Price Spike Alert: {alert.item} in {alert.region}
                      </h3>
                      <p className="text-sm text-red-700 mt-1">
                        Price increased by {alert.percentageIncrease}% to {formatCurrency(alert.currentPrice, 'RWF')} 
                        (threshold: {formatCurrency(alert.threshold, 'RWF')})
                      </p>
                      <p className="text-xs text-red-600 mt-1">
                        Triggered at {alert.triggeredAt.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value as 'USA' | 'Rwanda' | 'all')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Countries</option>
                <option value="USA">USA</option>
                <option value="Rwanda">Rwanda</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Regions</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Food Item</label>
              <select
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Items</option>
                {items.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Price Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Price Trends</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="apples" stroke="#ef4444" name="Apples (USD)" />
                <Line type="monotone" dataKey="bread" stroke="#3b82f6" name="Bread (USD)" />
                <Line type="monotone" dataKey="maize" stroke="#10b981" name="Maize (RWF)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Current Prices Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Current Prices</h2>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading price data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Region
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Change
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.region}</div>
                        <div className="text-sm text-gray-500">{item.country}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.item}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(item.price, item.currency)}
                        </div>
                        <div className="text-sm text-gray-500">{item.unit}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.change && (
                          <div className={`flex items-center text-sm ${getTrendColor(item.change.trend)}`}>
                            {getTrendIcon(item.change.trend)}
                            <span className="ml-1">
                              {item.change.percentage > 0 ? '+' : ''}{item.change.percentage}%
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.source === 'manual' ? 'bg-blue-100 text-blue-800' :
                          item.source === 'scraped' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {item.source.charAt(0).toUpperCase() + item.source.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.priceDate.toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && filteredData.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-gray-500 mb-4">
                <div className="text-4xl mb-2">📈</div>
                <p>No price data found for the selected filters</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PricesPage
