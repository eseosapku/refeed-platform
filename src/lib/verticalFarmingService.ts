// Vertical Farming Container Service

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
  suitability_score: number // 0-100
  yield_per_cycle_kg: number
  growth_time_days: number
  nutritional_value: 'high' | 'medium' | 'low'
  local_demand: 'high' | 'medium' | 'low'
  reason: string
}

interface ClimateData {
  zone: string
  avg_temp_f: number
  humidity: number
  sunlight_hours: number
  rainfall_inches: number
}

interface MockFoodDesert {
  id: string
  name: string
  state: string
  county: string
  coordinates: [number, number]
  population: number
  severity: 'high' | 'medium' | 'low'
  demographics: {
    children: number
    seniors: number
    households: number
  }
}

export class VerticalFarmingService {
  
  // AI-powered crop recommendation system
  private generateCropRecommendations(
    location: { state: string, county: string, coordinates: [number, number] },
    population: number,
    demographics: any
  ): CropRecommendation[] {
    
    const climate = this.getClimateData(location.state, location.coordinates)
    const recommendations: CropRecommendation[] = []

    // High-yield, nutritious crops suitable for vertical farming
    const cropDatabase = [
      {
        name: 'Leafy Greens (Lettuce, Spinach, Kale)',
        base_yield: 25,
        growth_days: 30,
        climate_preference: ['temperate', 'cool'],
        nutritional_value: 'high',
        local_demand_boost: demographics.children > 2000 ? 15 : 0
      },
      {
        name: 'Herbs (Basil, Cilantro, Parsley)',
        base_yield: 15,
        growth_days: 25,
        climate_preference: ['warm', 'temperate'],
        nutritional_value: 'medium',
        local_demand_boost: demographics.seniors > 1500 ? 10 : 0
      },
      {
        name: 'Tomatoes (Cherry, Roma)',
        base_yield: 45,
        growth_days: 65,
        climate_preference: ['warm'],
        nutritional_value: 'high',
        local_demand_boost: population > 10000 ? 20 : 0
      },
      {
        name: 'Peppers (Bell, Hot)',
        base_yield: 35,
        growth_days: 70,
        climate_preference: ['warm', 'hot'],
        nutritional_value: 'high',
        local_demand_boost: 0
      },
      {
        name: 'Strawberries',
        base_yield: 20,
        growth_days: 45,
        climate_preference: ['temperate'],
        nutritional_value: 'high',
        local_demand_boost: demographics.children > 1000 ? 25 : 0
      },
      {
        name: 'Microgreens',
        base_yield: 12,
        growth_days: 14,
        climate_preference: ['any'],
        nutritional_value: 'high',
        local_demand_boost: 5
      }
    ]

    cropDatabase.forEach(crop => {
      const climate_match = this.calculateClimateMatch(crop.climate_preference, climate)
      const base_score = climate_match * 0.4 + 
                        (crop.nutritional_value === 'high' ? 30 : crop.nutritional_value === 'medium' ? 20 : 10) * 0.3 +
                        (crop.base_yield / 50) * 20 * 0.3

      const suitability_score = Math.min(100, Math.round(base_score + crop.local_demand_boost))
      
      if (suitability_score >= 60) {
        recommendations.push({
          crop: crop.name,
          suitability_score,
          yield_per_cycle_kg: crop.base_yield,
          growth_time_days: crop.growth_days,
          nutritional_value: crop.nutritional_value as 'high' | 'medium' | 'low',
          local_demand: this.calculateLocalDemand(crop, population, demographics),
          reason: this.generateRecommendationReason(crop, climate_match, suitability_score, demographics)
        })
      }
    })

    return recommendations.sort((a, b) => b.suitability_score - a.suitability_score).slice(0, 4)
  }

  private getClimateData(state: string, coordinates: [number, number]): ClimateData {
    // Simplified climate zones based on US regions
    const climateZones: { [key: string]: ClimateData } = {
      'California': { zone: 'mediterranean', avg_temp_f: 68, humidity: 60, sunlight_hours: 8.5, rainfall_inches: 15 },
      'Florida': { zone: 'subtropical', avg_temp_f: 78, humidity: 75, sunlight_hours: 7.5, rainfall_inches: 55 },
      'Texas': { zone: 'hot_arid', avg_temp_f: 75, humidity: 65, sunlight_hours: 8, rainfall_inches: 30 },
      'New York': { zone: 'temperate', avg_temp_f: 60, humidity: 70, sunlight_hours: 6.5, rainfall_inches: 45 },
      'Illinois': { zone: 'continental', avg_temp_f: 58, humidity: 68, sunlight_hours: 6, rainfall_inches: 38 },
      'Washington': { zone: 'oceanic', avg_temp_f: 56, humidity: 78, sunlight_hours: 5.5, rainfall_inches: 40 }
    }

    return climateZones[state] || { zone: 'temperate', avg_temp_f: 65, humidity: 65, sunlight_hours: 7, rainfall_inches: 35 }
  }

