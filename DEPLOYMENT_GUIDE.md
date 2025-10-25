# Financial Hub - Deployment & Maintenance Guide

## 🚀 Current Deployment Status

### Live URLs (Temporary - Sandbox Environment)
- **Frontend**: https://3000-ia3vdv72j1jdrzr3skfxu-717b4444.manusvm.computer
- **Backend API**: https://3001-ia3vdv72j1jdrzr3skfxu-717b4444.manusvm.computer

**Note**: These URLs are temporary and only work while the sandbox is active. Follow the production deployment steps below for permanent hosting.

---

## 📦 What Was Built

### Backend (Node.js + Express + SQLite)
- **Location**: `backend/`
- **Features**:
  - User authentication with JWT tokens
  - Username/password registration and login
  - Account management (create, read, update, delete)
  - Financial entry tracking (cash, investments, debt)
  - RESTful API endpoints
  - SQLite database for data persistence

### Frontend (React + Vite + TypeScript)
- **Location**: `Financial Hub Dashboard/`
- **Features**:
  - Modern authentication UI (login/register)
  - Account management dashboard
  - Entry creation with date, cash, investments, and debt fields
  - Real-time net worth calculation
  - Interactive charts using Recharts
  - Responsive design with Tailwind CSS

### Database Schema
```sql
users
  - id (PRIMARY KEY)
  - username (UNIQUE)
  - password (hashed with bcrypt)
  - created_at

accounts
  - id (PRIMARY KEY)
  - user_id (FOREIGN KEY)
  - name
  - created_at

account_entries
  - id (PRIMARY KEY)
  - account_id (FOREIGN KEY)
  - entry_date
  - cash
  - investments
  - debt
  - created_at
```

---

## 🔧 Local Development Setup

### Prerequisites
- Node.js 18+ installed
- Git installed

### Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/puentesci/Finances-hub.git
   cd Finances-hub
   git checkout Manus-Full-stack
   ```

2. **Start the Backend**:
   ```bash
   cd backend
   npm install
   npm start
   # Backend runs on http://localhost:3001
   ```

3. **Start the Frontend** (in a new terminal):
   ```bash
   cd "Financial Hub Dashboard"
   npm install
   npm run dev
   # Frontend runs on http://localhost:3000
   ```

4. **Access the app**: Open http://localhost:3000 in your browser

---

## 🌐 Production Deployment Options

### Option 1: Vercel (Recommended for Frontend) + Railway (Backend)

#### Deploy Frontend to Vercel
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy frontend:
   ```bash
   cd "Financial Hub Dashboard"
   vercel
   ```

3. Set environment variable in Vercel dashboard:
   - `VITE_API_URL` = Your backend URL (e.g., https://your-app.up.railway.app/api)

#### Deploy Backend to Railway
1. Go to [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository and the `Manus-Full-stack` branch
4. Set root directory to `backend`
5. Add environment variables:
   - `PORT` = 3001
   - `JWT_SECRET` = (generate a strong random string)
   - `NODE_ENV` = production
6. Railway will auto-deploy and provide a public URL

### Option 2: Single Server Deployment (DigitalOcean/AWS/Heroku)

#### Using DigitalOcean Droplet
1. Create a Ubuntu 22.04 droplet
2. SSH into the server
3. Install Node.js and dependencies:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs build-essential
   ```

4. Clone and setup:
   ```bash
   git clone https://github.com/puentesci/Finances-hub.git
   cd Finances-hub
   git checkout Manus-Full-stack
   
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd "../Financial Hub Dashboard"
   npm install
   npm run build
   ```

5. Use PM2 to keep backend running:
   ```bash
   sudo npm install -g pm2
   cd ../backend
   pm2 start src/server.js --name financial-hub-api
   pm2 startup
   pm2 save
   ```

6. Setup Nginx as reverse proxy:
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/financial-hub
   ```

   Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       # Frontend
       location / {
           root /home/ubuntu/Finances-hub/Financial Hub Dashboard/build;
           try_files $uri $uri/ /index.html;
       }

       # Backend API
       location /api {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable and restart:
   ```bash
   sudo ln -s /etc/nginx/sites-available/financial-hub /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Option 3: Docker Deployment

