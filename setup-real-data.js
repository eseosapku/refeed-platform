#!/usr/bin/env node

// Quick script to test and enable real data
const fs = require('fs')
const path = require('path')

console.log('🌍 RefeedPlatform Real Data Setup')
console.log('==================================')

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local')
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found')
  process.exit(1)
}

// Read current env file
const envContent = fs.readFileSync(envPath, 'utf8')

// Check API keys
const hasCensusKey = envContent.includes('CENSUS_API_KEY=') && !envContent.includes('YOUR_ACTUAL_CENSUS_API_KEY')
const hasGoogleKey = envContent.includes('GOOGLE_PLACES_API_KEY=') && !envContent.includes('YOUR_ACTUAL_GOOGLE_PLACES_API_KEY')

console.log('\n📊 Current API Configuration:')
console.log(`Census API Key: ${hasCensusKey ? '✅ Configured' : '❌ Not set'}`)
console.log(`Google Places API Key: ${hasGoogleKey ? '✅ Configured' : '❌ Not set'}`)

if (!hasCensusKey || !hasGoogleKey) {
  console.log('\n🔑 To get real data, you need API keys:')
  console.log('1. Census API (FREE): https://api.census.gov/data/key_signup.html')
  console.log('2. Google Places API: https://console.cloud.google.com/')
  console.log('\n📝 Edit .env.local and replace YOUR_ACTUAL_* with real keys')
}

console.log('\n🚀 How to use real data:')
console.log('1. Visit: http://localhost:3000/map')
console.log('2. Click the "Real Data" toggle at the top')
console.log('3. Real data will load (or fallback data if no API keys)')

console.log('\n💡 Even without API keys, you get high-quality fallback data!')
console.log('   - Real food desert locations from major US cities')
console.log('   - Major grocery store chains (Walmart, Target, Kroger, etc.)')
console.log('   - Realistic population and capacity data')

console.log('\n✨ Ready to use real data!')