  private calculateClimateMatch(preferences: string[], climate: ClimateData): number {
    const zoneMatches: { [key: string]: string[] } = {
      'mediterranean': ['warm', 'temperate'],
      'subtropical': ['hot', 'warm'],
      'hot_arid': ['hot', 'warm'],
      'temperate': ['temperate', 'cool'],
      'continental': ['cool', 'temperate'],
      'oceanic': ['cool', 'temperate']
    }

    const matches = zoneMatches[climate.zone] || ['temperate']
    const hasMatch = preferences.some(pref => matches.includes(pref) || pref === 'any')
    return hasMatch ? 85 : 60
  }

  private calculateLocalDemand(crop: any, population: number, demographics: any): 'high' | 'medium' | 'low' {
    if (crop.name.includes('Strawberries') && demographics.children > 1500) return 'high'
    if (crop.name.includes('Leafy Greens') && demographics.seniors > 2000) return 'high'
    if (population > 15000) return 'high'
    if (population > 8000) return 'medium'
    return 'low'
  }

  private generateRecommendationReason(crop: any, climateMatch: number, score: number, demographics: any): string {
    const reasons = []
    
    if (climateMatch > 80) reasons.push('excellent climate match')
    if (crop.nutritional_value === 'high') reasons.push('high nutritional value')
    if (crop.growth_days < 40) reasons.push('fast growing cycle')
    if (crop.name.includes('Leafy Greens') && demographics.children > 1000) reasons.push('high demand from families')
    if (crop.name.includes('Herbs') && demographics.seniors > 1500) reasons.push('popular with older residents')
    
    return reasons.length > 0 ? reasons.join(', ') : 'suitable for vertical farming'
  }

  // Calculate impact of container placement
  private calculateImpactReduction(
    currentSeverity: 'high' | 'medium' | 'low',
    population: number,
    monthlyYield: number,
    demographics: any
  ): { projected_severity: 'high' | 'medium' | 'low', reduction_percentage: number, population_served: number } {
    
    // Calculate fresh produce need (rough estimate: 50kg fresh produce per person per year)
    const annual_need_kg = population * 50
    const container_annual_yield = monthlyYield * 12
    
    // Calculate coverage percentage
    const coverage_percentage = Math.min(100, (container_annual_yield / annual_need_kg) * 100)
    
    let projected_severity: 'high' | 'medium' | 'low' = currentSeverity
    let reduction_percentage = Math.round(coverage_percentage * 0.6) // Conservative estimate
    
    // Determine new severity level
    if (currentSeverity === 'high') {
      if (coverage_percentage >= 40) {
        projected_severity = 'medium'
        reduction_percentage = Math.max(reduction_percentage, 35)
      } else if (coverage_percentage >= 20) {
        reduction_percentage = Math.max(reduction_percentage, 20)
      }
    } else if (currentSeverity === 'medium') {
      if (coverage_percentage >= 60) {
        projected_severity = 'low'
        reduction_percentage = Math.max(reduction_percentage, 45)
      }
    }

    const population_served = Math.round(population * (coverage_percentage / 100))
    
    return { projected_severity, reduction_percentage, population_served }
  }