Create `docker-compose.yml` in the root:
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - JWT_SECRET=your-secret-key
      - NODE_ENV=production
    volumes:
      - ./backend/database.sqlite:/app/database.sqlite

  frontend:
    build: ./Financial Hub Dashboard
    ports:
      - "3000:80"
    environment:
      - VITE_API_URL=http://localhost:3001/api
    depends_on:
      - backend
```

Deploy with:
```bash
docker-compose up -d
```

---

## 💾 Data Backup & Management

### Backing Up Your Database

The SQLite database is stored at `backend/database.sqlite`. To back it up:

```bash
# Manual backup
cp backend/database.sqlite backend/database.backup.$(date +%Y%m%d).sqlite

# Automated daily backup (add to crontab)
0 2 * * * cp /path/to/backend/database.sqlite /path/to/backups/database.$(date +\%Y\%m\%d).sqlite
```

### Exporting Your Data

Create a backup script `backend/scripts/export-data.js`:
```javascript
import db from '../src/config/database.js';
import fs from 'fs';

const userId = process.argv[2];
if (!userId) {
  console.error('Usage: node export-data.js <user_id>');
  process.exit(1);
}

const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
const accounts = db.prepare('SELECT * FROM accounts WHERE user_id = ?').all(userId);
const entries = db.prepare(`
  SELECT ae.* FROM account_entries ae
  JOIN accounts a ON ae.account_id = a.id
  WHERE a.user_id = ?
`).all(userId);

const exportData = {
  user: { id: user.id, username: user.username },
  accounts,
  entries,
  exportDate: new Date().toISOString()
};

fs.writeFileSync(`export-user-${userId}.json`, JSON.stringify(exportData, null, 2));
console.log(`Data exported to export-user-${userId}.json`);
```

Run with:
```bash
node backend/scripts/export-data.js 1
```

### Migrating to PostgreSQL (For Production Scale)

When you need more robust database features:

1. Install PostgreSQL adapter:
   ```bash
   npm install pg
   ```

2. Update `backend/src/config/database.js` to use PostgreSQL
3. Use a migration tool like [Knex.js](https://knexjs.org/) or [Prisma](https://www.prisma.io/)

---

## 📱 Building an iOS App

### Option 1: React Native (Recommended)

React Native allows you to reuse your React knowledge and components.

#### Setup
```bash
npx react-native init FinancialHubApp
cd FinancialHubApp
npm install @react-navigation/native @react-navigation/stack
npm install axios react-native-chart-kit
```

#### Key Changes from Web to Mobile
1. Replace `fetch` with `axios` for better mobile support
2. Use `AsyncStorage` instead of `localStorage`
3. Replace Recharts with `react-native-chart-kit`
4. Use React Navigation instead of browser routing

#### Reusable Code
- All API service logic (`src/services/api.ts`)
- Business logic and state management
- Data models and interfaces

#### Example API Service Adaptation:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'https://your-backend-url.com/api';

class ApiService {
  async getAuthHeader() {
    const token = await AsyncStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async login(username: string, password: string) {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password
    });
    await AsyncStorage.setItem('token', response.data.token);
    await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  }
  // ... rest of methods
}
```

#### Building for iOS
```bash
cd ios
pod install
cd ..
npx react-native run-ios
```

#### Distributing to Friends (TestFlight)
1. Enroll in Apple Developer Program ($99/year)
2. Create app in App Store Connect
3. Build archive in Xcode
4. Upload to TestFlight
5. Add testers by email (up to 10,000 external testers)

### Option 2: Progressive Web App (PWA)

Convert your web app to a PWA for iOS home screen installation.

#### Add PWA Support
1. Create `public/manifest.json`:
```json
{
  "name": "Financial Hub",
  "short_name": "FinHub",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

2. Add to `index.html`:
```html
<link rel="manifest" href="/manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<link rel="apple-touch-icon" href="/icon-180.png">
```

3. Register service worker in `src/main.tsx`:
```typescript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

