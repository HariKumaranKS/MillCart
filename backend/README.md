# MillCart Backend

## Setup

1. Install dependencies (from project root):
   ```
   npm install
   ```

2. Configure MongoDB:
   - **Local**: Start MongoDB locally (default: mongodb://localhost:27017/millcart)
   - **Atlas**: Set `MONGO_URI` environment variable with your connection string

3. Start the backend server:
   ```
   npm run server
   ```
   Or directly:
   ```
   node backend/server.js
   ```

## Environment Variables

- `MONGO_URI` - MongoDB connection string (default: mongodb://localhost:27017/millcart)
- `PORT` - Server port (default: 5000)

## API Endpoints

### Authentication
- `POST /api/login` - Login user or admin
- `POST /api/signup` - Register new user

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Add new product (requires: name, price, img)
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - Get all orders (optional query: ?userId=xxx)
- `POST /api/orders` - Create new order (requires: userId, items)

### Users
- `GET /api/users` - Get all users

### Health
- `GET /api/health` - Server health check

## Security Features

- Password hashing with bcryptjs
- Input validation
- Error handling middleware
- CORS enabled for frontend access

## Notes

- Admin credentials are hardcoded (admin@millcart.com / admin123)
- In production, store admin users in database with hashed passwords
- Add JWT authentication for production use
