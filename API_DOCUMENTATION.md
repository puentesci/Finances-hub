# Financial Hub - API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register New User
**POST** `/auth/register`

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "securepass123"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "johndoe"
  }
}
```

**Validation:**
- Username: minimum 3 characters, unique
- Password: minimum 6 characters

**Errors:**
- `400`: Missing username or password
- `400`: Username too short
- `400`: Password too short
- `409`: Username already exists

---

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "securepass123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "johndoe"
  }
}
```

**Errors:**
- `400`: Missing username or password
- `401`: Invalid username or password

---

## Account Endpoints

### Get All Accounts
**GET** `/accounts`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "name": "Main Savings",
    "created_at": "2025-10-24T20:00:00.000Z",
    "latestEntry": {
      "id": 5,
      "account_id": 1,
      "entry_date": "2025-10-24",
      "cash": 5000,
      "investments": 25000,
      "debt": 10000,
      "created_at": "2025-10-24T20:30:00.000Z"
    },
    "netWorth": 20000
  }
]
```

**Errors:**
- `401`: Missing or invalid token

---

### Get Single Account with Entries
**GET** `/accounts/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "user_id": 1,
  "name": "Main Savings",
  "created_at": "2025-10-24T20:00:00.000Z",
  "entries": [
    {
      "id": 1,
      "account_id": 1,
      "entry_date": "2025-09-24",
      "cash": 4500,
      "investments": 22000,
      "debt": 11000,
      "created_at": "2025-09-24T20:00:00.000Z"
    },
    {
      "id": 5,
      "account_id": 1,
      "entry_date": "2025-10-24",
      "cash": 5000,
      "investments": 25000,
      "debt": 10000,
      "created_at": "2025-10-24T20:30:00.000Z"
    }
  ]
}
```

**Errors:**
- `401`: Missing or invalid token
- `404`: Account not found or doesn't belong to user

---

### Create Account
**POST** `/accounts`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Investment Portfolio"
}
```

**Response (201):**
```json
{
  "id": 2,
  "user_id": 1,
  "name": "Investment Portfolio",
  "created_at": "2025-10-24T21:00:00.000Z"
}
```

**Errors:**
- `400`: Account name is required
- `401`: Missing or invalid token

---

### Update Account
**PUT** `/accounts/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Retirement Savings"
}
```

**Response (200):**
```json
{
  "id": 2,
  "user_id": 1,
  "name": "Retirement Savings",
  "created_at": "2025-10-24T21:00:00.000Z"
}
```

**Errors:**
- `400`: Account name is required
- `401`: Missing or invalid token
- `404`: Account not found or doesn't belong to user

---

### Delete Account
**DELETE** `/accounts/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Account deleted successfully"
}
```

**Note:** Deleting an account also deletes all associated entries (CASCADE).

**Errors:**
- `401`: Missing or invalid token
- `404`: Account not found or doesn't belong to user

---

## Entry Endpoints

### Create Entry
**POST** `/accounts/:id/entries`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "entry_date": "2025-10-24",
  "cash": 5000,
  "investments": 25000,
  "debt": 10000
}
```

**Response (201):**
```json
{
  "id": 6,
  "account_id": 1,
  "entry_date": "2025-10-24",
  "cash": 5000,
  "investments": 25000,
  "debt": 10000,
  "created_at": "2025-10-24T21:30:00.000Z"
}
```

**Validation:**
- `entry_date`: Required, ISO date format (YYYY-MM-DD)
- `cash`: Optional, defaults to 0
- `investments`: Optional, defaults to 0
- `debt`: Optional, defaults to 0

**Errors:**
- `400`: Entry date is required
- `401`: Missing or invalid token
- `404`: Account not found or doesn't belong to user

---

### Update Entry
**PUT** `/accounts/:accountId/entries/:entryId`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "entry_date": "2025-10-24",
  "cash": 5500,
  "investments": 26000,
  "debt": 9500
}
```

**Response (200):**
```json
{
  "id": 6,
  "account_id": 1,
  "entry_date": "2025-10-24",
  "cash": 5500,
  "investments": 26000,
  "debt": 9500,
  "created_at": "2025-10-24T21:30:00.000Z"
}
```

**Errors:**
- `400`: Entry date is required
- `401`: Missing or invalid token
- `404`: Account or entry not found

---

### Delete Entry
**DELETE** `/accounts/:accountId/entries/:entryId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Entry deleted successfully"
}
```

**Errors:**
- `401`: Missing or invalid token
- `404`: Account or entry not found

---

## Health Check

### Check API Status
**GET** `/health`

**Response (200):**
```json
{
  "status": "ok",
  "message": "Financial Hub API is running"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (missing or invalid token)
- `403`: Forbidden (token expired)
- `404`: Not Found
- `409`: Conflict (duplicate username)
- `500`: Internal Server Error

---

## Example Usage with cURL

### Register
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

### Create Account (with token)
```bash
curl -X POST http://localhost:3001/api/accounts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name":"My Savings"}'
```

### Get All Accounts
```bash
curl -X GET http://localhost:3001/api/accounts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Add Entry
```bash
curl -X POST http://localhost:3001/api/accounts/1/entries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "entry_date":"2025-10-24",
    "cash":5000,
    "investments":25000,
    "debt":10000
  }'
```

---

## Example Usage with JavaScript

### Using Fetch API
```javascript
// Login
const login = async (username, password) => {
  const response = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
};

// Get accounts
const getAccounts = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3001/api/accounts', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
};

// Create entry
const createEntry = async (accountId, entryData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(
    `http://localhost:3001/api/accounts/${accountId}/entries`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(entryData)
    }
  );
  return await response.json();
};
```

---

## Rate Limiting

Currently, there are no rate limits. For production, consider adding:

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## CORS Configuration

The API allows all origins in development. For production, update `backend/src/server.js`:

```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
}));
```

---

## JWT Token Details

- **Algorithm**: HS256
- **Expiration**: 7 days
- **Payload**:
  ```json
  {
    "id": 1,
    "username": "johndoe",
    "iat": 1729800000,
    "exp": 1730404800
  }
  ```

---

## Database Schema Reference

### users
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| username | TEXT | UNIQUE NOT NULL |
| password | TEXT | NOT NULL (bcrypt hashed) |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

### accounts
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| user_id | INTEGER | FOREIGN KEY → users(id) |
| name | TEXT | NOT NULL |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

### account_entries
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| account_id | INTEGER | FOREIGN KEY → accounts(id) |
| entry_date | DATE | NOT NULL |
| cash | REAL | DEFAULT 0 |
| investments | REAL | DEFAULT 0 |
| debt | REAL | DEFAULT 0 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

---

## Testing the API

Use tools like:
- **Postman**: https://www.postman.com/
- **Insomnia**: https://insomnia.rest/
- **Thunder Client** (VS Code extension)
- **cURL** (command line)

Import this as a Postman collection to get started quickly!