  // Generate container recommendations for high-severity food deserts
  async generateContainerRecommendations(): Promise<FarmingContainer[]> {
    try {
      // Use mock high-severity food desert data for deployment
      const highSeverityDeserts = this.getMockHighSeverityDeserts()

      const containers: FarmingContainer[] = []
      let containerId = 1

      highSeverityDeserts.forEach((desert: MockFoodDesert) => {
        // Generate crop recommendations using AI
        const cropRecommendations = this.generateCropRecommendations(
          {
            state: desert.state,
            county: desert.county,
            coordinates: desert.coordinates
          },
          desert.population,
          desert.demographics
        )

        // Calculate container specifications
        const monthly_yield = cropRecommendations.reduce((sum, crop) => sum + crop.yield_per_cycle_kg, 0) * 1.5 // Multiple cycles
        const impact = this.calculateImpactReduction(
          desert.severity,
          desert.population,
          monthly_yield,
          desert.demographics
        )

        // Add current severity to impact object
        const fullImpact = {
          current_severity: desert.severity,
          ...impact
        }

        // Determine container type based on location and needs
        const containerType = this.selectContainerType(desert.population, cropRecommendations)
        
        containers.push({
          id: `vf_container_${containerId.toString().padStart(3, '0')}`,
          name: `Vertical Farm - ${desert.name}`,
          type: containerType,
          coordinates: desert.coordinates,
          foodDesertId: desert.id,
          status: 'planned',
          capacity: {
            monthly_yield_kg: Math.round(monthly_yield),
            crop_types: cropRecommendations.length,
            growing_cycles_per_year: 12
          },
          recommendations: cropRecommendations,
          impact: fullImpact,
          installation: {
            cost_estimate: this.calculateInstallationCost(containerType, monthly_yield),
            installation_time_weeks: containerType === 'vertical_farm' ? 8 : 6,
            maintenance_cost_annual: this.calculateMaintenanceCost(containerType, monthly_yield)
          }
        })

        containerId++
      })

      // Sort by impact potential (highest reduction percentage first)
      return containers.sort((a, b) => b.impact.reduction_percentage - a.impact.reduction_percentage)
      
    } catch (error) {
      console.error('Error generating container recommendations:', error)
      return []
    }
  }

  private selectContainerType(population: number, crops: CropRecommendation[]): 'vertical_farm' | 'hydroponic' | 'aeroponic' {
    if (population > 15000) return 'vertical_farm' // Large scale
    if (crops.some(c => c.crop.includes('Tomatoes') || c.crop.includes('Peppers'))) return 'hydroponic'
    return 'aeroponic' // Best for leafy greens and herbs
  }

  private calculateInstallationCost(type: 'vertical_farm' | 'hydroponic' | 'aeroponic', yieldAmount: number): number {
    const baseCosts = {
      'vertical_farm': 150000,
      'hydroponic': 80000,
      'aeroponic': 60000
    }
    
    return baseCosts[type] + (yieldAmount * 500) // Additional cost per kg capacity
  }

  private calculateMaintenanceCost(type: 'vertical_farm' | 'hydroponic' | 'aeroponic', yieldAmount: number): number {
    const baseMaintenanceCosts = {
      'vertical_farm': 25000,
      'hydroponic': 15000,
      'aeroponic': 12000
    }
    
    return baseMaintenanceCosts[type] + (yieldAmount * 100) // Additional annual cost per kg capacity
  }

  // Get existing containers - generate multiple containers for each high-severity food desert
  async getExistingContainers(): Promise<FarmingContainer[]> {
    // In a real app, this would fetch from database
    // For now, generate containers for each high-severity food desert
    try {
      const highSeverityDeserts = this.getMockHighSeverityDeserts()

      const containers: FarmingContainer[] = []
      let containerId = 1

      highSeverityDeserts.forEach((desert: MockFoodDesert) => {
        // Generate 2-3 containers per high-severity food desert based on population
        const containerCount = desert.population > 15000 ? 3 : desert.population > 8000 ? 2 : 1
        
        for (let i = 0; i < containerCount; i++) {
          // Slightly offset coordinates for multiple containers in same area
          const offsetLat = (Math.random() - 0.5) * 0.01 // ~1km offset
          const offsetLng = (Math.random() - 0.5) * 0.01
          
          const coordinates: [number, number] = [
            desert.coordinates[0] + offsetLat,
            desert.coordinates[1] + offsetLng
          ]

          // Generate crop recommendations for this container
          const cropRecommendations = this.generateCropRecommendations(
            {
              state: desert.state,
              county: desert.county,
              coordinates: coordinates
            },
            desert.population,
            desert.demographics
          )

          // Calculate container specifications
          const monthly_yield = cropRecommendations.reduce((sum, crop) => sum + crop.yield_per_cycle_kg, 0) * 1.2
          const impact = this.calculateImpactReduction(
            desert.severity,
            Math.floor(desert.population / containerCount), // Distribute population across containers
            monthly_yield,
            desert.demographics
          )

          // Determine container type and status
          const containerTypes: Array<'vertical_farm' | 'hydroponic' | 'aeroponic'> = ['vertical_farm', 'hydroponic', 'aeroponic']
          const statuses: Array<'active' | 'planned' | 'maintenance'> = ['active', 'planned', 'maintenance']
          
          const containerType = containerTypes[i % containerTypes.length]
          const status = i === 0 ? 'active' : 
                        i === 1 ? 'planned' : 
                        Math.random() > 0.7 ? 'maintenance' : 'active'

          containers.push({
            id: `vf_${desert.id}_${containerId.toString().padStart(3, '0')}`,
            name: `${desert.name} - Container #${i + 1}`,
            type: containerType,
            coordinates: coordinates,
            foodDesertId: desert.id,
            status: status,
            capacity: {
              monthly_yield_kg: Math.round(monthly_yield),
              crop_types: cropRecommendations.length,
              growing_cycles_per_year: containerType === 'aeroponic' ? 14 : 
                                      containerType === 'hydroponic' ? 10 : 12
            },
            recommendations: cropRecommendations,
            impact: {
              current_severity: desert.severity,
              ...impact
            },
            installation: {
              cost_estimate: this.calculateInstallationCost(containerType, monthly_yield),
              installation_time_weeks: containerType === 'aeroponic' ? 10 : 
                                      containerType === 'hydroponic' ? 6 : 8,
              maintenance_cost_annual: this.calculateMaintenanceCost(containerType, monthly_yield)
            }
          })
          
          containerId++
        }
      })

      return containers
    } catch (error) {
      console.error('Error generating containers:', error)
      return []
    }
  }

