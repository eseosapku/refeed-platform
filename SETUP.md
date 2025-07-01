# RefeedPlatform Setup Guide

This guide explains how to set up the RefeedPlatform locally, including the Kaggle data integration for real food desert data.

## Prerequisites

- Node.js 18+ 
- Python 3.7+
- Git

## Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/eseosapku/refeed-platform.git
   cd refeed-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## Kaggle Data Integration Setup

To use real food desert data from Kaggle datasets, follow these steps:

### 1. Install Kaggle CLI

```bash
# Install Kaggle package
pip install kaggle

# Or using conda
conda install -c conda-forge kaggle
```

### 2. Get Kaggle API Credentials

1. Go to [Kaggle.com](https://www.kaggle.com) and sign in
2. Go to "Account" → "API" → "Create New API Token"
3. Download the `kaggle.json` file

### 3. Configure Kaggle API

**Windows:**
```bash
# Create .kaggle directory
mkdir %USERPROFILE%\.kaggle

# Copy kaggle.json to the .kaggle directory
copy kaggle.json %USERPROFILE%\.kaggle\kaggle.json

# Set permissions (if using WSL or Git Bash)
chmod 600 ~/.kaggle/kaggle.json
```

**Mac/Linux:**
```bash
# Create .kaggle directory
mkdir ~/.kaggle

# Copy kaggle.json to the .kaggle directory
cp kaggle.json ~/.kaggle/kaggle.json

# Set permissions
chmod 600 ~/.kaggle/kaggle.json
```

### 4. Download and Process Data

1. **Navigate to Admin Panel:**
   - Go to `http://localhost:3000/admin`
   - Scroll to "Kaggle Dataset Integration" section

2. **Download Datasets:**
   - Click "Download All High Priority" to get the food desert data
   - Wait for the download to complete

3. **Process Data:**
   - Click "Process Food Deserts" to convert raw data to usable format
   - This creates processed files with 9,245+ food desert locations

### 5. Use Real Data

1. **In the Map View:**
   - Go to `http://localhost:3000/map`
   - Toggle "Real Data" to use actual USDA food desert data
   - Download CSV files using the "Download CSV" button

## Data Sources

The platform integrates several high-quality datasets:

### Food Deserts
- **Dataset:** USDA Food Access Research Atlas
- **Source:** Kaggle - tcrammond/food-access-and-food-deserts
- **Size:** 72,864+ records, 9,245+ food desert areas
- **Granularity:** Census tract level

### US Food Prices
- **Dataset:** US Fruit and Vegetable Prices
- **Source:** Kaggle - laurenainsleyhaines/united-states-fruit-and-vegetable-prices
- **Coverage:** Historical price data 2013-2022

### Global Food Prices
- **Dataset:** Global Food Prices Database (WFP)
- **Source:** Kaggle - alhamomarhotaki/global-food-prices-database-wfp
- **Coverage:** Worldwide food commodity prices

## CSV Download Features

The platform supports downloading data in CSV format:

### From Map View
- Click "Download CSV" button
- Gets data based on current mode (Real Data/Mock Data)
- Includes all demographic and access metrics

### From Admin Panel
- Navigate to Admin → Kaggle Integration
- Click "Download Food Deserts CSV"
- Downloads processed dataset directly

### CSV Contents
The CSV files include:
- Basic Info: ID, Name, Census Tract, State, County
- Demographics: Population, Low Income, Seniors, Children
- Access Metrics: Distance-based food access data
- Geographic: Latitude, Longitude coordinates

## File Structure

```
refeed-platform/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── food-deserts/
│   │   │   │   └── download/          # CSV download endpoint
│   │   │   ├── food-deserts-kaggle/   # Real data API
│   │   │   └── kaggle/                # Kaggle integration API
│   │   ├── map/                       # Map view with data toggle
│   │   └── admin/                     # Admin dashboard
│   └── lib/
│       └── kaggleDataService.ts       # Kaggle data processing
├── data/kaggle/                       # Downloaded datasets (ignored)
└── setup-kaggle.js                    # Setup scripts
```

## Development Notes

### Large Files
- Raw Kaggle datasets are excluded from Git (see `.gitignore`)
- Only processed JSON files are committed
- Developers need to download datasets locally

### Real Data Mode
- Toggle between mock and real data in the UI
- Real data provides census tract-level precision
- Mock data for development when Kaggle isn't configured

### Error Handling
- Graceful fallback to mock data if Kaggle fails
- Status indicators in admin panel
- Comprehensive error messages

## Troubleshooting

### Kaggle API Issues
- Verify `kaggle.json` is in correct location
- Check file permissions (`chmod 600`)
- Ensure Kaggle account is verified

### Download Failures
- Check internet connection
- Verify Kaggle API quota
- Try downloading individual datasets

### Data Processing Issues
- Ensure Python/pip are installed
- Check disk space (datasets are large)
- Verify CSV file integrity

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the setup guide
4. Make changes
5. Test with both mock and real data
6. Submit a pull request

## License

This project is licensed under the MIT License.
