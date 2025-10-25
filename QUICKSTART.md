# Financial Hub - Quick Start Guide

## 🎯 What You Have

A full-stack financial tracking web application where you can:
- Create an account with username/password
- Add multiple financial accounts (Savings, Checking, Investment, etc.)
- Track cash, investments, and debt over time
- Visualize your net worth with interactive charts
- See your financial progress with trend indicators

## 🚀 Running the App (5 Minutes)

### Step 1: Clone the Repository
```bash
git clone https://github.com/puentesci/Finances-hub.git
cd Finances-hub
git checkout Manus-Full-stack
```

### Step 2: Start Backend (Terminal 1)
```bash
cd backend
npm install
npm start
```
You should see: `Server running on http://localhost:3001`

### Step 3: Start Frontend (Terminal 2)
```bash
cd "Financial Hub Dashboard"
npm install
npm run dev
```
You should see: `Local: http://localhost:3000/`

### Step 4: Open in Browser
Go to http://localhost:3000

### Step 5: Create Your Account
1. Click "Register"
2. Choose a username (min 3 characters)
3. Choose a password (min 6 characters)
4. Click "Create Account"

### Step 6: Add Your First Account
1. Click "Add Account"
2. Name it (e.g., "Main Savings", "Investment Portfolio")
3. Click the checkmark

### Step 7: Add Your First Entry
1. Select your account from the sidebar
2. Click "Add New Entry"
3. Fill in the date and amounts:
   - **Cash**: Checking/savings balances
   - **Investments**: Stocks, bonds, retirement accounts
   - **Debt**: Credit cards, loans, mortgages
4. Click "Save Entry"

### Step 8: Watch Your Net Worth!
Your net worth is calculated as: `Cash + Investments - Debt`

The chart will show your progress over time as you add more entries.

## 📱 Testing the App

### Current Deployment URLs (Temporary)
- **Frontend**: https://3000-ia3vdv72j1jdrzr3skfxu-717b4444.manusvm.computer
- **Backend**: https://3001-ia3vdv72j1jdrzr3skfxu-717b4444.manusvm.computer

**Note**: These URLs only work while the development environment is active. For permanent deployment, see `DEPLOYMENT_GUIDE.md`.

## 🔑 Key Features

### Authentication
- No email required - just username and password
- Secure JWT token-based authentication
- Passwords hashed with bcrypt

### Account Management
- Create unlimited accounts
- Rename accounts anytime
- Delete accounts (removes all entries)
- Each account shows current net worth

### Entry Tracking
- Manual data entry (you control what goes in)
- Date-based entries for historical tracking
- Three categories: Cash, Investments, Debt
- Edit or delete entries anytime

### Visualizations
- Line chart showing net worth over time
- Separate lines for cash, investments, and debt
- Summary cards with trend indicators
- Table view of all entries

## 📂 Project Structure

```
Finances-hub/
├── backend/                    # Node.js API server
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js    # SQLite setup
│   │   ├── models/            # Data models
│   │   ├── routes/            # API endpoints
│   │   ├── middleware/        # Auth middleware
│   │   └── server.js          # Main server file
│   ├── database.sqlite        # Your data (auto-created)
│   └── package.json
│
├── Financial Hub Dashboard/   # React frontend
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── services/          # API client
│   │   └── App.tsx            # Main app
│   └── package.json
│
├── DEPLOYMENT_GUIDE.md        # Full deployment docs
└── QUICKSTART.md              # This file
```

## 💡 Usage Tips

### Best Practices
1. **Update regularly**: Add entries weekly or monthly for accurate trends
2. **Be consistent**: Use the same date format and timing
3. **Include everything**: Don't forget small accounts or debts
4. **Backup your data**: The database is in `backend/database.sqlite`

### Example Workflow
1. **Monthly Update**: Last day of each month, log all balances
2. **Track Progress**: Watch the chart to see if you're moving in the right direction
3. **Adjust Goals**: If debt is increasing, focus on paying it down
4. **Celebrate Wins**: When net worth goes up, you're winning!

## 🛠️ Customization

### Change Port Numbers
Edit `backend/.env`:
```
PORT=3001
```

Edit `Financial Hub Dashboard/.env`:
```
VITE_API_URL=http://localhost:3001/api
```

### Add More Categories
Currently tracks: Cash, Investments, Debt

To add more (e.g., Real Estate, Crypto):
1. Update database schema in `backend/src/config/database.js`
2. Update models in `backend/src/models/`
3. Update frontend forms in `src/components/EntryManager.tsx`

## 📊 Understanding Your Data

### Net Worth Formula
```
Net Worth = Cash + Investments - Debt
```

### Example
- Cash: $5,000 (checking + savings)
- Investments: $25,000 (401k + stocks)
- Debt: $10,000 (credit cards + car loan)
- **Net Worth: $20,000**

### Tracking Progress
Add entries over time to see:
- Is your net worth growing?
- Are you paying down debt?
- Are investments increasing?
- Do you have enough cash reserves?

## 🔒 Your Data Privacy

- All data stored locally in SQLite database
- Passwords are hashed (never stored in plain text)
- No third-party services or tracking
- You own your data completely

## 📱 Sharing with Friends

### Option 1: Share the Deployment
Deploy to a public server (see `DEPLOYMENT_GUIDE.md`) and share the URL.

### Option 2: iOS App
Follow the iOS app guide in `DEPLOYMENT_GUIDE.md` to:
1. Build a React Native app
2. Distribute via TestFlight
3. Share with up to 10,000 testers

### Option 3: Run Locally
Friends can clone the repo and run it on their own computers.

## 🆘 Common Issues

### "Port already in use"
Kill the process using the port:
```bash
# On Mac/Linux
lsof -ti:3001 | xargs kill
lsof -ti:3000 | xargs kill

# On Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### "Cannot connect to backend"
1. Make sure backend is running on port 3001
2. Check `.env` file has correct `VITE_API_URL`
3. Restart frontend after changing `.env`

### "Database locked"
Restart the backend server:
```bash
cd backend
npm start
```

## 🎓 Learning Resources

- **React**: https://react.dev/learn
- **Express**: https://expressjs.com/en/starter/hello-world.html
- **SQLite**: https://www.sqlite.org/docs.html
- **JWT Auth**: https://jwt.io/introduction

## 📞 Next Steps

1. ✅ Run the app locally
2. ✅ Add your real financial data
3. ✅ Track for a few months
4. 📖 Read `DEPLOYMENT_GUIDE.md` for production deployment
5. 🚀 Deploy to a public server
6. 📱 Build iOS app (optional)
7. 🎉 Share with friends!

---

**Congratulations!** You now have a working financial tracking application. Start adding your data and watch your net worth grow! 🎉

