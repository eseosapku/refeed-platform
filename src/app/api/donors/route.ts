import { NextRequest, NextResponse } from 'next/server'

// Comprehensive donors data with major US retailers, farms, restaurants, and international sources
const mockDonors = [
  // MAJOR US RETAILERS - WALMART STORES
  {
    id: '1',
    name: 'Walmart Supercenter - Bronx',
    type: 'supermarket',
    location: {
      lat: 40.8176,
      lng: -73.9282,
      address: '2210 Bartow Avenue, Bronx, NY 10475'
    },
    contactInfo: {
      phone: '+1 (718) 320-0288',
      email: 'donations@walmart.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery'],
  },
  {
    id: '2',
    name: 'Walmart Supercenter - Cleveland',
    type: 'supermarket',
    location: {
      lat: 41.5331,
      lng: -81.6501,
      address: '3250 Center Ridge Rd, North Ridgeville, OH 44039'
    },
    contactInfo: {
      phone: '+1 (440) 327-8820',
      email: 'donations@walmart.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery'],
  },
  {
    id: '3',
    name: 'Walmart Supercenter - Oakland',
    type: 'supermarket',
    location: {
      lat: 37.8044,
      lng: -122.2244,
      address: '8400 Edgewater Dr, Oakland, CA 94621'
    },
    contactInfo: {
      phone: '+1 (510) 568-0532',
      email: 'donations@walmart.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery'],
  },
  {
    id: '4',
    name: 'Walmart Supercenter - Chicago',
    type: 'supermarket',
    location: {
      lat: 41.7486,
      lng: -87.6098,
      address: '7535 S Ashland Ave, Chicago, IL 60620'
    },
    contactInfo: {
      phone: '+1 (773) 602-8264',
      email: 'donations@walmart.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery'],
  },
  {
    id: '5',
    name: 'Walmart Supercenter - Detroit',
    type: 'supermarket',
    location: {
      lat: 42.3314,
      lng: -83.0563,
      address: '5851 Mercury Dr, Dearborn, MI 48126'
    },
    contactInfo: {
      phone: '+1 (313) 336-3212',
      email: 'donations@walmart.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery'],
  },
  // TARGET STORES
  {
    id: '6',
    name: 'Target - Manhattan',
    type: 'supermarket',
    location: {
      lat: 40.7589,
      lng: -73.9851,
      address: '112 W 34th St, New York, NY 10120'
    },
    contactInfo: {
      phone: '+1 (212) 494-0492',
      email: 'donations@target.com',
      contactPerson: 'Community Relations'
    },
    isActive: true,
    registeredAt: new Date('2024-01-20'),
    foodLogs: [],
    capacity: 'medium',
    availableItems: ['groceries', 'fresh_produce', 'packaged_goods'],
  },
  {
    id: '7',
    name: 'Target - Los Angeles',
    type: 'supermarket',
    location: {
      lat: 34.0194,
      lng: -118.2437,
      address: '7100 Santa Monica Blvd, West Hollywood, CA 90046'
    },
    contactInfo: {
      phone: '+1 (323) 603-3214',
      email: 'donations@target.com',
      contactPerson: 'Community Relations'
    },
    isActive: true,
    registeredAt: new Date('2024-01-20'),
    foodLogs: [],
    capacity: 'medium',
    availableItems: ['groceries', 'fresh_produce', 'packaged_goods'],
  },
  {
    id: '8',
    name: 'Target - Houston',
    type: 'supermarket',
    location: {
      lat: 29.7604,
      lng: -95.3631,
      address: '4410 Montrose Blvd, Houston, TX 77006'
    },
    contactInfo: {
      phone: '+1 (713) 942-0186',
      email: 'donations@target.com',
      contactPerson: 'Community Relations'
    },
    isActive: true,
    registeredAt: new Date('2024-01-20'),
    foodLogs: [],
    capacity: 'medium',
    availableItems: ['groceries', 'fresh_produce', 'packaged_goods'],
  },
  // COSTCO WHOLESALE
  {
    id: '9',
    name: 'Costco Wholesale - Queens',
    type: 'supermarket',
    location: {
      lat: 40.7282,
      lng: -73.8370,
      address: '32-50 Vernon Blvd, Long Island City, NY 11106'
    },
    contactInfo: {
      phone: '+1 (718) 267-3680',
      email: 'donations@costco.com',
      contactPerson: 'Warehouse Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-25'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['bulk_groceries', 'fresh_produce', 'meat', 'dairy', 'bakery'],
  },
  {
    id: '10',
    name: 'Costco Wholesale - San Francisco',
    type: 'supermarket',
    location: {
      lat: 37.7749,
      lng: -122.4194,
      address: '450 10th St, San Francisco, CA 94103'
    },
    contactInfo: {
      phone: '+1 (415) 934-4700',
      email: 'donations@costco.com',
      contactPerson: 'Warehouse Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-25'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['bulk_groceries', 'fresh_produce', 'meat', 'dairy', 'bakery'],
  },
  {
    id: '11',
    name: 'Costco Wholesale - Atlanta',
    type: 'supermarket',
    location: {
      lat: 33.6937,
      lng: -84.3879,
      address: '2505 Cumberland Pkwy SE, Atlanta, GA 30339'
    },
    contactInfo: {
      phone: '+1 (770) 434-4431',
      email: 'donations@costco.com',
      contactPerson: 'Warehouse Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-25'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['bulk_groceries', 'fresh_produce', 'meat', 'dairy', 'bakery'],
  },
  // AMAZON FRESH & WHOLE FOODS
  {
    id: '12',
    name: 'Amazon Fresh - Seattle',
    type: 'supermarket',
    location: {
      lat: 47.6062,
      lng: -122.3321,
      address: '2131 Westlake Ave, Seattle, WA 98121'
    },
    contactInfo: {
      phone: '+1 (206) 266-1000',
      email: 'donations@amazon.com',
      contactPerson: 'Community Outreach'
    },
    isActive: true,
    registeredAt: new Date('2024-02-01'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['organic_produce', 'prepared_meals', 'dairy', 'meat'],
  },
  {
    id: '13',
    name: 'Whole Foods Market - Oakland',
    type: 'supermarket',
    location: {
      lat: 37.8044,
      lng: -122.2744,
      address: '789 Oakland Ave, Oakland, CA 94607'
    },
    contactInfo: {
      phone: '+1 (510) 834-5678',
      email: 'community@wholefoods.com',
      contactPerson: 'Sarah Wilson'
    },
    isActive: true,
    registeredAt: new Date('2024-02-01'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['organic_vegetables', 'fruits', 'dairy', 'bakery'],
  },
  {
    id: '14',
    name: 'Whole Foods Market - Austin',
    type: 'supermarket',
    location: {
      lat: 30.2672,
      lng: -97.7431,
      address: '525 N Lamar Blvd, Austin, TX 78703'
    },
    contactInfo: {
      phone: '+1 (512) 476-1206',
      email: 'community@wholefoods.com',
      contactPerson: 'Community Relations'
    },
    isActive: true,
    registeredAt: new Date('2024-02-01'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['organic_vegetables', 'fruits', 'dairy', 'bakery'],
  },
  // KROGER SUPERMARKETS
  {
    id: '15',
    name: 'Kroger - Cincinnati',
    type: 'supermarket',
    location: {
      lat: 39.1031,
      lng: -84.5120,
      address: '1420 Vine St, Cincinnati, OH 45202'
    },
    contactInfo: {
      phone: '+1 (513) 762-4000',
      email: 'donations@kroger.com',
      contactPerson: 'Community Relations'
    },
    isActive: true,
    registeredAt: new Date('2024-01-30'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery'],
  },
  {
    id: '16',
    name: 'Kroger - Atlanta',
    type: 'supermarket',
    location: {
      lat: 33.7490,
      lng: -84.3880,
      address: '725 Ponce De Leon Ave NE, Atlanta, GA 30306'
    },
    contactInfo: {
      phone: '+1 (404) 881-0441',
      email: 'donations@kroger.com',
      contactPerson: 'Community Relations'
    },
    isActive: true,
    registeredAt: new Date('2024-01-30'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery'],
  },
  {
    id: '17',
    name: 'Kroger - Louisville',
    type: 'supermarket',
    location: {
      lat: 38.2527,
      lng: -85.7585,
      address: '1216 Bardstown Rd, Louisville, KY 40204'
    },
    contactInfo: {
      phone: '+1 (502) 459-8165',
      email: 'donations@kroger.com',
      contactPerson: 'Community Relations'
    },
    isActive: true,
    registeredAt: new Date('2024-01-30'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery'],
  },
  // SAFEWAY STORES
  {
    id: '18',
    name: 'Safeway - San Francisco',
    type: 'supermarket',
    location: {
      lat: 37.7749,
      lng: -122.4194,
      address: '2020 Market St, San Francisco, CA 94114'
    },
    contactInfo: {
      phone: '+1 (415) 861-7660',
      email: 'donations@safeway.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-02-05'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery'],
  },
  {
    id: '19',
    name: 'Safeway - Portland',
    type: 'supermarket',
    location: {
      lat: 45.5152,
      lng: -122.6784,
      address: '1427 NE Weidler St, Portland, OR 97232'
    },
    contactInfo: {
      phone: '+1 (503) 288-3139',
      email: 'donations@safeway.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-02-05'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery'],
  },
  // PUBLIX SUPERMARKETS
  {
    id: '20',
    name: 'Publix Super Market - Miami',
    type: 'supermarket',
    location: {
      lat: 25.8440,
      lng: -80.1964,
      address: '1765 Alton Rd, Miami Beach, FL 33139'
    },
    contactInfo: {
      phone: '+1 (305) 531-9570',
      email: 'donations@publix.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-02-10'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery'],
  },
  {
    id: '21',
    name: 'Publix Super Market - Tampa',
    type: 'supermarket',
    location: {
      lat: 27.9506,
      lng: -82.4576,
      address: '1725 E 7th Ave, Tampa, FL 33605'
    },
    contactInfo: {
      phone: '+1 (813) 248-5341',
      email: 'donations@publix.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-02-10'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery'],
  },
  // ALDI STORES
  {
    id: '22',
    name: 'ALDI - Chicago',
    type: 'supermarket',
    location: {
      lat: 41.8781,
      lng: -87.6298,
      address: '1800 N Clybourn Ave, Chicago, IL 60614'
    },
    contactInfo: {
      phone: '+1 (855) 955-2534',
      email: 'donations@aldi.us',
      contactPerson: 'District Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-02-12'),
    foodLogs: [],
    capacity: 'medium',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat'],
  },
  {
    id: '23',
    name: 'ALDI - Philadelphia',
    type: 'supermarket',
    location: {
      lat: 39.9526,
      lng: -75.1652,
      address: '2031 Aramingo Ave, Philadelphia, PA 19125'
    },
    contactInfo: {
      phone: '+1 (855) 955-2534',
      email: 'donations@aldi.us',
      contactPerson: 'District Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-02-12'),
    foodLogs: [],
    capacity: 'medium',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat'],
  },
  // MAJOR US FARMS
  {
    id: '50',
    name: 'Green Valley Organic Farm',
    type: 'farm',
    location: {
      lat: 41.5331,
      lng: -81.5501,
      address: '456 Rural Rd, Cleveland, OH 44112'
    },
    contactInfo: {
      phone: '+1 (440) 987-6543',
      email: 'info@greenvalley.com',
      contactPerson: 'Mary Johnson'
    },
    isActive: true,
    registeredAt: new Date('2024-03-20'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['vegetables', 'fruits', 'grains'],
    farmType: 'organic',
    seasonalAvailability: 'spring_summer_fall',
  },
  {
    id: '51',
    name: 'Sunrise Organic Farm',
    type: 'farm',
    location: {
      lat: 42.3314,
      lng: -83.1563,
      address: '321 Farm Lane, Detroit, MI 48201'
    },
    contactInfo: {
      phone: '+1 (313) 345-6789',
      email: 'harvest@sunriseorganic.com',
      contactPerson: 'Robert Davis'
    },
    isActive: true,
    registeredAt: new Date('2024-01-10'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['vegetables', 'fruits', 'herbs'],
    farmType: 'organic',
    seasonalAvailability: 'year_round',
  },
  {
    id: '52',
    name: 'California Central Valley Farms',
    type: 'farm',
    location: {
      lat: 36.7378,
      lng: -119.7871,
      address: '1200 Farm Road, Fresno, CA 93706'
    },
    contactInfo: {
      phone: '+1 (559) 456-7890',
      email: 'donations@centralvalleyfarms.com',
      contactPerson: 'Maria Gonzalez'
    },
    isActive: true,
    registeredAt: new Date('2024-02-15'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['fruits', 'vegetables', 'nuts'],
    farmType: 'conventional',
    seasonalAvailability: 'year_round',
  },
  {
    id: '53',
    name: 'Texas Hill Country Ranch',
    type: 'farm',
    location: {
      lat: 30.2672,
      lng: -98.7431,
      address: '567 Ranch Road, Austin, TX 78703'
    },
    contactInfo: {
      phone: '+1 (512) 567-8901',
      email: 'contact@hillcountryranch.com',
      contactPerson: 'James Wilson'
    },
    isActive: true,
    registeredAt: new Date('2024-02-20'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['livestock', 'grains', 'vegetables'],
    farmType: 'conventional',
    seasonalAvailability: 'year_round',
  },
  // RESTAURANT CHAINS
  {
    id: '60',
    name: 'Panera Bread - Manhattan',
    type: 'restaurant',
    location: {
      lat: 40.7589,
      lng: -73.9851,
      address: '1350 Broadway, New York, NY 10018'
    },
    contactInfo: {
      phone: '+1 (212) 354-2090',
      email: 'donations@panerabread.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-03-01'),
    foodLogs: [],
    capacity: 'medium',
    availableItems: ['bread', 'sandwiches', 'soups', 'pastries'],
    donationSchedule: 'daily_evening',
  },
  {
    id: '61',
    name: 'Chipotle - Los Angeles',
    type: 'restaurant',
    location: {
      lat: 34.0522,
      lng: -118.2437,
      address: '1400 N Highland Ave, Los Angeles, CA 90028'
    },
    contactInfo: {
      phone: '+1 (323) 469-2080',
      email: 'donations@chipotle.com',
      contactPerson: 'General Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-03-05'),
    foodLogs: [],
    capacity: 'medium',
    availableItems: ['prepared_meals', 'rice', 'beans', 'vegetables'],
    donationSchedule: 'daily_closing',
  },
  {
    id: '62',
    name: 'Starbucks - Seattle',
    type: 'restaurant',
    location: {
      lat: 47.6062,
      lng: -122.3321,
      address: '1912 Pike Pl, Seattle, WA 98101'
    },
    contactInfo: {
      phone: '+1 (206) 448-8762',
      email: 'donations@starbucks.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-03-10'),
    foodLogs: [],
    capacity: 'small',
    availableItems: ['pastries', 'sandwiches', 'coffee'],
    donationSchedule: 'daily_evening',
  },
  {
    id: '63',
    name: 'McDonald\'s - Chicago',
    type: 'restaurant',
    location: {
      lat: 41.8781,
      lng: -87.6298,
      address: '600 N Clark St, Chicago, IL 60654'
    },
    contactInfo: {
      phone: '+1 (312) 867-0455',
      email: 'donations@mcdonalds.com',
      contactPerson: 'Franchise Owner'
    },
    isActive: true,
    registeredAt: new Date('2024-03-12'),
    foodLogs: [],
    capacity: 'medium',
    availableItems: ['prepared_meals', 'ingredients'],
    donationSchedule: 'daily_closing',
  },
  // Rwanda Agricultural Sources
  {
    id: '8',
    name: 'Rwanda Potato Cooperative',
    type: 'farm',
    location: {
      lat: -1.4673,
      lng: 29.7308,
      address: 'Northern Province, Rwanda'
    },
    contactInfo: {
      phone: '+250 788 123 456',
      email: 'export@rwandapotato.rw',
      contactPerson: 'Jean Baptiste Uwimana'
    },
    isActive: true,
    registeredAt: new Date('2024-02-01'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['potatoes', 'vegetables'],
    farmType: 'cooperative',
    exportCapability: true,
    certifications: ['organic', 'fair_trade'],
  },
  {
    id: '9',
    name: 'Eastern Rice Farmers Union',
    type: 'farm',
    location: {
      lat: -2.0706,
      lng: 30.6419,
      address: 'Eastern Province, Rwanda'
    },
    contactInfo: {
      phone: '+250 788 234 567',
      email: 'union@easternrice.rw',
      contactPerson: 'Marie Claire Mukamana'
    },
    isActive: true,
    registeredAt: new Date('2024-02-10'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['rice', 'grains'],
    farmType: 'cooperative',
    exportCapability: true,
    certifications: ['sustainable', 'quality_assured'],
  },
  {
    id: '10',
    name: 'Rwanda Coffee & Maize Federation',
    type: 'farm',
    location: {
      lat: -2.6706,
      lng: 29.8419,
      address: 'Southern Province, Rwanda'
    },
    contactInfo: {
      phone: '+250 788 345 678',
      email: 'federation@rwandacoffee.rw',
      contactPerson: 'Paul Kagame Nzeyimana'
    },
    isActive: true,
    registeredAt: new Date('2024-01-20'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['coffee', 'maize', 'grains'],
    farmType: 'federation',
    exportCapability: true,
    certifications: ['fair_trade', 'organic', 'rainforest_alliance'],
  },
  // Additional US Food Sources
  {
    id: '11',
    name: 'City Harvest Food Bank',
    type: 'distributor',
    location: {
      lat: 40.8076,
      lng: -73.9382,
      address: '645 Food Center Dr, Bronx, NY 10451'
    },
    contactInfo: {
      phone: '+1 (555) 789-0123',
      email: 'logistics@cityharvest.org',
      contactPerson: 'Amanda Rodriguez'
    },
    isActive: true,
    registeredAt: new Date('2024-01-05'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['canned_goods', 'dry_goods', 'fresh_produce'],
    distributionNetwork: 'regional',
  },

  // MASSIVE EXPANSION - ALL MAJOR US RETAILERS
  // TARGET STORES NATIONWIDE
  {
    id: '1000',
    name: 'Target - Manhattan Herald Square',
    type: 'supermarket',
    location: {
      lat: 40.7505,
      lng: -73.9934,
      address: '112 W 34th St, New York, NY 10120'
    },
    contactInfo: {
      phone: '+1 (212) 494-3902',
      email: 'donations@target.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'frozen_foods', 'bakery'],
  },
  {
    id: '1001',
    name: 'Target - Chicago Loop',
    type: 'supermarket',
    location: {
      lat: 41.8781,
      lng: -87.6298,
      address: '1 S State St, Chicago, IL 60603'
    },
    contactInfo: {
      phone: '+1 (312) 494-0142',
      email: 'donations@target.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'frozen_foods', 'bakery'],
  },
  {
    id: '1002',
    name: 'Target - Los Angeles Hollywood',
    type: 'supermarket',
    location: {
      lat: 34.0928,
      lng: -118.3287,
      address: '5616 W Sunset Blvd, Los Angeles, CA 90028'
    },
    contactInfo: {
      phone: '+1 (323) 466-8001',
      email: 'donations@target.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'frozen_foods', 'bakery'],
  },
  {
    id: '1003',
    name: 'Target - Miami Beach',
    type: 'supermarket',
    location: {
      lat: 25.7907,
      lng: -80.1300,
      address: '1045 5th St, Miami Beach, FL 33139'
    },
    contactInfo: {
      phone: '+1 (305) 535-4410',
      email: 'donations@target.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'frozen_foods', 'bakery'],
  },
  {
    id: '1004',
    name: 'Target - Atlanta Midtown',
    type: 'supermarket',
    location: {
      lat: 33.7845,
      lng: -84.3834,
      address: '849 Spring St NW, Atlanta, GA 30308'
    },
    contactInfo: {
      phone: '+1 (404) 888-9940',
      email: 'donations@target.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'frozen_foods', 'bakery'],
  },

  // COSTCO WHOLESALE STORES
  {
    id: '1010',
    name: 'Costco Wholesale - East Harlem',
    type: 'supermarket',
    location: {
      lat: 40.7937,
      lng: -73.9374,
      address: '517 E 117th St, New York, NY 10035'
    },
    contactInfo: {
      phone: '+1 (212) 234-2030',
      email: 'donations@costco.com',
      contactPerson: 'Warehouse Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'very_large',
    availableItems: ['bulk_groceries', 'fresh_produce', 'dairy', 'meat', 'bakery', 'frozen_foods'],
  },
  {
    id: '1011',
    name: 'Costco Wholesale - South Bay LA',
    type: 'supermarket',
    location: {
      lat: 33.8121,
      lng: -118.3570,
      address: '2500 Maricopa St, Torrance, CA 90503'
    },
    contactInfo: {
      phone: '+1 (310) 787-8918',
      email: 'donations@costco.com',
      contactPerson: 'Warehouse Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'very_large',
    availableItems: ['bulk_groceries', 'fresh_produce', 'dairy', 'meat', 'bakery', 'frozen_foods'],
  },
  {
    id: '1012',
    name: 'Costco Wholesale - Chicago Northside',
    type: 'supermarket',
    location: {
      lat: 41.9742,
      lng: -87.6503,
      address: '2746 N Clybourn Ave, Chicago, IL 60614'
    },
    contactInfo: {
      phone: '+1 (773) 935-4466',
      email: 'donations@costco.com',
      contactPerson: 'Warehouse Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'very_large',
    availableItems: ['bulk_groceries', 'fresh_produce', 'dairy', 'meat', 'bakery', 'frozen_foods'],
  },
  {
    id: '1013',
    name: 'Costco Wholesale - Atlanta Perimeter',
    type: 'supermarket',
    location: {
      lat: 33.9137,
      lng: -84.3444,
      address: '4849 Ashford Dunwoody Rd, Atlanta, GA 30338'
    },
    contactInfo: {
      phone: '+1 (770) 396-8080',
      email: 'donations@costco.com',
      contactPerson: 'Warehouse Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'very_large',
    availableItems: ['bulk_groceries', 'fresh_produce', 'dairy', 'meat', 'bakery', 'frozen_foods'],
  },

  // AMAZON FRESH & WHOLE FOODS
  {
    id: '1020',
    name: 'Amazon Fresh - Brooklyn',
    type: 'supermarket',
    location: {
      lat: 40.6892,
      lng: -73.9441,
      address: '625 Atlantic Ave, Brooklyn, NY 11217'
    },
    contactInfo: {
      phone: '+1 (800) 895-1085',
      email: 'fresh-donations@amazon.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'organic_foods'],
    exportCapability: true,
  },
  {
    id: '1021',
    name: 'Whole Foods Market - Union Square NYC',
    type: 'supermarket',
    location: {
      lat: 40.7359,
      lng: -73.9911,
      address: '4 Union Square S, New York, NY 10003'
    },
    contactInfo: {
      phone: '+1 (212) 673-5388',
      email: 'donations@wholefoods.com',
      contactPerson: 'Team Leader'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['organic_groceries', 'fresh_produce', 'dairy', 'meat', 'prepared_foods'],
  },
  {
    id: '1022',
    name: 'Whole Foods Market - Beverly Hills',
    type: 'supermarket',
    location: {
      lat: 34.0669,
      lng: -118.3959,
      address: '239 N Crescent Dr, Beverly Hills, CA 90210'
    },
    contactInfo: {
      phone: '+1 (310) 274-3360',
      email: 'donations@wholefoods.com',
      contactPerson: 'Team Leader'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['organic_groceries', 'fresh_produce', 'dairy', 'meat', 'prepared_foods'],
  },
  {
    id: '1023',
    name: 'Whole Foods Market - Austin Flagship',
    type: 'supermarket',
    location: {
      lat: 30.2672,
      lng: -97.7431,
      address: '525 N Lamar Blvd, Austin, TX 78703'
    },
    contactInfo: {
      phone: '+1 (512) 476-1206',
      email: 'donations@wholefoods.com',
      contactPerson: 'Team Leader'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'very_large',
    availableItems: ['organic_groceries', 'fresh_produce', 'dairy', 'meat', 'prepared_foods'],
  },

  // KROGER CHAIN STORES
  {
    id: '1030',
    name: 'Kroger - Cincinnati Downtown',
    type: 'supermarket',
    location: {
      lat: 39.1012,
      lng: -84.5120,
      address: '113 W 7th St, Cincinnati, OH 45202'
    },
    contactInfo: {
      phone: '+1 (513) 762-5100',
      email: 'donations@kroger.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery', 'pharmacy'],
  },
  {
    id: '1031',
    name: 'Kroger - Atlanta Buckhead',
    type: 'supermarket',
    location: {
      lat: 33.8366,
      lng: -84.3616,
      address: '3330 Piedmont Rd NE, Atlanta, GA 30305'
    },
    contactInfo: {
      phone: '+1 (404) 365-0905',
      email: 'donations@kroger.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery', 'pharmacy'],
  },
  {
    id: '1032',
    name: 'Kroger - Houston Memorial',
    type: 'supermarket',
    location: {
      lat: 29.7604,
      lng: -95.3698,
      address: '2707 S Shepherd Dr, Houston, TX 77019'
    },
    contactInfo: {
      phone: '+1 (713) 529-4098',
      email: 'donations@kroger.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery', 'pharmacy'],
  },

  // SAFEWAY STORES
  {
    id: '1040',
    name: 'Safeway - San Francisco Marina',
    type: 'supermarket',
    location: {
      lat: 37.8021,
      lng: -122.4381,
      address: '2020 Marina Blvd, San Francisco, CA 94123'
    },
    contactInfo: {
      phone: '+1 (415) 563-4946',
      email: 'donations@safeway.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery', 'pharmacy'],
  },
  {
    id: '1041',
    name: 'Safeway - Seattle Capitol Hill',
    type: 'supermarket',
    location: {
      lat: 47.6205,
      lng: -122.3212,
      address: '1410 E John St, Seattle, WA 98112'
    },
    contactInfo: {
      phone: '+1 (206) 322-9988',
      email: 'donations@safeway.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery', 'pharmacy'],
  },
  {
    id: '1042',
    name: 'Safeway - Denver Cherry Creek',
    type: 'supermarket',
    location: {
      lat: 39.7147,
      lng: -104.9566,
      address: '201 University Blvd, Denver, CO 80206'
    },
    contactInfo: {
      phone: '+1 (303) 777-6050',
      email: 'donations@safeway.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery', 'pharmacy'],
  },

  // PUBLIX STORES (SOUTHEASTERN US)
  {
    id: '1050',
    name: 'Publix Super Market - Miami Beach',
    type: 'supermarket',
    location: {
      lat: 25.782,
      lng: -80.1300,
      address: '1920 West Ave, Miami Beach, FL 33139'
    },
    contactInfo: {
      phone: '+1 (305) 532-4935',
      email: 'donations@publix.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery', 'deli'],
  },
  {
    id: '1051',
    name: 'Publix Super Market - Atlanta Midtown',
    type: 'supermarket',
    location: {
      lat: 33.7845,
      lng: -84.3853,
      address: '260 Peachtree St NW, Atlanta, GA 30303'
    },
    contactInfo: {
      phone: '+1 (404) 880-0086',
      email: 'donations@publix.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery', 'deli'],
  },
  {
    id: '1052',
    name: 'Publix Super Market - Charleston Downtown',
    type: 'supermarket',
    location: {
      lat: 32.7765,
      lng: -79.9311,
      address: '85 Folly Rd, Charleston, SC 29407'
    },
    contactInfo: {
      phone: '+1 (843) 766-3568',
      email: 'donations@publix.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery', 'deli'],
  },

  // ALDI STORES
  {
    id: '1060',
    name: 'ALDI - Queens Astoria',
    type: 'supermarket',
    location: {
      lat: 40.7692,
      lng: -73.9442,
      address: '31-31 21st Ave, Astoria, NY 11105'
    },
    contactInfo: {
      phone: '+1 (855) 955-2534',
      email: 'donations@aldi.us',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'medium',
    availableItems: ['discount_groceries', 'fresh_produce', 'dairy', 'frozen_foods'],
  },
  {
    id: '1061',
    name: 'ALDI - Chicago Wicker Park',
    type: 'supermarket',
    location: {
      lat: 41.9073,
      lng: -87.6776,
      address: '1765 N Elston Ave, Chicago, IL 60642'
    },
    contactInfo: {
      phone: '+1 (855) 955-2534',
      email: 'donations@aldi.us',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'medium',
    availableItems: ['discount_groceries', 'fresh_produce', 'dairy', 'frozen_foods'],
  },
  {
    id: '1062',
    name: 'ALDI - Los Angeles East Hollywood',
    type: 'supermarket',
    location: {
      lat: 34.0970,
      lng: -118.2906,
      address: '4650 Fountain Ave, Los Angeles, CA 90029'
    },
    contactInfo: {
      phone: '+1 (855) 955-2534',
      email: 'donations@aldi.us',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'medium',
    availableItems: ['discount_groceries', 'fresh_produce', 'dairy', 'frozen_foods'],
  },

  // WEGMANS STORES (NORTHEAST)
  {
    id: '1070',
    name: 'Wegmans - Brooklyn Navy Yard',
    type: 'supermarket',
    location: {
      lat: 40.7021,
      lng: -73.9731,
      address: '200 Nassau Ave, Brooklyn, NY 11222'
    },
    contactInfo: {
      phone: '+1 (718) 307-7821',
      email: 'donations@wegmans.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'very_large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery', 'prepared_foods', 'cafe'],
  },
  {
    id: '1071',
    name: 'Wegmans - Rochester Eastway',
    type: 'supermarket',
    location: {
      lat: 43.2081,
      lng: -77.6109,
      address: '1200 Brooks Ave, Rochester, NY 14624'
    },
    contactInfo: {
      phone: '+1 (585) 328-6000',
      email: 'donations@wegmans.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'very_large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery', 'prepared_foods', 'cafe'],
  },

  // TRADER JOE'S STORES
  {
    id: '1080',
    name: "Trader Joe's - Manhattan West Village",
    type: 'supermarket',
    location: {
      lat: 40.7359,
      lng: -74.0036,
      address: '675 6th Ave, New York, NY 10010'
    },
    contactInfo: {
      phone: '+1 (212) 255-2106',
      email: 'donations@traderjoes.com',
      contactPerson: 'Captain'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'medium',
    availableItems: ['specialty_groceries', 'fresh_produce', 'frozen_foods', 'wine'],
  },
  {
    id: '1081',
    name: "Trader Joe's - San Francisco Castro",
    type: 'supermarket',
    location: {
      lat: 37.7609,
      lng: -122.4350,
      address: '2175 Market St, San Francisco, CA 94114'
    },
    contactInfo: {
      phone: '+1 (415) 863-1292',
      email: 'donations@traderjoes.com',
      contactPerson: 'Captain'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'medium',
    availableItems: ['specialty_groceries', 'fresh_produce', 'frozen_foods', 'wine'],
  },
  {
    id: '1082',
    name: "Trader Joe's - Chicago Lincoln Park",
    type: 'supermarket',
    location: {
      lat: 41.9278,
      lng: -87.6441,
      address: '1840 N Clybourn Ave, Chicago, IL 60614'
    },
    contactInfo: {
      phone: '+1 (773) 248-4920',
      email: 'donations@traderjoes.com',
      contactPerson: 'Captain'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'medium',
    availableItems: ['specialty_groceries', 'fresh_produce', 'frozen_foods', 'wine'],
  },

  // H-E-B STORES (TEXAS)
  {
    id: '1090',
    name: 'H-E-B - Austin Downtown',
    type: 'supermarket',
    location: {
      lat: 30.2672,
      lng: -97.7431,
      address: '500 E 4th St, Austin, TX 78701'
    },
    contactInfo: {
      phone: '+1 (512) 469-9014',
      email: 'donations@heb.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery', 'pharmacy', 'tortilleria'],
  },
  {
    id: '1091',
    name: 'H-E-B - Houston Montrose',
    type: 'supermarket',
    location: {
      lat: 29.7370,
      lng: -95.3981,
      address: '4821 Richmond Ave, Houston, TX 77027'
    },
    contactInfo: {
      phone: '+1 (713) 572-0199',
      email: 'donations@heb.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery', 'pharmacy', 'tortilleria'],
  },
  {
    id: '1092',
    name: 'H-E-B - San Antonio River Walk',
    type: 'supermarket',
    location: {
      lat: 29.4241,
      lng: -98.4936,
      address: '503 E Houston St, San Antonio, TX 78205'
    },
    contactInfo: {
      phone: '+1 (210) 224-1234',
      email: 'donations@heb.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery', 'pharmacy', 'tortilleria'],
  },

  // MEIJER STORES (MIDWEST)
  {
    id: '1100',
    name: 'Meijer - Detroit Midtown',
    type: 'supermarket',
    location: {
      lat: 42.3314,
      lng: -83.0458,
      address: '929 Gratiot Ave, Detroit, MI 48207'
    },
    contactInfo: {
      phone: '+1 (313) 824-4000',
      email: 'donations@meijer.com',
      contactPerson: 'Store Director'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'very_large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery', 'pharmacy', 'general_merchandise'],
  },
  {
    id: '1101',
    name: 'Meijer - Grand Rapids Downtown',
    type: 'supermarket',
    location: {
      lat: 42.9634,
      lng: -85.6681,
      address: '1997 E Beltline Ave SE, Grand Rapids, MI 49546'
    },
    contactInfo: {
      phone: '+1 (616) 949-6900',
      email: 'donations@meijer.com',
      contactPerson: 'Store Director'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'very_large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery', 'pharmacy', 'general_merchandise'],
  },

  // REGIONAL SUPERMARKET CHAINS
  {
    id: '1110',
    name: 'Giant Food - Washington DC Downtown',
    type: 'supermarket',
    location: {
      lat: 38.9072,
      lng: -77.0369,
      address: '300 H St NE, Washington, DC 20002'
    },
    contactInfo: {
      phone: '+1 (202) 399-4946',
      email: 'donations@giantfood.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery', 'pharmacy'],
  },
  {
    id: '1111',
    name: 'Stop & Shop - Boston Back Bay',
    type: 'supermarket',
    location: {
      lat: 42.3505,
      lng: -71.0811,
      address: '181 Newbury St, Boston, MA 02116'
    },
    contactInfo: {
      phone: '+1 (617) 267-5200',
      email: 'donations@stopandshop.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery', 'pharmacy'],
  },
  {
    id: '1112',
    name: 'ShopRite - Newark Downtown',
    type: 'supermarket',
    location: {
      lat: 40.7282,
      lng: -74.1776,
      address: '57 Halsey St, Newark, NJ 07102'
    },
    contactInfo: {
      phone: '+1 (973) 622-0507',
      email: 'donations@shoprite.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'large',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery', 'pharmacy'],
  },
  {
    id: '1113',
    name: 'Food Lion - Charlotte East',
    type: 'supermarket',
    location: {
      lat: 35.2271,
      lng: -80.8431,
      address: '2222 The Plaza, Charlotte, NC 28205'
    },
    contactInfo: {
      phone: '+1 (704) 536-9004',
      email: 'donations@foodlion.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'medium',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery'],
  },
  {
    id: '1114',
    name: 'Winn-Dixie - Jacksonville Downtown',
    type: 'supermarket',
    location: {
      lat: 30.3322,
      lng: -81.6557,
      address: '1019 Hendricks Ave, Jacksonville, FL 32207'
    },
    contactInfo: {
      phone: '+1 (904) 396-9004',
      email: 'donations@winndixie.com',
      contactPerson: 'Store Manager'
    },
    isActive: true,
    registeredAt: new Date('2024-01-15'),
    foodLogs: [],
    capacity: 'medium',
    availableItems: ['groceries', 'fresh_produce', 'dairy', 'meat', 'bakery'],
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const isActive = searchParams.get('active')

    let filteredDonors = mockDonors

    if (type) {
      filteredDonors = filteredDonors.filter(donor => donor.type === type)
    }

    if (isActive !== null) {
      const activeFilter = isActive === 'true'
      filteredDonors = filteredDonors.filter(donor => donor.isActive === activeFilter)
    }

    return NextResponse.json({
      success: true,
      data: filteredDonors,
      total: filteredDonors.length,
    })
  } catch (error) {
    console.error('Error fetching donors:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch donors',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, address, phone, email, contactPerson, description } = body

    // Validate required fields
    if (!name || !type || !address || !email || !contactPerson) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      )
    }

    // Mock geocoding - in real app, use Google Maps API
    const mockCoordinates = {
      lat: 40.7128 + Math.random() * 0.1,
      lng: -74.0060 + Math.random() * 0.1,
    }

    const newDonor = {
      id: (mockDonors.length + 1).toString(),
      name,
      type,
      location: {
        lat: mockCoordinates.lat,
        lng: mockCoordinates.lng,
        address,
      },
      contactInfo: {
        phone,
        email,
        contactPerson,
      },
      isActive: true,
      registeredAt: new Date(),
      foodLogs: [],
      capacity: 'medium',
      availableItems: ['general'],
    }

    mockDonors.push(newDonor)

    return NextResponse.json({
      success: true,
      data: newDonor,
      message: 'Donor registered successfully',
    })
  } catch (error) {
    console.error('Error registering donor:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to register donor',
      },
      { status: 500 }
    )
  }
}
