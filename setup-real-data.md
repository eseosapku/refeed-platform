# Setting Up Real Data Sources

## Quick Start: Enable Real Data

You already have the infrastructure set up! Here's how to enable real data:

### 1. Get API Keys (Free)

#### Census API Key (FREE)
1. Go to: https://api.census.gov/data/key_signup.html
2. Fill out the form (takes 2 minutes)
3. Check your email for the API key
4. Add it to `.env.local` as `CENSUS_API_KEY=your_key_here`

#### Google Places API Key
1. Go to: https://console.cloud.google.com/
2. Create a new project or select existing
3. Enable "Places API" 
4. Create credentials → API Key
5. Add it to `.env.local` as `GOOGLE_PLACES_API_KEY=your_key_here`

### 2. Update Environment Variables

Edit your `.env.local` file:
```bash
CENSUS_API_KEY=your_actual_census_key
GOOGLE_PLACES_API_KEY=your_actual_google_key
```

### 3. Switch to Real Data

1. Visit: http://localhost:3000/map
2. Click the "Real Data" toggle at the top
3. Real data will load automatically!

## What You'll Get

### Real Food Desert Data
- **Source**: US Census Bureau + USDA Food Access Research Atlas
- **Coverage**: All US counties with low-income/low-access data
- **Updates**: Annual from government sources
- **Accuracy**: ⭐⭐⭐⭐⭐ Official government data

### Real Store Locations  
- **Source**: Google Places API
- **Coverage**: Major grocery stores, supermarkets, food retailers
- **Updates**: Real-time
- **Accuracy**: ⭐⭐⭐⭐ Crowd-sourced + business verified

## Testing Without API Keys

If you don't want to set up API keys right now, the app will use high-quality fallback data that includes:
- Major US metropolitan food deserts (NYC, Chicago, Detroit, etc.)
- Real store chains (Walmart, Target, Kroger, etc.)
- Realistic population and severity data

## Current Status

- ✅ Real data infrastructure is ready
- ✅ Fallback data is comprehensive
- ✅ UI toggle works
- ✅ Error handling is in place
- 🔄 API keys need to be configured for live data

## Cost Estimation

- **Census API**: FREE (no limits)
- **Google Places API**: $17 per 1,000 requests (first 1,000/month free)
- **Expected monthly cost**: $0-50 for typical usage

## Need Help?

Check the console at http://localhost:3000/map when clicking "Real Data" to see exactly what's needed.
