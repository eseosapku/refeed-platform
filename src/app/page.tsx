'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPin, TrendingUp, Users, BarChart3, AlertCircle, Plus } from 'lucide-react'

interface DashboardStats {
  foodDeserts: number
  activeDonors: number
  pendingMatches: number
  priceAlerts: number
  totalDonations: number
  successfulMatches: number
}

export default function HomePage() {
  const [stats, setStats] = useState<DashboardStats>({
    foodDeserts: 0,
    activeDonors: 0,
    pendingMatches: 0,
    priceAlerts: 0,
    totalDonations: 0,
    successfulMatches: 0,
  })

  useEffect(() => {
    // Simulate loading dashboard stats
    setTimeout(() => {
      setStats({
        foodDeserts: 1247,
        activeDonors: 156,
        pendingMatches: 23,
        priceAlerts: 8,
        totalDonations: 3456,
        successfulMatches: 2891,
      })
    }, 1000)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary-600">ReFeed</h1>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <Link href="/map" className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                  Food Desert Map
                </Link>
                <Link href="/donors" className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                  Donors
                </Link>
                <Link href="/donations" className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                  Donations
                </Link>
                <Link href="/prices" className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                  Price Monitor
                </Link>
                <Link href="/matches" className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                  Matches
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Fighting Food Insecurity with
              <span className="text-primary-600 block">Smart Technology</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              ReFeed maps food deserts, redirects edible food waste, and monitors live prices to create 
              efficient food distribution networks in the U.S. and Rwanda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/map"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary-700 transition-colors inline-flex items-center"
              >
                <MapPin className="mr-2 h-5 w-5" />
                Explore Food Desert Map
              </Link>
              <Link
                href="/donors/register"
                className="bg-white text-primary-600 border-2 border-primary-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary-50 transition-colors inline-flex items-center"
              >
                <Plus className="mr-2 h-5 w-5" />
                Register as Donor
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-100">
                <MapPin className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Food Deserts Mapped</p>
                <p className="text-2xl font-bold text-gray-900">{stats.foodDeserts.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
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

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Matches</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingMatches}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Price Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.priceAlerts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Donations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDonations.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-indigo-100">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Successful Matches</p>
                <p className="text-2xl font-bold text-gray-900">{stats.successfulMatches.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How ReFeed Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform combines mapping technology, waste redirection, and price monitoring 
              to create an efficient food distribution ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <MapPin className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Map Food Deserts</h3>
              <p className="text-gray-600">
                Identify and visualize food desert regions in the U.S. and Rwanda using 
                satellite data and government databases.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Connect Donors</h3>
              <p className="text-gray-600">
                Register supermarkets, farms, and distributors to donate edible but 
                unsellable food to communities in need.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Monitor Prices</h3>
              <p className="text-gray-600">
                Track live food prices and automatically prioritize areas experiencing 
                price spikes for immediate intervention.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ReFeed</h3>
              <p className="text-gray-400">
                Fighting food insecurity through smart technology and data-driven solutions.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/map" className="hover:text-white">Food Desert Map</Link></li>
                <li><Link href="/donors" className="hover:text-white">Donors</Link></li>
                <li><Link href="/prices" className="hover:text-white">Price Monitor</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Get Involved</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/donors/register" className="hover:text-white">Become a Donor</Link></li>
                <li><Link href="/volunteer" className="hover:text-white">Volunteer</Link></li>
                <li><Link href="/partnerships" className="hover:text-white">Partnerships</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/api" className="hover:text-white">API Documentation</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ReFeed Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
