import { NextRequest, NextResponse } from 'next/server'

// Comprehensive food desert data with extensive US coverage and Rwanda agricultural data
const mockFoodDeserts = [
  // NEW YORK STATE Food Deserts
  {
    id: '1',
    name: 'South Bronx',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-73.9482, 40.8176],
        [-73.9382, 40.8276],
        [-73.9282, 40.8176],
        [-73.9382, 40.8076],
        [-73.9482, 40.8176]
      ]]
    },
    population: 45000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '1a',
    name: 'East Harlem',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-73.9420, 40.7949],
        [-73.9320, 40.8049],
        [-73.9220, 40.7949],
        [-73.9320, 40.7849],
        [-73.9420, 40.7949]
      ]]
    },
    population: 38000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '1b',
    name: 'Bedford-Stuyvesant',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-73.9441, 40.6892],
        [-73.9341, 40.6992],
        [-73.9241, 40.6892],
        [-73.9341, 40.6792],
        [-73.9441, 40.6892]
      ]]
    },
    population: 52000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '1c',
    name: 'Brownsville Brooklyn',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-73.9096, 40.6631],
        [-73.8996, 40.6731],
        [-73.8896, 40.6631],
        [-73.8996, 40.6531],
        [-73.9096, 40.6631]
      ]]
    },
    population: 28000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '1d',
    name: 'Central Islip Long Island',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-73.2009, 40.7831],
        [-73.1909, 40.7931],
        [-73.1809, 40.7831],
        [-73.1909, 40.7731],
        [-73.2009, 40.7831]
      ]]
    },
    population: 21000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  // OHIO Food Deserts
  {
    id: '2',
    name: 'East Cleveland',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-81.5801, 41.5331],
        [-81.5701, 41.5431],
        [-81.5601, 41.5331],
        [-81.5701, 41.5231],
        [-81.5801, 41.5331]
      ]]
    },
    population: 17000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2a',
    name: 'West Cleveland',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-81.7801, 41.4831],
        [-81.7701, 41.4931],
        [-81.7601, 41.4831],
        [-81.7701, 41.4731],
        [-81.7801, 41.4831]
      ]]
    },
    population: 31000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2b',
    name: 'Dayton Ohio',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-84.1916, 39.7589],
        [-84.1816, 39.7689],
        [-84.1716, 39.7589],
        [-84.1816, 39.7489],
        [-84.1916, 39.7589]
      ]]
    },
    population: 42000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2c',
    name: 'Toledo Ohio',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-83.5378, 41.6528],
        [-83.5278, 41.6628],
        [-83.5178, 41.6528],
        [-83.5278, 41.6428],
        [-83.5378, 41.6528]
      ]]
    },
    population: 35000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2d',
    name: 'Youngstown Ohio',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-80.6495, 41.0998],
        [-80.6395, 41.1098],
        [-80.6295, 41.0998],
        [-80.6395, 41.0898],
        [-80.6495, 41.0998]
      ]]
    },
    population: 28000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  // CALIFORNIA Food Deserts
  {
    id: '3',
    name: 'West Oakland',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-122.2944, 37.8044],
        [-122.2844, 37.8144],
        [-122.2744, 37.8044],
        [-122.2844, 37.7944],
        [-122.2944, 37.8044]
      ]]
    },
    population: 32000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '3a',
    name: 'East Oakland',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-122.2244, 37.7544],
        [-122.2144, 37.7644],
        [-122.2044, 37.7544],
        [-122.2144, 37.7444],
        [-122.2244, 37.7544]
      ]]
    },
    population: 48000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '3b',
    name: 'South Central LA',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-118.2837, 34.0194],
        [-118.2737, 34.0294],
        [-118.2637, 34.0194],
        [-118.2737, 34.0094],
        [-118.2837, 34.0194]
      ]]
    },
    population: 85000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '3c',
    name: 'East LA',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-118.1737, 34.0394],
        [-118.1637, 34.0494],
        [-118.1537, 34.0394],
        [-118.1637, 34.0294],
        [-118.1737, 34.0394]
      ]]
    },
    population: 72000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '3d',
    name: 'Fresno Central',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-119.7871, 36.7378],
        [-119.7771, 36.7478],
        [-119.7671, 36.7378],
        [-119.7771, 36.7278],
        [-119.7871, 36.7378]
      ]]
    },
    population: 41000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '3e',
    name: 'Stockton CA',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-121.2944, 37.9577],
        [-121.2844, 37.9677],
        [-121.2744, 37.9577],
        [-121.2844, 37.9477],
        [-121.2944, 37.9577]
      ]]
    },
    population: 33000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  // ILLINOIS Food Deserts
  {
    id: '4',
    name: 'South Side Chicago',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-87.6298, 41.7486],
        [-87.6198, 41.7586],
        [-87.6098, 41.7486],
        [-87.6198, 41.7386],
        [-87.6298, 41.7486]
      ]]
    },
    population: 78000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '4a',
    name: 'West Side Chicago',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-87.7298, 41.8486],
        [-87.7198, 41.8586],
        [-87.7098, 41.8486],
        [-87.7198, 41.8386],
        [-87.7298, 41.8486]
      ]]
    },
    population: 62000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '4b',
    name: 'East St. Louis',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-90.1370, 38.7506],
        [-90.1270, 38.7606],
        [-90.1170, 38.7506],
        [-90.1270, 38.7406],
        [-90.1370, 38.7506]
      ]]
    },
    population: 24000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '4c',
    name: 'Rockford Illinois',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-89.0940, 42.2711],
        [-89.0840, 42.2811],
        [-89.0740, 42.2711],
        [-89.0840, 42.2611],
        [-89.0940, 42.2711]
      ]]
    },
    population: 29000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  // MICHIGAN Food Deserts
  {
    id: '5',
    name: 'West Detroit',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-83.1763, 42.3314],
        [-83.1663, 42.3414],
        [-83.1563, 42.3314],
        [-83.1663, 42.3214],
        [-83.1763, 42.3314]
      ]]
    },
    population: 52000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '5a',
    name: 'East Detroit',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-83.0363, 42.3814],
        [-83.0263, 42.3914],
        [-83.0163, 42.3814],
        [-83.0263, 42.3714],
        [-83.0363, 42.3814]
      ]]
    },
    population: 47000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '5b',
    name: 'Flint Michigan',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-83.6875, 43.0125],
        [-83.6775, 43.0225],
        [-83.6675, 43.0125],
        [-83.6775, 43.0025],
        [-83.6875, 43.0125]
      ]]
    },
    population: 34000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '5c',
    name: 'Grand Rapids MI',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-85.6681, 42.9634],
        [-85.6581, 42.9734],
        [-85.6481, 42.9634],
        [-85.6581, 42.9534],
        [-85.6681, 42.9634]
      ]]
    },
    population: 31000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  // TEXAS Food Deserts
  {
    id: '6t',
    name: 'South Dallas',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-96.7970, 32.7357],
        [-96.7870, 32.7457],
        [-96.7770, 32.7357],
        [-96.7870, 32.7257],
        [-96.7970, 32.7357]
      ]]
    },
    population: 89000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '6ta',
    name: 'East Houston',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-95.2631, 29.7604],
        [-95.2531, 29.7704],
        [-95.2431, 29.7604],
        [-95.2531, 29.7504],
        [-95.2631, 29.7604]
      ]]
    },
    population: 76000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '6tb',
    name: 'San Antonio East Side',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-98.4436, 29.4241],
        [-98.4336, 29.4341],
        [-98.4236, 29.4241],
        [-98.4336, 29.4141],
        [-98.4436, 29.4241]
      ]]
    },
    population: 58000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '6tc',
    name: 'Fort Worth Southside',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-97.3307, 32.7025],
        [-97.3207, 32.7125],
        [-97.3107, 32.7025],
        [-97.3207, 32.6925],
        [-97.3307, 32.7025]
      ]]
    },
    population: 43000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '6td',
    name: 'Austin East',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-97.6431, 30.2672],
        [-97.6331, 30.2772],
        [-97.6231, 30.2672],
        [-97.6331, 30.2572],
        [-97.6431, 30.2672]
      ]]
    },
    population: 35000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  // FLORIDA Food Deserts
  {
    id: '7f',
    name: 'Liberty City Miami',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-80.2264, 25.8440],
        [-80.2164, 25.8540],
        [-80.2064, 25.8440],
        [-80.2164, 25.8340],
        [-80.2264, 25.8440]
      ]]
    },
    population: 67000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '7fa',
    name: 'Tampa East',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-82.3576, 27.9506],
        [-82.3476, 27.9606],
        [-82.3376, 27.9506],
        [-82.3476, 27.9406],
        [-82.3576, 27.9506]
      ]]
    },
    population: 41000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '7fb',
    name: 'Jacksonville Westside',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-81.7556, 30.3322],
        [-81.7456, 30.3422],
        [-81.7356, 30.3322],
        [-81.7456, 30.3222],
        [-81.7556, 30.3322]
      ]]
    },
    population: 38000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  // PENNSYLVANIA Food Deserts
  {
    id: '8p',
    name: 'North Philadelphia',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-75.1652, 39.9926],
        [-75.1552, 40.0026],
        [-75.1452, 39.9926],
        [-75.1552, 39.9826],
        [-75.1652, 39.9926]
      ]]
    },
    population: 73000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '8pa',
    name: 'West Philadelphia',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-75.2352, 39.9626],
        [-75.2252, 39.9726],
        [-75.2152, 39.9626],
        [-75.2252, 39.9526],
        [-75.2352, 39.9626]
      ]]
    },
    population: 58000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '8pb',
    name: 'Pittsburgh Hill District',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-79.9759, 40.4406],
        [-79.9659, 40.4506],
        [-79.9559, 40.4406],
        [-79.9659, 40.4306],
        [-79.9759, 40.4406]
      ]]
    },
    population: 29000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  // NEW JERSEY Food Deserts  
  {
    id: '6',
    name: 'Camden, NJ',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-75.1197, 39.9259],
        [-75.1097, 39.9359],
        [-75.0997, 39.9259],
        [-75.1097, 39.9159],
        [-75.1197, 39.9259]
      ]]
    },
    population: 71000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '6a',
    name: 'Newark NJ Central',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-74.1723, 40.7282],
        [-74.1623, 40.7382],
        [-74.1523, 40.7282],
        [-74.1623, 40.7182],
        [-74.1723, 40.7282]
      ]]
    },
    population: 49000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '6b',
    name: 'Trenton NJ',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-74.7429, 40.2206],
        [-74.7329, 40.2306],
        [-74.7229, 40.2206],
        [-74.7329, 40.2106],
        [-74.7429, 40.2206]
      ]]
    },
    population: 32000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  // SOUTHERN STATES Food Deserts
  {
    id: '7',
    name: 'Rural Mississippi Delta',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-90.9071, 33.4735],
        [-90.8971, 33.4835],
        [-90.8871, 33.4735],
        [-90.8971, 33.4635],
        [-90.9071, 33.4735]
      ]]
    },
    population: 28000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '8',
    name: 'Rural Alabama',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-86.7911, 32.3617],
        [-86.7811, 32.3717],
        [-86.7711, 32.3617],
        [-86.7811, 32.3517],
        [-86.7911, 32.3617]
      ]]
    },
    population: 15000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '9s',
    name: 'Birmingham Alabama South',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-86.8025, 33.4734],
        [-86.7925, 33.4834],
        [-86.7825, 33.4734],
        [-86.7925, 33.4634],
        [-86.8025, 33.4734]
      ]]
    },
    population: 36000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '10s',
    name: 'Memphis Tennessee',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-90.0490, 35.1495],
        [-90.0390, 35.1595],
        [-90.0290, 35.1495],
        [-90.0390, 35.1395],
        [-90.0490, 35.1495]
      ]]
    },
    population: 52000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '11s',
    name: 'Nashville East',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-86.7816, 36.1627],
        [-86.7716, 36.1727],
        [-86.7616, 36.1627],
        [-86.7716, 36.1527],
        [-86.7816, 36.1627]
      ]]
    },
    population: 31000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '12s',
    name: 'Atlanta Southwest',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-84.4479, 33.6937],
        [-84.4379, 33.7037],
        [-84.4279, 33.6937],
        [-84.4379, 33.6837],
        [-84.4479, 33.6937]
      ]]
    },
    population: 67000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '13s',
    name: 'New Orleans East',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-89.9254, 30.0096],
        [-89.9154, 30.0196],
        [-89.9054, 30.0096],
        [-89.9154, 29.9996],
        [-89.9254, 30.0096]
      ]]
    },
    population: 44000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '14s',
    name: 'Little Rock Arkansas',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-92.2896, 34.7465],
        [-92.2796, 34.7565],
        [-92.2696, 34.7465],
        [-92.2796, 34.7365],
        [-92.2896, 34.7465]
      ]]
    },
    population: 28000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  // Rwanda Agricultural Zones (Food Sources)
  {
    id: '9',
    name: 'Northern Province - Potato Belt',
    country: 'Rwanda',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [29.6308, -1.4673],
        [29.7308, -1.3673],
        [29.8308, -1.4673],
        [29.7308, -1.5673],
        [29.6308, -1.4673]
      ]]
    },
    population: 45000,
    severity: 'food_source',
    cropType: 'potatoes',
    lastUpdated: new Date(),
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '10',
    name: 'Eastern Province - Rice Fields',
    country: 'Rwanda',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [30.5419, -2.0706],
        [30.6419, -1.9706],
        [30.7419, -2.0706],
        [30.6419, -2.1706],
        [30.5419, -2.0706]
      ]]
    },
    population: 38000,
    severity: 'food_source',
    cropType: 'rice',
    lastUpdated: new Date(),
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '11',
    name: 'Southern Province - Coffee & Maize',
    country: 'Rwanda',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [29.7419, -2.6706],
        [29.8419, -2.5706],
        [29.9419, -2.6706],
        [29.8419, -2.7706],
        [29.7419, -2.6706]
      ]]
    },
    population: 52000,
    severity: 'food_source',
    cropType: 'coffee_maize',
    lastUpdated: new Date(),
    createdAt: new Date('2024-02-01'),
  },

  // MASSIVE EXPANSION - ADDITIONAL US FOOD DESERTS (MIDWEST)
  {
    id: '100',
    name: 'Gary, Indiana',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-87.3464, 41.5936],
        [-87.3364, 41.6036],
        [-87.3264, 41.5936],
        [-87.3364, 41.5836],
        [-87.3464, 41.5936]
      ]]
    },
    population: 31000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '101',
    name: 'East St. Louis, IL',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-90.1540, 38.6247],
        [-90.1440, 38.6347],
        [-90.1340, 38.6247],
        [-90.1440, 38.6147],
        [-90.1540, 38.6247]
      ]]
    },
    population: 26000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '102',
    name: 'Rockford, IL West Side',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-89.0940, 42.2711],
        [-89.0840, 42.2811],
        [-89.0740, 42.2711],
        [-89.0840, 42.2611],
        [-89.0940, 42.2711]
      ]]
    },
    population: 18000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '103',
    name: 'Peoria, IL South Side',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-89.5889, 40.6936],
        [-89.5789, 40.7036],
        [-89.5689, 40.6936],
        [-89.5789, 40.6836],
        [-89.5889, 40.6936]
      ]]
    },
    population: 22000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '104',
    name: 'Muncie, Indiana',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-85.3863, 40.1934],
        [-85.3763, 40.2034],
        [-85.3663, 40.1934],
        [-85.3763, 40.1834],
        [-85.3863, 40.1934]
      ]]
    },
    population: 19000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '105',
    name: 'South Bend, Indiana',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-86.2520, 41.6764],
        [-86.2420, 41.6864],
        [-86.2320, 41.6764],
        [-86.2420, 41.6664],
        [-86.2520, 41.6764]
      ]]
    },
    population: 33000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '106',
    name: 'Fort Wayne, Indiana East',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-85.1394, 41.1306],
        [-85.1294, 41.1406],
        [-85.1194, 41.1306],
        [-85.1294, 41.1206],
        [-85.1394, 41.1306]
      ]]
    },
    population: 24000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '107',
    name: 'Hammond, Indiana',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-87.5000, 41.5833],
        [-87.4900, 41.5933],
        [-87.4800, 41.5833],
        [-87.4900, 41.5733],
        [-87.5000, 41.5833]
      ]]
    },
    population: 20000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '108',
    name: 'Evansville, Indiana',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-87.5711, 37.9775],
        [-87.5611, 37.9875],
        [-87.5511, 37.9775],
        [-87.5611, 37.9675],
        [-87.5711, 37.9775]
      ]]
    },
    population: 17000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },

  // WISCONSIN FOOD DESERTS
  {
    id: '110',
    name: 'Milwaukee North Side',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-87.9065, 43.0389],
        [-87.8965, 43.0489],
        [-87.8865, 43.0389],
        [-87.8965, 43.0289],
        [-87.9065, 43.0389]
      ]]
    },
    population: 45000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '111',
    name: 'Racine, Wisconsin',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-87.7826, 42.7261],
        [-87.7726, 42.7361],
        [-87.7626, 42.7261],
        [-87.7726, 42.7161],
        [-87.7826, 42.7261]
      ]]
    },
    population: 16000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '112',
    name: 'Kenosha, Wisconsin',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-87.8211, 42.5847],
        [-87.8111, 42.5947],
        [-87.8011, 42.5847],
        [-87.8111, 42.5747],
        [-87.8211, 42.5847]
      ]]
    },
    population: 21000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },

  // MISSOURI FOOD DESERTS
  {
    id: '115',
    name: 'North St. Louis',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-90.1994, 38.6270],
        [-90.1894, 38.6370],
        [-90.1794, 38.6270],
        [-90.1894, 38.6170],
        [-90.1994, 38.6270]
      ]]
    },
    population: 52000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '116',
    name: 'Kansas City East',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-94.5786, 39.0997],
        [-94.5686, 39.1097],
        [-94.5586, 39.0997],
        [-94.5686, 39.0897],
        [-94.5786, 39.0997]
      ]]
    },
    population: 41000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '117',
    name: 'Springfield, Missouri',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-93.2923, 37.2153],
        [-93.2823, 37.2253],
        [-93.2723, 37.2153],
        [-93.2823, 37.2053],
        [-93.2923, 37.2153]
      ]]
    },
    population: 19000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },

  // SOUTHERN STATES - MASSIVE EXPANSION
  {
    id: '120',
    name: 'Birmingham, Alabama South',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-86.8025, 33.5207],
        [-86.7925, 33.5307],
        [-86.7825, 33.5207],
        [-86.7925, 33.5107],
        [-86.8025, 33.5207]
      ]]
    },
    population: 38000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '121',
    name: 'Mobile, Alabama',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-88.0431, 30.6944],
        [-88.0331, 30.7044],
        [-88.0231, 30.6944],
        [-88.0331, 30.6844],
        [-88.0431, 30.6944]
      ]]
    },
    population: 25000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '122',
    name: 'Montgomery, Alabama',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-86.3009, 32.3668],
        [-86.2909, 32.3768],
        [-86.2809, 32.3668],
        [-86.2909, 32.3568],
        [-86.3009, 32.3668]
      ]]
    },
    population: 27000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '123',
    name: 'Atlanta South Side',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-84.3880, 33.7490],
        [-84.3780, 33.7590],
        [-84.3680, 33.7490],
        [-84.3780, 33.7390],
        [-84.3880, 33.7490]
      ]]
    },
    population: 47000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '124',
    name: 'Savannah, Georgia',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-81.1637, 32.0835],
        [-81.1537, 32.0935],
        [-81.1437, 32.0835],
        [-81.1537, 32.0735],
        [-81.1637, 32.0835]
      ]]
    },
    population: 22000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '125',
    name: 'Augusta, Georgia',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-81.9748, 33.4735],
        [-81.9648, 33.4835],
        [-81.9548, 33.4735],
        [-81.9648, 33.4635],
        [-81.9748, 33.4735]
      ]]
    },
    population: 19000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '126',
    name: 'Charleston, South Carolina',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-79.9311, 32.7765],
        [-79.9211, 32.7865],
        [-79.9111, 32.7765],
        [-79.9211, 32.7665],
        [-79.9311, 32.7765]
      ]]
    },
    population: 18000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '127',
    name: 'Columbia, South Carolina',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-81.0348, 34.0007],
        [-81.0248, 34.0107],
        [-81.0148, 34.0007],
        [-81.0248, 33.9907],
        [-81.0348, 34.0007]
      ]]
    },
    population: 24000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '128',
    name: 'Charlotte, North Carolina East',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-80.8431, 35.2271],
        [-80.8331, 35.2371],
        [-80.8231, 35.2271],
        [-80.8331, 35.2171],
        [-80.8431, 35.2271]
      ]]
    },
    population: 35000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '129',
    name: 'Greensboro, North Carolina',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-79.7919, 36.0726],
        [-79.7819, 36.0826],
        [-79.7719, 36.0726],
        [-79.7819, 36.0626],
        [-79.7919, 36.0726]
      ]]
    },
    population: 21000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '130',
    name: 'Durham, North Carolina',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-78.8986, 35.9940],
        [-78.8886, 36.0040],
        [-78.8786, 35.9940],
        [-78.8886, 35.9840],
        [-78.8986, 35.9940]
      ]]
    },
    population: 26000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },

  // TENNESSEE & KENTUCKY
  {
    id: '135',
    name: 'Memphis, Tennessee North',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-90.0490, 35.1495],
        [-90.0390, 35.1595],
        [-90.0290, 35.1495],
        [-90.0390, 35.1395],
        [-90.0490, 35.1495]
      ]]
    },
    population: 41000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '136',
    name: 'Nashville, Tennessee East',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-86.7816, 36.1627],
        [-86.7716, 36.1727],
        [-86.7616, 36.1627],
        [-86.7716, 36.1527],
        [-86.7816, 36.1627]
      ]]
    },
    population: 32000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '137',
    name: 'Knoxville, Tennessee',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-83.9207, 35.9606],
        [-83.9107, 35.9706],
        [-83.9007, 35.9606],
        [-83.9107, 35.9506],
        [-83.9207, 35.9606]
      ]]
    },
    population: 19000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '138',
    name: 'Louisville, Kentucky West',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-85.7585, 38.2527],
        [-85.7485, 38.2627],
        [-85.7385, 38.2527],
        [-85.7485, 38.2427],
        [-85.7585, 38.2527]
      ]]
    },
    population: 36000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '139',
    name: 'Lexington, Kentucky',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-84.5037, 38.0406],
        [-84.4937, 38.0506],
        [-84.4837, 38.0406],
        [-84.4937, 38.0306],
        [-84.5037, 38.0406]
      ]]
    },
    population: 23000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },

  // WEST VIRGINIA & VIRGINIA
  {
    id: '140',
    name: 'Charleston, West Virginia',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-81.6326, 38.3498],
        [-81.6226, 38.3598],
        [-81.6126, 38.3498],
        [-81.6226, 38.3398],
        [-81.6326, 38.3498]
      ]]
    },
    population: 14000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '141',
    name: 'Huntington, West Virginia',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-82.4452, 38.4192],
        [-82.4352, 38.4292],
        [-82.4252, 38.4192],
        [-82.4352, 38.4092],
        [-82.4452, 38.4192]
      ]]
    },
    population: 16000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '142',
    name: 'Norfolk, Virginia',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-76.2859, 36.8508],
        [-76.2759, 36.8608],
        [-76.2659, 36.8508],
        [-76.2759, 36.8408],
        [-76.2859, 36.8508]
      ]]
    },
    population: 28000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '143',
    name: 'Richmond, Virginia South',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-77.4360, 37.5407],
        [-77.4260, 37.5507],
        [-77.4160, 37.5407],
        [-77.4260, 37.5307],
        [-77.4360, 37.5407]
      ]]
    },
    population: 32000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },

  // ARKANSAS & LOUISIANA
  {
    id: '145',
    name: 'Little Rock, Arkansas',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-92.2896, 34.7465],
        [-92.2796, 34.7565],
        [-92.2696, 34.7465],
        [-92.2796, 34.7365],
        [-92.2896, 34.7465]
      ]]
    },
    population: 21000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '146',
    name: 'New Orleans East',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-90.0715, 29.9511],
        [-90.0615, 29.9611],
        [-90.0515, 29.9511],
        [-90.0615, 29.9411],
        [-90.0715, 29.9511]
      ]]
    },
    population: 43000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '147',
    name: 'Baton Rouge, Louisiana',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-91.1871, 30.4515],
        [-91.1771, 30.4615],
        [-91.1671, 30.4515],
        [-91.1771, 30.4415],
        [-91.1871, 30.4515]
      ]]
    },
    population: 26000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '148',
    name: 'Shreveport, Louisiana',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-93.7502, 32.5252],
        [-93.7402, 32.5352],
        [-93.7302, 32.5252],
        [-93.7402, 32.5152],
        [-93.7502, 32.5252]
      ]]
    },
    population: 18000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },

  // OKLAHOMA & KANSAS
  {
    id: '150',
    name: 'Oklahoma City East',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-97.5164, 35.4676],
        [-97.5064, 35.4776],
        [-97.4964, 35.4676],
        [-97.5064, 35.4576],
        [-97.5164, 35.4676]
      ]]
    },
    population: 29000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '151',
    name: 'Tulsa, Oklahoma North',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-95.9328, 36.1540],
        [-95.9228, 36.1640],
        [-95.9128, 36.1540],
        [-95.9228, 36.1440],
        [-95.9328, 36.1540]
      ]]
    },
    population: 24000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '152',
    name: 'Wichita, Kansas East',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-97.3301, 37.6872],
        [-97.3201, 37.6972],
        [-97.3101, 37.6872],
        [-97.3201, 37.6772],
        [-97.3301, 37.6872]
      ]]
    },
    population: 20000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '153',
    name: 'Topeka, Kansas',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-95.6890, 39.0473],
        [-95.6790, 39.0573],
        [-95.6690, 39.0473],
        [-95.6790, 39.0373],
        [-95.6890, 39.0473]
      ]]
    },
    population: 15000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },

  // NEBRASKA & IOWA
  {
    id: '155',
    name: 'Omaha, Nebraska North',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-95.9345, 41.2524],
        [-95.9245, 41.2624],
        [-95.9145, 41.2524],
        [-95.9245, 41.2424],
        [-95.9345, 41.2524]
      ]]
    },
    population: 22000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '156',
    name: 'Des Moines, Iowa East',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-93.6091, 41.5868],
        [-93.5991, 41.5968],
        [-93.5891, 41.5868],
        [-93.5991, 41.5768],
        [-93.6091, 41.5868]
      ]]
    },
    population: 18000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '157',
    name: 'Cedar Rapids, Iowa',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-91.6665, 41.9778],
        [-91.6565, 41.9878],
        [-91.6465, 41.9778],
        [-91.6565, 41.9678],
        [-91.6665, 41.9778]
      ]]
    },
    population: 14000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },

  // NORTH DAKOTA & SOUTH DAKOTA
  {
    id: '160',
    name: 'Fargo, North Dakota',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-96.7898, 46.8772],
        [-96.7798, 46.8872],
        [-96.7698, 46.8772],
        [-96.7798, 46.8672],
        [-96.7898, 46.8772]
      ]]
    },
    population: 11000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '161',
    name: 'Sioux Falls, South Dakota',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-96.7311, 43.5446],
        [-96.7211, 43.5546],
        [-96.7111, 43.5446],
        [-96.7211, 43.5346],
        [-96.7311, 43.5446]
      ]]
    },
    population: 13000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },

  // MINNESOTA
  {
    id: '165',
    name: 'Minneapolis North',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-93.2650, 44.9778],
        [-93.2550, 44.9878],
        [-93.2450, 44.9778],
        [-93.2550, 44.9678],
        [-93.2650, 44.9778]
      ]]
    },
    population: 34000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '166',
    name: 'St. Paul East',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-93.0942, 44.9537],
        [-93.0842, 44.9637],
        [-93.0742, 44.9537],
        [-93.0842, 44.9437],
        [-93.0942, 44.9537]
      ]]
    },
    population: 26000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '167',
    name: 'Duluth, Minnesota',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-92.1005, 46.7867],
        [-92.0905, 46.7967],
        [-92.0805, 46.7867],
        [-92.0905, 46.7767],
        [-92.1005, 46.7867]
      ]]
    },
    population: 12000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },

  // MOUNTAIN WEST
  {
    id: '170',
    name: 'Denver East',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-104.9903, 39.7392],
        [-104.9803, 39.7492],
        [-104.9703, 39.7392],
        [-104.9803, 39.7292],
        [-104.9903, 39.7392]
      ]]
    },
    population: 31000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '171',
    name: 'Colorado Springs East',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-104.8214, 38.8339],
        [-104.8114, 38.8439],
        [-104.8014, 38.8339],
        [-104.8114, 38.8239],
        [-104.8214, 38.8339]
      ]]
    },
    population: 19000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '172',
    name: 'Salt Lake City West',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-111.8910, 40.7608],
        [-111.8810, 40.7708],
        [-111.8710, 40.7608],
        [-111.8810, 40.7508],
        [-111.8910, 40.7608]
      ]]
    },
    population: 17000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '173',
    name: 'Phoenix South',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-112.0740, 33.4484],
        [-112.0640, 33.4584],
        [-112.0540, 33.4484],
        [-112.0640, 33.4384],
        [-112.0740, 33.4484]
      ]]
    },
    population: 38000,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '174',
    name: 'Tucson East',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-110.9265, 32.2217],
        [-110.9165, 32.2317],
        [-110.9065, 32.2217],
        [-110.9165, 32.2117],
        [-110.9265, 32.2217]
      ]]
    },
    population: 23000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '175',
    name: 'Albuquerque Southwest',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-106.6504, 35.0844],
        [-106.6404, 35.0944],
        [-106.6304, 35.0844],
        [-106.6404, 35.0744],
        [-106.6504, 35.0844]
      ]]
    },
    population: 21000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '176',
    name: 'Las Vegas North',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-115.1398, 36.1699],
        [-115.1298, 36.1799],
        [-115.1198, 36.1699],
        [-115.1298, 36.1599],
        [-115.1398, 36.1699]
      ]]
    },
    population: 29000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },

  // PACIFIC NORTHWEST
  {
    id: '180',
    name: 'Seattle South',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-122.3321, 47.6062],
        [-122.3221, 47.6162],
        [-122.3121, 47.6062],
        [-122.3221, 47.5962],
        [-122.3321, 47.6062]
      ]]
    },
    population: 28000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '181',
    name: 'Spokane East',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-117.4260, 47.6588],
        [-117.4160, 47.6688],
        [-117.4060, 47.6588],
        [-117.4160, 47.6488],
        [-117.4260, 47.6588]
      ]]
    },
    population: 16000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '182',
    name: 'Tacoma South',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-122.4443, 47.2529],
        [-122.4343, 47.2629],
        [-122.4243, 47.2529],
        [-122.4343, 47.2429],
        [-122.4443, 47.2529]
      ]]
    },
    population: 19000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '183',
    name: 'Portland East',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-122.6587, 45.5152],
        [-122.6487, 45.5252],
        [-122.6387, 45.5152],
        [-122.6487, 45.5052],
        [-122.6587, 45.5152]
      ]]
    },
    population: 24000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '184',
    name: 'Eugene, Oregon',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-123.0868, 44.0521],
        [-123.0768, 44.0621],
        [-123.0668, 44.0521],
        [-123.0768, 44.0421],
        [-123.0868, 44.0521]
      ]]
    },
    population: 13000,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },

  // RURAL AREAS - MASSIVE RURAL EXPANSION
  {
    id: '200',
    name: 'Rural Eastern Kentucky',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-82.7326, 37.0235],
        [-82.7226, 37.0335],
        [-82.7126, 37.0235],
        [-82.7226, 37.0135],
        [-82.7326, 37.0235]
      ]]
    },
    population: 8500,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '201',
    name: 'Rural West Virginia Coal Country',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-81.0892, 37.7793],
        [-81.0792, 37.7893],
        [-81.0692, 37.7793],
        [-81.0792, 37.7693],
        [-81.0892, 37.7793]
      ]]
    },
    population: 6200,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '202',
    name: 'Rural Arkansas Delta',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-91.2071, 35.2370],
        [-91.1971, 35.2470],
        [-91.1871, 35.2370],
        [-91.1971, 35.2270],
        [-91.2071, 35.2370]
      ]]
    },
    population: 7800,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '203',
    name: 'Rural Louisiana',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-92.4426, 30.2241],
        [-92.4326, 30.2341],
        [-92.4226, 30.2241],
        [-92.4326, 30.2141],
        [-92.4426, 30.2241]
      ]]
    },
    population: 5900,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '204',
    name: 'Rural North Dakota',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-100.7837, 47.9253],
        [-100.7737, 47.9353],
        [-100.7637, 47.9253],
        [-100.7737, 47.9153],
        [-100.7837, 47.9253]
      ]]
    },
    population: 4200,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '205',
    name: 'Rural Montana',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-108.5007, 45.7833],
        [-108.4907, 45.7933],
        [-108.4807, 45.7833],
        [-108.4907, 45.7733],
        [-108.5007, 45.7833]
      ]]
    },
    population: 3800,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '206',
    name: 'Rural Wyoming',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-107.2903, 42.8666],
        [-107.2803, 42.8766],
        [-107.2703, 42.8666],
        [-107.2803, 42.8566],
        [-107.2903, 42.8666]
      ]]
    },
    population: 2900,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '207',
    name: 'Rural Idaho',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-115.0728, 44.0682],
        [-115.0628, 44.0782],
        [-115.0528, 44.0682],
        [-115.0628, 44.0582],
        [-115.0728, 44.0682]
      ]]
    },
    population: 3400,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '208',
    name: 'Rural Nevada',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-117.0228, 39.5296],
        [-117.0128, 39.5396],
        [-117.0028, 39.5296],
        [-117.0128, 39.5196],
        [-117.0228, 39.5296]
      ]]
    },
    population: 2700,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '209',
    name: 'Rural Utah',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-111.0488, 39.3210],
        [-111.0388, 39.3310],
        [-111.0288, 39.3210],
        [-111.0388, 39.3110],
        [-111.0488, 39.3210]
      ]]
    },
    population: 3100,
    severity: 'medium',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '210',
    name: 'Rural New Mexico',
    country: 'USA',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [-105.8701, 34.5199],
        [-105.8601, 34.5299],
        [-105.8501, 34.5199],
        [-105.8601, 34.5099],
        [-105.8701, 34.5199]
      ]]
    },
    population: 4600,
    severity: 'high',
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01'),
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country')

    let filteredDeserts = mockFoodDeserts

    if (country && country !== 'all') {
      filteredDeserts = mockFoodDeserts.filter(desert => desert.country === country)
    }

    return NextResponse.json({
      success: true,
      data: filteredDeserts,
      total: filteredDeserts.length,
    })
  } catch (error) {
    console.error('Error fetching food deserts:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch food deserts',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, country, polygon, population, severity, cropType } = body

    // Validate required fields
    if (!name || !country || !polygon) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: name, country, polygon',
        },
        { status: 400 }
      )
    }

    // Here you would normally save to database
    const newFoodDesert = {
      id: (mockFoodDeserts.length + 1).toString(),
      name,
      country,
      polygon,
      population: population || undefined,
      severity: severity || 'medium',
      cropType: cropType || undefined,
      lastUpdated: new Date(),
      createdAt: new Date(),
    }

    mockFoodDeserts.push(newFoodDesert)

    return NextResponse.json({
      success: true,
      data: newFoodDesert,
      message: 'Food desert created successfully',
    })
  } catch (error) {
    console.error('Error creating food desert:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create food desert',
      },
      { status: 500 }
    )
  }
}
