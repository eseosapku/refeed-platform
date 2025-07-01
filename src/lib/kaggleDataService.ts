// Kaggle Dataset Integration Service
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'

const execAsync = promisify(exec)

interface KaggleDataset {
  id: string
  name: string
  files: string[]
  downloadPath: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
}

export class KaggleDataService {
  private datasetsConfig: KaggleDataset[] = [
    {
      id: 'tcrammond/food-access-and-food-deserts',
      name: 'Food Access and Food Deserts',
      files: ['food_access_research_atlas.csv'],
      downloadPath: './data/kaggle/food-deserts',
      priority: 'HIGH'
    },
    {
      id: 'laurenainsleyhaines/united-states-fruit-and-vegetable-prices',
      name: 'US Fruit and Vegetable Prices',
      files: ['ALL FRUITS – Average prices (CSV format).csv', 'ALL VEGETABLES – Average prices (CSV format).csv'],
      downloadPath: './data/kaggle/us-prices',
      priority: 'HIGH'
    },
    {
      id: 'alhamomarhotaki/global-food-prices-database-wfp',
      name: 'Global Food Prices (WFP)',
      files: ['globalfoodprices_wfp.csv'],
      downloadPath: './data/kaggle/global-prices',
      priority: 'HIGH'
    },
    {
      id: 'usmanlovescode/rwanda-food-prices-dataset',
      name: 'Rwanda Food Prices',
      files: ['*.csv'],
      downloadPath: './data/kaggle/rwanda-prices',
      priority: 'MEDIUM'
    },
    {
      id: 'joebeachcapital/food-waste',
      name: 'Food Waste Data',
      files: ['*.csv'],
      downloadPath: './data/kaggle/food-waste',
      priority: 'MEDIUM'
    }
  ]

  constructor() {
    this.ensureDataDirectories()
  }

