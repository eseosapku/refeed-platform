'use client'

import React from 'react'
import { ArrowLeft, Database, AlertTriangle, CheckCircle, ExternalLink, Shield, Calendar } from 'lucide-react'
import Link from 'next/link'

const DataSourcesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/map" className="inline-flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Map
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Data Sources & Credibility</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert Banner */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Development Data Warning</h3>
              <p className="text-red-700 mt-1">
                All data currently displayed on this platform is <strong>simulated for demonstration purposes only</strong>. 
                This data should not be used for actual food security decisions, research, or operational planning.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Status */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Current Data Status</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Food Desert Locations</h3>
                  <p className="text-gray-600 text-sm">Mock coordinates and population estimates based on general geographic knowledge</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Retailer/Donor Locations</h3>
                  <p className="text-gray-600 text-sm">Approximate store locations, not verified with official retailer APIs</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Rwanda Agricultural Data</h3>
                  <p className="text-gray-600 text-sm">Simulated crop production and export capacity data</p>
                </div>
              </div>
            </div>
          </div>

          {/* Production Data Sources */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended Production Sources</h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-green-600" />
                  USDA Food Access Research Atlas
                </h3>
                <p className="text-gray-600 text-sm">Official government food desert classifications</p>
                <a href="https://www.ers.usda.gov/data-products/food-access-research-atlas/" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center mt-1">
                  View Source <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-green-600" />
                  US Census Bureau APIs
                </h3>
                <p className="text-gray-600 text-sm">Official population and demographic data</p>
                <a href="https://www.census.gov/data/developers/data-sets.html" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center mt-1">
                  View Source <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Database className="w-4 h-4 mr-2 text-blue-600" />
                  Google Places API
                </h3>
                <p className="text-gray-600 text-sm">Real-time store locations and business data</p>
                <a href="https://developers.google.com/maps/documentation/places/web-service" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center mt-1">
                  View Source <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Data Accuracy Matrix */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Data Accuracy Assessment</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Data Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Current Source</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Accuracy</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Production Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-3 px-4">Food Desert Boundaries</td>
                  <td className="py-3 px-4">Manual estimates</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Very Low
                    </span>
                  </td>
                  <td className="py-3 px-4">USDA Food Access Research Atlas</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Population Data</td>
                  <td className="py-3 px-4">Estimated figures</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Very Low
                    </span>
                  </td>
                  <td className="py-3 px-4">US Census Bureau API</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Store Locations</td>
                  <td className="py-3 px-4">Approximate addresses</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      Low
                    </span>
                  </td>
                  <td className="py-3 px-4">Google Places API + Retailer APIs</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Store Operating Status</td>
                  <td className="py-3 px-4">Assumed active</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Very Low
                    </span>
                  </td>
                  <td className="py-3 px-4">Real-time retailer APIs</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Agricultural Production</td>
                  <td className="py-3 px-4">Simulated data</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Very Low
                    </span>
                  </td>
                  <td className="py-3 px-4">FAO Statistics + National Agriculture APIs</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Integration Timeline */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Production Data Integration Timeline</h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Government Data Integration (Weeks 1-2)</h3>
                <p className="text-gray-600 text-sm">USDA Food Access Research Atlas, US Census Bureau APIs</p>
                <p className="text-green-600 text-sm font-medium">Cost: Free</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Commercial APIs (Weeks 3-4)</h3>
                <p className="text-gray-600 text-sm">Google Places API, major retailer store locator APIs</p>
                <p className="text-orange-600 text-sm font-medium">Cost: $200-500/month</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Data Validation & Quality (Weeks 5-6)</h3>
                <p className="text-gray-600 text-sm">Implement data validation, error handling, and quality metrics</p>
                <p className="text-blue-600 text-sm font-medium">Cost: Development time</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">International Data (Weeks 7-8)</h3>
                <p className="text-gray-600 text-sm">Rwanda Ministry of Agriculture, FAO statistics</p>
                <p className="text-green-600 text-sm font-medium">Cost: Free (government sources)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-blue-900 mb-2">Need Help with Data Integration?</h2>
          <p className="text-blue-800 mb-4">
            For assistance with implementing production-grade data sources, contact our development team or 
            consult the documentation links provided above.
          </p>
          <div className="flex space-x-4">
            <Link href="/map" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Map
            </Link>
            <a href="mailto:dev@refeed-platform.com" className="inline-flex items-center px-4 py-2 bg-white text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50">
              Contact Development Team
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataSourcesPage
