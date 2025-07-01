'use client'

import { useState, useEffect } from 'react'
import { 
  Download, 
  Database, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Play,
  FileText,
  Globe,
  TrendingUp
} from 'lucide-react'

interface KaggleSetupStatus {
  installed: boolean
  configured: boolean
  message: string
}

interface DatasetStatus {
  dataset: string
  downloaded: boolean
  files: string[]
}

interface KaggleIntegrationStatus {
  kaggleSetup: KaggleSetupStatus
  datasets: DatasetStatus[]
}

const KaggleIntegrationPanel = () => {
  const [status, setStatus] = useState<KaggleIntegrationStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [processingDataset, setProcessingDataset] = useState<string | null>(null)
  const [processResults, setProcessResults] = useState<any>(null)

  // Load Kaggle integration status
  const loadStatus = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/kaggle?action=status')
      const data = await response.json()
      
      if (data.success) {
        setStatus(data)
      }
    } catch (error) {
      console.error('Failed to load Kaggle status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadStatus()
  }, [])

  // Download all high priority datasets
  const downloadAllHighPriority = async () => {
    try {
      setProcessingDataset('Downloading all high priority datasets...')
      
      const response = await fetch('/api/kaggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'download-all-high-priority' })
      })
      
      const result = await response.json()
      setProcessResults(result)
      
      // Reload status
      await loadStatus()
    } catch (error) {
      console.error('Download failed:', error)
      setProcessResults({ success: false, error: 'Download failed' })
    } finally {
      setProcessingDataset(null)
    }
  }

  // Process a specific dataset
  const processDataset = async (action: string, datasetName: string) => {
    try {
      setProcessingDataset(`Processing ${datasetName}...`)
      
      const response = await fetch('/api/kaggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action })
      })

      const result = await response.json()
      setProcessResults(result)
    } catch (error) {
      console.error(`Processing ${datasetName} failed:`, error)
      setProcessResults({ success: false, error: `Processing ${datasetName} failed` })
    } finally {
      setProcessingDataset(null)
    }
  }

  // Download processed data as CSV
  const downloadCSV = async () => {
    try {
      const response = await fetch('/api/food-deserts/download?kaggle=true')
      
      if (!response.ok) {
        throw new Error('Failed to download CSV')
      }
      
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'food-deserts-kaggle-data.csv'
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading CSV:', error)
      alert('Failed to download CSV file. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin text-primary-600 mr-2" />
        <span className="text-gray-600">Loading Kaggle integration status...</span>
      </div>
    )
  }

  if (!status) {
    return (
      <div className="text-center py-8 text-red-600">
        Failed to load Kaggle integration status
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Setup Status */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Kaggle CLI Setup
        </h3>
        
        <div className="flex items-center mb-2">
          {status.kaggleSetup.installed ? (
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          )}
          <span className={status.kaggleSetup.installed ? 'text-green-700' : 'text-red-700'}>
            Kaggle CLI {status.kaggleSetup.installed ? 'Installed' : 'Not Installed'}
          </span>
        </div>
        
        <div className="flex items-center mb-3">
          {status.kaggleSetup.configured ? (
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
          )}
          <span className={status.kaggleSetup.configured ? 'text-green-700' : 'text-yellow-700'}>
            API {status.kaggleSetup.configured ? 'Configured' : 'Not Configured'}
          </span>
        </div>
        
        <p className="text-sm text-gray-600">{status.kaggleSetup.message}</p>
        
        {!status.kaggleSetup.configured && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Setup Required:</strong> Run <code className="bg-yellow-100 px-1 rounded">node setup-kaggle.js</code> to configure Kaggle CLI
            </p>
          </div>
        )}
      </div>

      {/* Datasets Status */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Dataset Status
        </h3>
        
        <div className="space-y-3">
          {status.datasets.map((dataset, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center">
                {dataset.downloaded ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-gray-400 mr-3" />
                )}
                <div>
                  <p className="font-medium text-gray-900">{dataset.dataset}</p>
                  <p className="text-sm text-gray-600">
                    {dataset.downloaded ? `${dataset.files.length} files downloaded` : 'Not downloaded'}
                  </p>
                </div>
              </div>
              
              {dataset.downloaded && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Ready
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Play className="h-5 w-5 mr-2" />
          Actions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Download Datasets */}
          <button
            onClick={downloadAllHighPriority}
            disabled={!status.kaggleSetup.configured || !!processingDataset}
            className="flex items-center justify-center px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="h-5 w-5 mr-2" />
            Download All High Priority
          </button>

          {/* Download CSV */}
          <button
            onClick={downloadCSV}
            disabled={!!processingDataset}
            className="flex items-center justify-center px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <FileText className="h-5 w-5 mr-2" />
            Download Food Deserts CSV
          </button>

          {/* Process Food Deserts */}
          <button
            onClick={() => processDataset('process-food-deserts', 'Food Deserts')}
            disabled={!!processingDataset}
            className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Globe className="h-5 w-5 mr-2" />
            Process Food Deserts
          </button>

          {/* Process US Prices */}
          <button
            onClick={() => processDataset('process-us-prices', 'US Prices')}
            disabled={!!processingDataset}
            className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <TrendingUp className="h-5 w-5 mr-2" />
            Process US Prices
          </button>

          {/* Process Global Prices */}
          <button
            onClick={() => processDataset('process-global-prices', 'Global Prices')}
            disabled={!!processingDataset}
            className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Globe className="h-5 w-5 mr-2" />
            Process Global Prices
          </button>
        </div>
        
        {/* Processing Status */}
        {processingDataset && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded flex items-center">
            <RefreshCw className="h-5 w-5 animate-spin text-blue-600 mr-2" />
            <span className="text-blue-800">{processingDataset}</span>
          </div>
        )}
        
        {/* Process Results */}
        {processResults && !processingDataset && (
          <div className={`mt-4 p-3 border rounded ${
            processResults.success 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <p className="font-medium">
              {processResults.success ? '✅ Success' : '❌ Error'}
            </p>
            <p className="text-sm mt-1">{processResults.message}</p>
            
            {processResults.success && processResults.total && (
              <div className="mt-2 text-sm">
                <p><strong>Total Records:</strong> {processResults.total}</p>
                {processResults.data && (
                  <p><strong>Preview:</strong> Showing first {processResults.data.length} records</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={loadStatus}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Status
        </button>
      </div>
    </div>
  )
}

export default KaggleIntegrationPanel