  // Ensure all data directories exist
  private ensureDataDirectories() {
    this.datasetsConfig.forEach(dataset => {
      const dir = path.resolve(dataset.downloadPath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
    })
  }

  // Check if Kaggle CLI is installed and configured
  async checkKaggleSetup(): Promise<{ installed: boolean, configured: boolean, message: string }> {
    try {
      // Try different ways to access Kaggle
      const pythonCommands = [
        'python -c "import kaggle; print(\'installed\')"',
        'python3 -c "import kaggle; print(\'installed\')"',
        'py -c "import kaggle; print(\'installed\')"'
      ]
      
      let installed = false
      for (const cmd of pythonCommands) {
        try {
          await execAsync(cmd)
          installed = true
          break
        } catch (error) {
          // Try next command
        }
      }
      
      if (!installed) {
        return {
          installed: false,
          configured: false,
          message: 'Kaggle package not found. Please install with: pip install kaggle'
        }
      }
      
      // Check if API key is configured by checking for kaggle.json file
      const os = require('os')
      const path = require('path')
      const fs = require('fs')
      
      const kaggleJsonPath = path.join(os.homedir(), '.kaggle', 'kaggle.json')
      
      if (fs.existsSync(kaggleJsonPath)) {
        try {
          const content = fs.readFileSync(kaggleJsonPath, 'utf8')
          const parsed = JSON.parse(content)
          
          if (parsed.username && parsed.key) {
            return {
              installed: true,
              configured: true,
              message: `Kaggle CLI is installed and configured for user: ${parsed.username}`
            }
          }
        } catch (error) {
          // Invalid JSON
        }
      }
      
      return {
        installed: true,
        configured: false,
        message: 'Kaggle package installed but API key not configured. Please add your kaggle.json file.'
      }
      
    } catch (error) {
      return {
        installed: false,
        configured: false,
        message: 'Kaggle package not found. Please install with: pip install kaggle'
      }
    }
  }

  // Download a specific dataset
  async downloadDataset(datasetId: string): Promise<{ success: boolean, message: string, files: string[] }> {
    try {
      const dataset = this.datasetsConfig.find(d => d.id === datasetId)
      if (!dataset) {
        throw new Error(`Dataset ${datasetId} not found in configuration`)
      }

      const downloadPath = path.resolve(dataset.downloadPath)
      
      console.log(`Downloading ${dataset.name}...`)
      
      // Try different Python commands to download via kaggle API
      const downloadCommand = `python -c "import kaggle; kaggle.api.authenticate(); kaggle.api.dataset_download_files('${dataset.id}', path='${downloadPath.replace(/\\/g, '/')}', unzip=True)"`
      
      await execAsync(downloadCommand)

      // List downloaded files
      const files = fs.readdirSync(downloadPath).filter(file => file.endsWith('.csv'))

      return {
        success: true,
        message: `Successfully downloaded ${dataset.name}`,
        files
      }
    } catch (error) {
      return {
        success: false,
        message: `Failed to download dataset: ${error}`,
        files: []
      }
    }
  }

  // Download all high priority datasets
  async downloadAllHighPriority(): Promise<{ success: boolean, results: any[] }> {
    const highPriorityDatasets = this.datasetsConfig.filter(d => d.priority === 'HIGH')
    const results = []

    for (const dataset of highPriorityDatasets) {
      console.log(`Processing ${dataset.name}...`)
      const result = await this.downloadDataset(dataset.id)
      results.push({ dataset: dataset.name, ...result })
      
      // Add delay between downloads to be respectful to Kaggle
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    const allSuccessful = results.every(r => r.success)
    return { success: allSuccessful, results }
  }

  // Process Food Desert data
  async processFoodDesertData(): Promise<any[]> {
    const filePath = path.resolve('./data/kaggle/food-deserts/food_access_research_atlas.csv')
    
    if (!fs.existsSync(filePath)) {
      throw new Error('Food desert data not found. Please download first.')
    }

    return new Promise((resolve, reject) => {
      const results: any[] = []
      let recordIndex = 0 // Add counter to ensure unique IDs
      
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data: any) => {
          // Process food desert data - check for low access areas
          if (data.LILATracts_1And10 && parseInt(data.LILATracts_1And10) > 0) {
            recordIndex++
            // Create a more meaningful ID using available data
            const censusTract = data.CensusTract && data.CensusTract.trim() ? data.CensusTract.trim() : null
            const state = data.State && data.State.trim() ? data.State.trim().replace(/\s+/g, '') : 'UnknownState'
            const county = data.County && data.County.trim() ? data.County.trim().replace(/\s+/g, '') : 'UnknownCounty'
            
            const uniqueId = censusTract 
              ? `kaggle_${state}_${county}_${censusTract}`
              : `kaggle_${state}_${county}_${recordIndex}`
              
            // Generate precise coordinates using census tract FIPS code
            const { lat, lng } = this.getCensusTractCoordinates(censusTract, data.State, data.County)
            
            // Create more specific name using census tract
            const tractDisplayName = censusTract ? censusTract.slice(-6) : `Area-${recordIndex}` // Last 6 digits for display
            const specificName = `Census Tract ${tractDisplayName}, ${data.County} County, ${data.State}`
            
            results.push({
              id: uniqueId,
              name: specificName,
              censusTract: censusTract,
              type: 'food_desert',
              country: 'USA',
              state: data.State,
              county: data.County,
              population: parseInt(data.POP2010) || 0,
              lowAccessNumbers: parseInt(data.LILATracts_1And10) || 0,
              severity: this.calculateSeverity(data),
              coordinates: [lat, lng],
              // Create very small polygon for census tract precision (roughly 0.5-1 mile square)
              polygon: {
                type: 'Polygon',
                coordinates: [[
                  [lng - 0.003, lat - 0.003], // Very small polygons for tract-level precision
                  [lng + 0.003, lat - 0.003], 
                  [lng + 0.003, lat + 0.003],
                  [lng - 0.003, lat + 0.003],
                  [lng - 0.003, lat - 0.003]
                ]]
              },
              demographics: {
                lowIncome: parseInt(data.TractLOWI) || 0,
                seniors: parseInt(data.TractSeniors) || 0,
                children: parseInt(data.TractKids) || 0,
                vehicles: parseInt(data.TractHUNV) || 0
              },
              access: {
                oneHalf: parseInt(data.LATracts_half) || 0,
                one: parseInt(data.LATracts1) || 0,
                ten: parseInt(data.LATracts10) || 0,
                twenty: parseInt(data.LATracts20) || 0
              }
            })
          }
        })
        .on('end', () => {
          console.log(`Processed ${results.length} food desert locations`)
          resolve(results)
        })
        .on('error', reject)
    })
  }

