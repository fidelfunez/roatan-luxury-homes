# Database Setup Guide

## 🗄️ SQLite Integration Plan

### Current State
- Content is stored in localStorage (client-side)
- Admin data persists in browser storage
- No server-side database currently

### Future SQLite Implementation

#### Option 1: Netlify Functions + SQLite
```javascript
// Example: /api/properties.js
import sqlite3 from 'sqlite3'

export default async function handler(req, res) {
  const db = new sqlite3.Database('./data.db')
  
  if (req.method === 'GET') {
    db.all('SELECT * FROM properties', (err, rows) => {
      res.json(rows)
    })
  }
}
```

#### Option 2: External Database Service
- **Supabase**: PostgreSQL with real-time features
- **PlanetScale**: MySQL-compatible serverless
- **MongoDB Atlas**: NoSQL cloud database

### Database Schema (Proposed)

```sql
-- Properties table
CREATE TABLE properties (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  location TEXT,
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_sqft INTEGER,
  images TEXT, -- JSON array
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Blog posts table
CREATE TABLE blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  author TEXT,
  featured_image TEXT,
  published BOOLEAN DEFAULT false,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Content management table
CREATE TABLE page_content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_name TEXT UNIQUE NOT NULL,
  section_name TEXT NOT NULL,
  content TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Admin users table
CREATE TABLE admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Client submissions table
CREATE TABLE client_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  property_type TEXT,
  budget DECIMAL(10,2),
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Migration Strategy

#### Phase 1: Hybrid Approach
1. Keep localStorage for immediate functionality
2. Add database for critical data (properties, blog posts)
3. Implement sync between localStorage and database

#### Phase 2: Full Database
1. Migrate all content to database
2. Implement proper authentication
3. Add real-time updates

#### Phase 3: Advanced Features
1. User accounts and preferences
2. Advanced search and filtering
3. Analytics and reporting

### Implementation Steps

1. **Set up Netlify Functions**
   ```bash
   npm install @netlify/functions
   ```

2. **Create database utilities**
   ```javascript
   // lib/database.js
   import sqlite3 from 'sqlite3'
   
   export function getDatabase() {
     return new sqlite3.Database('./data.db')
   }
   ```

3. **Create API endpoints**
   ```javascript
   // functions/api/properties.js
   export default async function handler(req, res) {
     // Handle property CRUD operations
   }
   ```

4. **Update frontend to use API**
   ```javascript
   // lib/api.js
   export async function fetchProperties() {
     const response = await fetch('/api/properties')
     return response.json()
   }
   ```

### Environment Variables for Database

```env
# Database Configuration
DATABASE_URL=file:./data.db
DATABASE_PATH=./data.db

# API Configuration
API_BASE_URL=https://your-site.netlify.app/.netlify/functions
```

### Security Considerations

1. **Input Validation**: Sanitize all user inputs
2. **SQL Injection**: Use parameterized queries
3. **Authentication**: Implement proper admin auth
4. **Rate Limiting**: Prevent abuse of API endpoints
5. **Data Backup**: Regular database backups

### Performance Optimization

1. **Indexing**: Add indexes on frequently queried columns
2. **Caching**: Implement Redis or similar for caching
3. **Pagination**: Limit results for large datasets
4. **Image Optimization**: Use CDN for image storage

### Monitoring and Maintenance

1. **Database Health**: Regular integrity checks
2. **Performance Monitoring**: Track query performance
3. **Backup Strategy**: Automated daily backups
4. **Logging**: Comprehensive error logging

---

**Note**: This is a future implementation plan. The current version uses localStorage for simplicity and immediate deployment. 