'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Plus, MapPin, Phone, Mail, Filter, Edit, Trash2, Eye } from 'lucide-react'

interface Donor {
  id: string
  name: string
  type: 'supermarket' | 'farm' | 'distributor' | 'restaurant'
  location: {
    lat: number
    lng: number
    address: string
  }
  contactInfo: {
    phone?: string
    email?: string
    contactPerson?: string
  }
  isActive: boolean
  registeredAt: Date
  totalDonations: number
  lastDonation?: Date
}

const DonorsPage = () => {
  const [donors, setDonors] = useState<Donor[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  // Mock data
  useEffect(() => {
    setTimeout(() => {
      setDonors([
        {
          id: '1',
          name: 'Fresh Market Co.',
          type: 'supermarket',
          location: {
            lat: 40.8176,
            lng: -73.9282,
            address: '123 Main St, Bronx, NY 10451'
          },
          contactInfo: {
            phone: '+1 (555) 123-4567',
            email: 'donations@freshmarket.com',
            contactPerson: 'John Smith'
          },
          isActive: true,
          registeredAt: new Date('2024-01-15'),
          totalDonations: 45,
          lastDonation: new Date('2025-06-25')
        },
        {
          id: '2',
          name: 'Green Valley Farm',
          type: 'farm',
          location: {
            lat: 41.5331,
            lng: -81.5501,
            address: '456 Rural Rd, Cleveland, OH 44112'
          },
          contactInfo: {
            phone: '+1 (555) 987-6543',
            email: 'info@greenvalley.com',
            contactPerson: 'Mary Johnson'
          },
          isActive: true,
          registeredAt: new Date('2024-03-20'),
          totalDonations: 78,
          lastDonation: new Date('2025-06-28')
        },
        {
          id: '3',
          name: 'Kigali Grocers',
          type: 'distributor',
          location: {
            lat: -1.9706,
            lng: 30.0719,
            address: 'KG 15 Ave, Kigali, Rwanda'
          },
          contactInfo: {
            phone: '+250 788 123 456',
            email: 'donations@kigaligrocers.rw',
            contactPerson: 'Jean Baptiste'
          },
          isActive: true,
          registeredAt: new Date('2024-02-10'),
          totalDonations: 32,
          lastDonation: new Date('2025-06-20')
        },
        {
          id: '4',
          name: 'Downtown Deli',
          type: 'restaurant',
          location: {
            lat: 40.7589,
            lng: -73.9851,
            address: '789 Broadway, New York, NY 10003'
          },
          contactInfo: {
            phone: '+1 (555) 456-7890',
            email: 'manager@downtowndeli.com',
            contactPerson: 'Sarah Wilson'
          },
          isActive: false,
          registeredAt: new Date('2024-05-12'),
          totalDonations: 12,
          lastDonation: new Date('2025-05-15')
        },
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredDonors = donors.filter(donor => {
    if (searchQuery && !donor.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !donor.location.address.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (typeFilter !== 'all' && donor.type !== typeFilter) return false
    if (statusFilter === 'active' && !donor.isActive) return false
    if (statusFilter === 'inactive' && donor.isActive) return false
    return true
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'supermarket':
        return '🏪'
      case 'farm':
        return '🚜'
      case 'distributor':
        return '🚛'
      case 'restaurant':
        return '🍽️'
      default:
        return '📦'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'supermarket':
        return 'bg-blue-100 text-blue-800'
      case 'farm':
        return 'bg-green-100 text-green-800'
      case 'distributor':
        return 'bg-purple-100 text-purple-800'
      case 'restaurant':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this donor?')) {
      setDonors(donors.filter(donor => donor.id !== id))
    }
  }

  const toggleStatus = (id: string) => {
    setDonors(donors.map(donor => 
      donor.id === id ? { ...donor, isActive: !donor.isActive } : donor
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Food Donors</h1>
              <p className="text-gray-600">Manage registered food donors and their contributions</p>
            </div>
            
            <Link
              href="/donors/register"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="mr-2 h-4 w-4" />
              Register New Donor
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search donors by name or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="lg:w-48">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Types</option>
                <option value="supermarket">Supermarkets</option>
                <option value="farm">Farms</option>
                <option value="distributor">Distributors</option>
                <option value="restaurant">Restaurants</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="lg:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <div className="text-2xl">🏪</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Donors</p>
                <p className="text-2xl font-bold text-gray-900">{donors.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <div className="text-2xl">✅</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Donors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {donors.filter(d => d.isActive).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <div className="text-2xl">📦</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Donations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {donors.reduce((sum, d) => sum + d.totalDonations, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-orange-100">
                <div className="text-2xl">📈</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Donations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {donors.length > 0 ? Math.round(donors.reduce((sum, d) => sum + d.totalDonations, 0) / donors.length) : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Donors Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading donors...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Donor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Donations
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDonors.map((donor) => (
                    <tr key={donor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-2xl mr-3">{getTypeIcon(donor.type)}</div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{donor.name}</div>
                            <div className="text-sm text-gray-500">
                              Registered {donor.registeredAt.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(donor.type)}`}>
                          {donor.type.charAt(0).toUpperCase() + donor.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                          <div className="text-sm text-gray-900 max-w-xs">
                            {donor.location.address}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {donor.contactInfo.contactPerson && (
                            <div className="text-sm font-medium text-gray-900">
                              {donor.contactInfo.contactPerson}
                            </div>
                          )}
                          {donor.contactInfo.email && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Mail className="h-3 w-3 mr-1" />
                              {donor.contactInfo.email}
                            </div>
                          )}
                          {donor.contactInfo.phone && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="h-3 w-3 mr-1" />
                              {donor.contactInfo.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="font-medium">{donor.totalDonations} total</div>
                          {donor.lastDonation && (
                            <div className="text-gray-500">
                              Last: {donor.lastDonation.toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleStatus(donor.id)}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            donor.isActive
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          } transition-colors cursor-pointer`}
                        >
                          {donor.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/donors/${donor.id}`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/donors/${donor.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(donor.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && filteredDonors.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-gray-500 mb-4">
                <div className="text-4xl mb-2">🔍</div>
                <p>No donors found matching your criteria</p>
              </div>
              <Link
                href="/donors/register"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="mr-2 h-4 w-4" />
                Register First Donor
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DonorsPage
