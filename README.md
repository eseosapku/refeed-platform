# ReFeed - Food Desert Mapping & Waste Redirection Platform

🌐 **A data-driven platform that helps solve food insecurity by mapping food deserts, redirecting edible food waste, and monitoring live food prices.**

![ReFeed Platform](https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200&h=400&fit=crop)

## 🚀 Features

### 🗺️ Food Desert Mapping Module
- **Interactive Map**: Visualize food deserts in the U.S. and Rwanda
- **GeoJSON Upload**: Admin can upload new food desert boundaries
- **Real-time Data**: Integration with USDA Food Desert Atlas API
- **Satellite Integration**: Google Earth Engine for Rwanda mapping

### ♻️ Edible Food Waste Redirection Module
- **Donor Registration**: Supermarkets, farms, and distributors can register
- **Food Logging**: Track donations with expiry dates and conditions
- **Smart Matching**: Automatic matching with nearest food deserts
- **AI Classification**: Optional image-based food condition assessment

### 📈 Food Price Watch Module
- **Live Price Monitoring**: Track food prices across regions
- **Price Spike Alerts**: Automatic alerts when prices increase >20%
- **Multiple Data Sources**: Manual input, scraping, and API integration
- **Trend Visualization**: Historical price charts and analytics

### 🔄 Matchmaking Engine
- **Automated Matching**: Cron-based matching algorithm
- **Priority Routing**: Price spikes trigger high-priority matches
- **Distance Optimization**: Efficient route planning
- **Real-time Notifications**: Instant alerts for matches

### 📊 Admin Dashboard
- **Comprehensive Overview**: System statistics and metrics
- **Activity Monitoring**: Real-time activity feed
- **Manual Controls**: Trigger matchmaking and manage data
- **Export Capabilities**: Download data for analysis
- **CSV Downloads**: Export food desert data in CSV format
- **Kaggle Integration**: Real dataset management and processing

## 📈 Data Integration

### Real Dataset Support
- **USDA Food Access Research Atlas**: 9,245+ food desert areas at census tract level
- **Kaggle Integration**: Automated download and processing of authoritative datasets
- **CSV Export**: Download comprehensive food desert data with demographics
- **Data Source Toggle**: Switch between mock and real data in the UI

### Supported Datasets
- Food Access & Food Deserts (USDA)
- US Fruit & Vegetable Prices (Historical 2013-2022)
- Global Food Prices Database (World Food Programme)
- Rwanda Food Prices Dataset

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - Full-stack React framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Leaflet.js** - Interactive mapping
- **Recharts** - Data visualization

### Backend
- **Next.js API Routes** - Serverless functions
- **Firebase/Firestore** - Database and authentication
- **Node.js** - Server-side runtime

### Key Libraries
- `react-leaflet` - React Leaflet integration
- `react-hook-form` - Form handling
- `zod` - Schema validation
- `date-fns` - Date manipulation
- `lucide-react` - Modern icons

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Firebase project (for production)
- Mapbox account (optional, for advanced mapping)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd refeed-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.local.example .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **For real data integration** (optional)
   - See [SETUP.md](./SETUP.md) for detailed Kaggle API configuration
   - Download datasets via Admin panel (`/admin`)
   - Toggle "Real Data" mode in the map view

6. **Access the application**
   - Open `http://localhost:3000`
   - Admin dashboard: `http://localhost:3000/admin`
   - Interactive map: `http://localhost:3000/map`

### Quick Demo
1. Visit the map at `/map`
2. Toggle between "Mock Data" and "Real Data" modes  
3. Download food desert data as CSV
4. Explore the admin dashboard for dataset management

## 📱 Usage Guide

### For Food Donors
1. **Register**: Visit `/donors/register` to sign up
2. **Log Donations**: Add food items with expiry dates
3. **Track Matches**: Monitor your donation impact
4. **Receive Notifications**: Get alerts when matches are found

### For Administrators
1. **Access Dashboard**: Visit `/admin` for overview
2. **Upload Food Desert Data**: Use GeoJSON upload feature
3. **Monitor Prices**: Track price spikes and alerts
4. **Run Matchmaking**: Trigger automated matching engine

### For Price Agents
1. **Input Prices**: Use `/prices` to add regional price data
2. **Monitor Trends**: View price charts and historical data
3. **Set Alerts**: Configure price spike thresholds

## 🔧 API Endpoints

### Food Deserts
- `GET /api/food-deserts` - List food deserts
- `POST /api/food-deserts` - Create food desert (admin)

### Donors
- `GET /api/donors` - List donors
- `POST /api/donors` - Register new donor

### Donations
- `GET /api/donations` - List donations
- `POST /api/donations` - Log new donation

### Prices
- `GET /api/prices` - Get price data
- `POST /api/prices` - Add price entry

### Matches
- `GET /api/matches` - List matches
- `POST /api/matches` - Create/update matches

### Cron Jobs
- `POST /api/cron/matchmaking` - Run matchmaking engine

## 📊 Data Models

### Donor
```typescript
interface Donor {
  id: string
  name: string
  type: 'supermarket' | 'farm' | 'distributor' | 'restaurant'
  location: { lat: number; lng: number; address: string }
  contactInfo: { phone?: string; email?: string; contactPerson?: string }
  isActive: boolean
  registeredAt: Date
}
```

### Food Desert
```typescript
interface FoodDesert {
  id: string
  name: string
  country: 'USA' | 'Rwanda'
  polygon: GeoJSON.Polygon
  population?: number
  lastUpdated: Date
}
```

### Food Log
```typescript
interface FoodLog {
  id: string
  donorId: string
  foodType: string
  category: 'produce' | 'dairy' | 'meat' | 'grains' | 'prepared'
  condition: 'excellent' | 'good' | 'fair' | 'near-expiry'
  quantity: number
  expiryDate: Date
  isMatched: boolean
}
```

## 🌍 Deployment

### Vercel (Recommended)
1. **Connect Repository**: Import project to Vercel
2. **Configure Environment**: Add environment variables
3. **Deploy**: Automatic deployment on git push

### Manual Deployment
```bash
# Build production version
npm run build

# Start production server
npm start
```

## 🔒 Security & Authentication

- **Firebase Auth**: Role-based access control
- **API Protection**: Secured endpoints with authentication
- **Cron Job Security**: Bearer token authentication
- **Data Validation**: Input sanitization and validation

## 📈 Monitoring & Analytics

- **Price Spike Detection**: Automated >20% increase alerts
- **Match Success Rate**: Track delivery completion rates
- **Geographic Coverage**: Monitor food desert coverage
- **Donor Engagement**: Track donation frequency and volume

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder
- **Issues**: Open GitHub issues for bugs
- **Discussions**: Use GitHub Discussions for questions
- **Email**: contact@refeed.platform

## 🙏 Acknowledgments

- **USDA**: Food Desert Atlas data
- **OpenStreetMap**: Mapping infrastructure
- **Firebase**: Backend services
- **Vercel**: Hosting platform
- **Contributors**: All amazing developers who contributed

---

**Built with ❤️ to fight food insecurity through technology**

*ReFeed Platform - Connecting surplus food with communities in need*