  // Save container configuration
  async saveContainer(container: FarmingContainer): Promise<boolean> {
    try {
      // In a real app, this would save to database
      console.log('Saving container:', container)
      return true
    } catch (error) {
      console.error('Error saving container:', error)
      return false
    }
  }

  // Mock high-severity food desert data for deployment
  private getMockHighSeverityDeserts(): MockFoodDesert[] {
    return [
      {
        id: 'detroit-downtown',
        name: 'Detroit Downtown',
        state: 'Michigan',
        county: 'Wayne',
        coordinates: [42.3314, -83.0458],
        population: 12500,
        severity: 'high',
        demographics: {
          children: 2800,
          seniors: 1900,
          households: 4200
        }
      },
      {
        id: 'chicago-south',
        name: 'Chicago South Side',
        state: 'Illinois',
        county: 'Cook',
        coordinates: [41.8781, -87.6298],
        population: 18000,
        severity: 'high',
        demographics: {
          children: 4200,
          seniors: 2100,
          households: 6800
        }
      },
      {
        id: 'memphis-downtown',
        name: 'Memphis Downtown',
        state: 'Tennessee',
        county: 'Shelby',
        coordinates: [35.1495, -90.0490],
        population: 8900,
        severity: 'high',
        demographics: {
          children: 2100,
          seniors: 1200,
          households: 3400
        }
      },
      {
        id: 'cleveland-east',
        name: 'Cleveland East Side',
        state: 'Ohio',
        county: 'Cuyahoga',
        coordinates: [41.4993, -81.6944],
        population: 15200,
        severity: 'high',
        demographics: {
          children: 3600,
          seniors: 2400,
          households: 5800
        }
      },
      {
        id: 'phoenix-south',
        name: 'South Phoenix',
        state: 'Arizona',
        county: 'Maricopa',
        coordinates: [33.4484, -112.0740],
        population: 22000,
        severity: 'high',
        demographics: {
          children: 5800,
          seniors: 2200,
          households: 8400
        }
      },
      {
        id: 'birmingham-central',
        name: 'Birmingham Central',
        state: 'Alabama',
        county: 'Jefferson',
        coordinates: [33.5186, -86.8104],
        population: 7800,
        severity: 'high',
        demographics: {
          children: 1900,
          seniors: 980,
          households: 2800
        }
      },
      {
        id: 'milwaukee-north',
        name: 'Milwaukee North Side',
        state: 'Wisconsin',
        county: 'Milwaukee',
        coordinates: [43.0389, -87.9065],
        population: 13400,
        severity: 'high',
        demographics: {
          children: 3200,
          seniors: 1600,
          households: 5100
        }
      },
      {
        id: 'baltimore-west',
        name: 'West Baltimore',
        state: 'Maryland',
        county: 'Baltimore',
        coordinates: [39.2904, -76.6122],
        population: 16800,
        severity: 'high',
        demographics: {
          children: 4100,
          seniors: 1900,
          households: 6400
        }
      },
      {
        id: 'sacramento-south',
        name: 'South Sacramento',
        state: 'California',
        county: 'Sacramento',
        coordinates: [38.5816, -121.4944],
        population: 19500,
        severity: 'high',
        demographics: {
          children: 4800,
          seniors: 2100,
          households: 7200
        }
      },
      {
        id: 'atlanta-southwest',
        name: 'Southwest Atlanta',
        state: 'Georgia',
        county: 'Fulton',
        coordinates: [33.7490, -84.3880],
        population: 11200,
        severity: 'high',
        demographics: {
          children: 2700,
          seniors: 1400,
          households: 4200
        }
      }
    ]
  }
}

export const verticalFarmingService = new VerticalFarmingService()