  // Process US Price data
  async processUSPriceData(): Promise<{ fruits: any[], vegetables: any[] }> {
    const fruitsPath = path.resolve('./data/kaggle/us-prices/ALL FRUITS – Average prices (CSV format).csv')
    const vegetablesPath = path.resolve('./data/kaggle/us-prices/ALL VEGETABLES – Average prices (CSV format).csv')

    const [fruits, vegetables] = await Promise.all([
      this.processPriceFile(fruitsPath, 'fruit'),
      this.processPriceFile(vegetablesPath, 'vegetable')
    ])

    return { fruits, vegetables }
  }

  // Process Global Price data
  async processGlobalPriceData(): Promise<any[]> {
    const filePath = path.resolve('./data/kaggle/global-prices/globalfoodprices_wfp.csv')
    
    if (!fs.existsSync(filePath)) {
      throw new Error('Global price data not found. Please download first.')
    }

    return new Promise((resolve, reject) => {
      const results: any[] = []
      
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data: any) => {
          results.push({
            id: `global_${data.admin1}_${data.market}_${data.commodity}`,
            country: data.admin1,
            market: data.market,
            commodity: data.commodity,
            date: data.date,
            price: parseFloat(data.price) || 0,
            currency: data.currency,
            unit: data.unit,
            category: data.category,
            subcategory: data.subcategory
          })
        })
        .on('end', () => {
          console.log(`Processed ${results.length} global price records`)
          resolve(results)
        })
        .on('error', reject)
    })
  }

  // Helper: Process price CSV file
  private processPriceFile(filePath: string, type: 'fruit' | 'vegetable'): Promise<any[]> {
    if (!fs.existsSync(filePath)) {
      return Promise.resolve([])
    }

    return new Promise((resolve, reject) => {
      const results: any[] = []
      
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data: any) => {
          results.push({
            id: `us_${type}_${data.Commodity?.replace(/[^a-zA-Z0-9]/g, '_')}`,
            name: data.Commodity,
            type,
            prices: {
              retail_2013: parseFloat(data['RetailPrice2013']) || 0,
              retail_2016: parseFloat(data['RetailPrice2016']) || 0,
              retail_2020: parseFloat(data['RetailPrice2020']) || 0,
              retail_2022: parseFloat(data['RetailPrice2022']) || 0,
              cup_2013: parseFloat(data['Cup2013']) || 0,
              cup_2016: parseFloat(data['Cup2016']) || 0,
              cup_2020: parseFloat(data['Cup2020']) || 0,
              cup_2022: parseFloat(data['Cup2022']) || 0
            },
            unit: data.Unit || 'pound',
            form: data.Form || 'fresh',
            lastUpdated: new Date().toISOString()
          })
        })
        .on('end', () => {
          console.log(`Processed ${results.length} ${type} price records`)
          resolve(results)
        })
        .on('error', reject)
    })
  }

  // Helper: Calculate food desert severity
  private calculateSeverity(data: any): 'high' | 'medium' | 'low' {
    const lowAccessTract = parseInt(data.LILATracts_1And10) || 0
    const totalPop = parseInt(data.POP2010) || 1
    const povertyRate = parseFloat(data.PovertyRate) || 0
    
    // Calculate severity based on multiple factors
    if (lowAccessTract > 0 && povertyRate > 20) return 'high'
    if (lowAccessTract > 0 && povertyRate > 10) return 'medium'
    return 'low'
  }

  // Get download status for all datasets
  getDownloadStatus(): { dataset: string, downloaded: boolean, files: string[] }[] {
    return this.datasetsConfig.map(dataset => {
      const downloadPath = path.resolve(dataset.downloadPath)
      const downloaded = fs.existsSync(downloadPath)
      const files = downloaded ? 
        fs.readdirSync(downloadPath).filter(file => file.endsWith('.csv')) : 
        []

      return {
        dataset: dataset.name,
        downloaded,
        files
      }
    })
  }

  // Helper method to get approximate state center coordinates
  private getStateCoordinates(stateName: string): { lat: number, lng: number } {
    const stateCoords: { [key: string]: { lat: number, lng: number } } = {
      'Alabama': { lat: 32.806671, lng: -86.791130 },
      'Alaska': { lat: 61.370716, lng: -152.404419 },
      'Arizona': { lat: 33.729759, lng: -111.431221 },
      'Arkansas': { lat: 34.969704, lng: -92.373123 },
      'California': { lat: 36.116203, lng: -119.681564 },
      'Colorado': { lat: 39.059811, lng: -105.311104 },
      'Connecticut': { lat: 41.597782, lng: -72.755371 },
      'Delaware': { lat: 39.318523, lng: -75.507141 },
      'Florida': { lat: 27.766279, lng: -81.686783 },
      'Georgia': { lat: 33.040619, lng: -83.643074 },
      'Hawaii': { lat: 21.094318, lng: -157.498337 },
      'Idaho': { lat: 44.240459, lng: -114.478828 },
      'Illinois': { lat: 40.349457, lng: -88.986137 },
      'Indiana': { lat: 39.790942, lng: -86.147685 },
      'Iowa': { lat: 42.011539, lng: -93.210526 },
      'Kansas': { lat: 38.526600, lng: -96.726486 },
      'Kentucky': { lat: 37.668140, lng: -84.670067 },
      'Louisiana': { lat: 31.169546, lng: -91.867805 },
      'Maine': { lat: 44.693947, lng: -69.381927 },
      'Maryland': { lat: 39.063946, lng: -76.802101 },
      'Massachusetts': { lat: 42.230171, lng: -71.530106 },
      'Michigan': { lat: 43.326618, lng: -84.536095 },
      'Minnesota': { lat: 45.694454, lng: -93.900192 },
      'Mississippi': { lat: 32.741646, lng: -89.678696 },
      'Missouri': { lat: 38.456085, lng: -92.288368 },
      'Montana': { lat: 47.052952, lng: -110.454353 },
      'Nebraska': { lat: 41.125370, lng: -98.268082 },
      'Nevada': { lat: 38.313515, lng: -117.055374 },
      'New Hampshire': { lat: 43.452492, lng: -71.563896 },
      'New Jersey': { lat: 40.298904, lng: -74.756138 },
      'New Mexico': { lat: 34.840515, lng: -106.248482 },
      'New York': { lat: 42.165726, lng: -74.948051 },
      'North Carolina': { lat: 35.630066, lng: -79.806419 },
      'North Dakota': { lat: 47.528912, lng: -99.784012 },
      'Ohio': { lat: 40.388783, lng: -82.764915 },
      'Oklahoma': { lat: 35.565342, lng: -96.928917 },
      'Oregon': { lat: 44.931109, lng: -123.029159 },
      'Pennsylvania': { lat: 40.590752, lng: -77.209755 },
      'Rhode Island': { lat: 41.680893, lng: -71.51178 },
      'South Carolina': { lat: 33.856892, lng: -80.945007 },
      'South Dakota': { lat: 44.299782, lng: -99.438828 },
      'Tennessee': { lat: 35.747845, lng: -86.692345 },
      'Texas': { lat: 31.054487, lng: -97.563461 },
      'Utah': { lat: 40.150032, lng: -111.862434 },
      'Vermont': { lat: 44.045876, lng: -72.710686 },
      'Virginia': { lat: 37.769337, lng: -78.169968 },
      'Washington': { lat: 47.400902, lng: -121.490494 },
      'West Virginia': { lat: 38.491226, lng: -80.954453 },
      'Wisconsin': { lat: 44.268543, lng: -89.616508 },
      'Wyoming': { lat: 42.755966, lng: -107.302490 }
    }
    
    return stateCoords[stateName] || { lat: 39.8283, lng: -98.5795 } // Default to US center
  }

  // Helper method to get more specific county coordinates
  private getCountyCoordinates(stateName: string, countyName: string): { lat: number, lng: number } {
    // Major county coordinates for more accurate positioning
    const countyCoords: { [key: string]: { lat: number, lng: number } } = {
      // California counties
      'California-Los Angeles': { lat: 34.0522, lng: -118.2437 },
      'California-Orange': { lat: 33.7175, lng: -117.8311 },
      'California-San Diego': { lat: 32.7157, lng: -117.1611 },
      'California-Riverside': { lat: 33.7208, lng: -116.2158 },
      'California-San Bernardino': { lat: 34.1083, lng: -117.2898 },
      'California-Santa Clara': { lat: 37.3541, lng: -121.9552 },
      'California-Alameda': { lat: 37.6017, lng: -121.7195 },
      'California-Sacramento': { lat: 38.5816, lng: -121.4944 },
      
      // New York counties  
      'New York-New York': { lat: 40.7831, lng: -73.9712 }, // Manhattan
      'New York-Kings': { lat: 40.6782, lng: -73.9442 }, // Brooklyn
      'New York-Queens': { lat: 40.7282, lng: -73.7949 },
      'New York-Bronx': { lat: 40.8448, lng: -73.8648 },
      'New York-Richmond': { lat: 40.5795, lng: -74.1502 }, // Staten Island
      
      // Texas counties
      'Texas-Harris': { lat: 29.7604, lng: -95.3698 }, // Houston
      'Texas-Dallas': { lat: 32.7767, lng: -96.7970 },
      'Texas-Tarrant': { lat: 32.7555, lng: -97.3308 }, // Fort Worth
      'Texas-Bexar': { lat: 29.4241, lng: -98.4936 }, // San Antonio
      'Texas-Travis': { lat: 30.2672, lng: -97.7431 }, // Austin
      
      // Florida counties
      'Florida-Miami-Dade': { lat: 25.7617, lng: -80.1918 },
      'Florida-Broward': { lat: 26.1901, lng: -80.3659 },
      'Florida-Palm Beach': { lat: 26.7153, lng: -80.0534 },
      'Florida-Hillsborough': { lat: 27.9506, lng: -82.4572 }, // Tampa
      'Florida-Orange': { lat: 28.5383, lng: -81.3792 }, // Orlando
      
      // Illinois counties
      'Illinois-Cook': { lat: 41.8781, lng: -87.6298 }, // Chicago
      
      // And more major counties...
    }
    
    const key = `${stateName}-${countyName}`
    
    // If we have specific county coordinates, use them
    if (countyCoords[key]) {
      return countyCoords[key]
    }
    
    // Otherwise, fall back to state coordinates with some county-level variation
    const stateCoords = this.getStateCoordinates(stateName)
    return {
      lat: stateCoords.lat + (Math.random() - 0.5) * 1.0, // Moderate variation within state
      lng: stateCoords.lng + (Math.random() - 0.5) * 1.5
    }
  }

  // Helper method to get precise coordinates for census tracts using FIPS codes
  private getCensusTractCoordinates(censusTract: string | null, stateName: string, countyName: string): { lat: number, lng: number } {
    if (!censusTract || censusTract.length !== 11) {
      // Fall back to county coordinates if census tract is invalid
      return this.getCountyCoordinates(stateName, countyName)
    }

    // Census tract FIPS structure: SSCCCTTTTTT
    // SS = State FIPS, CCC = County FIPS, TTTTTT = Census Tract
    const stateFips = censusTract.substring(0, 2)
    const countyFips = censusTract.substring(2, 5)
    const tractFips = censusTract.substring(5, 11)

    // Get base county coordinates
    const countyCoords = this.getCountyCoordinates(stateName, countyName)
    
    // Generate deterministic but varied coordinates within the county based on tract FIPS
    // This creates consistent positioning for the same tract across runs
    const tractNum = parseInt(tractFips, 10)
    const tractHash = this.simpleHash(censusTract)
    
    // Create smaller variations within county bounds (roughly 5-15 mile variations)
    const latVariation = ((tractHash % 1000) / 1000 - 0.5) * 0.3 // ~10-15 mile variation
    const lngVariation = ((Math.floor(tractHash / 1000) % 1000) / 1000 - 0.5) * 0.4 // ~15-20 mile variation
    
    return {
      lat: countyCoords.lat + latVariation,
      lng: countyCoords.lng + lngVariation
    }
  }

  // Simple hash function for deterministic coordinate generation
  private simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash)
  }
}

export const kaggleDataService = new KaggleDataService()