**Pros**: No app store approval, instant updates, works on Android too
**Cons**: Limited iOS features, no push notifications on iOS

### Option 3: Capacitor (Web-to-Native Bridge)

Capacitor wraps your web app in a native container.

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npm install @capacitor/ios
npx cap add ios
npx cap sync
npx cap open ios
```

Build in Xcode and distribute via TestFlight.

---

## 🔐 Security Best Practices

### Before Production
1. **Change JWT Secret**: Generate a strong random secret
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **Enable HTTPS**: Use Let's Encrypt for free SSL certificates
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

3. **Add Rate Limiting**: Prevent brute force attacks
   ```bash
   npm install express-rate-limit
   ```

4. **Secure Headers**: Add helmet.js
   ```bash
   npm install helmet
   ```

5. **Environment Variables**: Never commit `.env` files
   - Add `.env` to `.gitignore`
   - Use platform-specific secret management (Vercel Secrets, Railway Variables)

---

## 🚀 Future Improvements

### Phase 1: Enhanced Features
- [ ] Email verification for account recovery
- [ ] Multi-currency support
- [ ] Budget goals and alerts
- [ ] Recurring transaction templates
- [ ] Export to CSV/PDF reports
- [ ] Dark mode toggle

### Phase 2: Advanced Analytics
- [ ] Spending categories and pie charts
- [ ] Month-over-month comparison
- [ ] Predictive analytics (ML-based forecasting)
- [ ] Custom date range filtering
- [ ] Account aggregation (Plaid API integration)

### Phase 3: Collaboration
- [ ] Shared accounts (family/couples)
- [ ] Permission levels (view-only, editor)
- [ ] Activity logs and audit trails
- [ ] Comments on entries

### Phase 4: Automation
- [ ] Bank account sync (Plaid, Yodlee)
- [ ] Automatic transaction categorization
- [ ] Scheduled reports via email
- [ ] Webhooks for external integrations

### Phase 5: Mobile Enhancements
- [ ] Biometric authentication (Face ID, Touch ID)
- [ ] Offline mode with sync
- [ ] Push notifications for goals
- [ ] Receipt scanning with OCR
- [ ] Widget for home screen

---

## 📊 Monitoring & Maintenance

### Application Monitoring
- Use [Sentry](https://sentry.io) for error tracking
- Use [LogRocket](https://logrocket.com) for session replay
- Monitor API response times with [New Relic](https://newrelic.com)

### Database Maintenance
```bash
# Vacuum database to optimize
sqlite3 backend/database.sqlite "VACUUM;"

# Check database integrity
sqlite3 backend/database.sqlite "PRAGMA integrity_check;"
```

### Update Dependencies
```bash
# Check for outdated packages
npm outdated

# Update safely
npm update

# Major version updates (review breaking changes first)
npm install package@latest
```

---

## 🆘 Troubleshooting

### Backend won't start
- Check if port 3001 is available: `lsof -i :3001`
- Verify database file permissions
- Check logs for errors

### Frontend can't connect to backend
- Verify `VITE_API_URL` in `.env`
- Check CORS settings in backend
- Ensure backend is running and accessible

### Database locked error
- Close all connections to database
- Restart backend server
- Check for long-running transactions

---

## 📞 Support & Resources

- **GitHub Repository**: https://github.com/puentesci/Finances-hub
- **Branch**: Manus-Full-stack
- **React Documentation**: https://react.dev
- **Express Documentation**: https://expressjs.com
- **Vite Documentation**: https://vitejs.dev

---

## 📝 Summary

You now have a fully functional financial tracking application with:
- ✅ User authentication
- ✅ Account management
- ✅ Entry tracking with visualizations
- ✅ Database persistence
- ✅ RESTful API
- ✅ Modern responsive UI

The code is pushed to GitHub on the `Manus-Full-stack` branch and ready for production deployment!

