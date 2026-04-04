# Production-Ready E-commerce Web Application

A full-featured e-commerce platform built with React (Vite), Node.js, Express, and PostgreSQL. Features include product management, shopping cart, multiple payment methods (COD, UPI QR), admin panel, and WhatsApp integration.

## 🚀 Features

### Customer Features
- **Home Page**: Animated hero section with featured products and category filters
- **Product Listing**: Search, filter by category/price, and sort products
- **Product Details**: Image gallery, stock status, quantity selector
- **Shopping Cart**: Animated slide-in drawer with quantity management
- **Checkout**: Customer details form with validation
- **Payment Methods**:
  - Cash on Delivery (COD)
  - UPI/QR Payment with dynamic QR code generation
  - Razorpay (placeholder for future integration)
- **Order Confirmation**: WhatsApp order sharing with prefilled message
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Admin Features
- **Secure Login**: JWT-based authentication
- **Dashboard**: Statistics overview with quick actions
- **Product Management**: 
  - Add/Edit/Delete products
  - Image upload (multiple images per product)
  - Stock quantity management
  - Active/Inactive toggle
- **Order Management**:
  - View all orders with filtering
  - Update order status (Pending → Confirmed → Shipped → Delivered)
  - Update payment status (Unpaid → Pending Verification → Paid)
  - View detailed order information

### Technical Features
- **Animations**: Framer Motion for smooth page transitions and interactions
- **API Documentation**: Swagger UI at `/api-docs`
- **Image Upload**: Multer for handling product images
- **Security**: JWT tokens, password hashing with bcrypt
- **Database**: PostgreSQL with Sequelize ORM
- **Loading States**: Skeleton screens for better UX
- **Toast Notifications**: Real-time feedback for user actions

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (local or cloud-hosted)
- npm or yarn

## 🛠️ Installation & Setup

### 1. Clone or Navigate to Project Directory

```bash
cd /home/jeba-prakash/Jeba/ecommerce
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env file with your configuration
# Update MongoDB URI, JWT secrets, UPI details, WhatsApp number, etc.
nano .env
```

**Important Environment Variables:**
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_ACCESS_SECRET`: Secret key for access tokens (change in production!)
- `JWT_REFRESH_SECRET`: Secret key for refresh tokens (change in production!)
- `UPI_ID`: Your UPI ID for QR payments
- `WHATSAPP_NUMBER`: Your WhatsApp number (format: +91XXXXXXXXXX)
- `BUSINESS_NAME`: Your business name
- `DELIVERY_CHARGE`: Delivery charge amount

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env file
nano .env
```

**Frontend Environment Variables:**
- `VITE_API_URL`: Backend API URL (default: http://localhost:5000/api)
- `VITE_WHATSAPP_NUMBER`: Same as backend WhatsApp number
- `VITE_UPI_ID`: Same as backend UPI ID
- `VITE_BUSINESS_NAME`: Same as backend business name

### 4. Seed Database (Optional but Recommended)

```bash
# From backend directory
cd backend
npm run seed
```

This will create:
- Admin user (username: `admin`, password: `admin123`)
- 10 sample products across different categories

**⚠️ IMPORTANT**: Change the admin password after first login!

## 🚀 Running the Application

### Start Backend Server

```bash
# From backend directory
cd backend
npm run dev
```

Backend will run on: http://localhost:5000
API Documentation: http://localhost:5000/api-docs

### Start Frontend Development Server

```bash
# From frontend directory (in a new terminal)
cd frontend
npm run dev
```

Frontend will run on: http://localhost:3000

## 📱 Usage

### Customer Flow

1. Visit http://localhost:3000
2. Browse products on home page or navigate to Products page
3. Use search, filters, and sorting to find products
4. Click on a product to view details
5. Add products to cart
6. Click cart icon to view cart drawer
7. Proceed to checkout
8. Fill in customer details
9. Select payment method (COD or QR)
10. Place order
11. View order confirmation with QR code (if QR payment selected)
12. Share order via WhatsApp

### Admin Flow

1. Navigate to http://localhost:3000/admin/login
2. Login with credentials (default: admin/admin123)
3. View dashboard statistics
4. Manage Products:
   - Click "Products" in sidebar
   - Add new products with images
   - Edit existing products
   - Toggle active/inactive status
   - Delete products
5. Manage Orders:
   - Click "Orders" in sidebar
   - Filter by order status or payment status
   - Update order status
   - Update payment status for QR payments
   - View detailed order information

## 📁 Project Structure

```
ecommerce/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & Swagger config
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Auth & upload middleware
│   │   └── server.js        # Express app entry point
│   ├── scripts/
│   │   └── seedData.js      # Database seeding script
│   ├── uploads/             # Uploaded product images
│   ├── .env.example         # Environment variables template
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable components
    │   ├── pages/           # Page components
    │   │   ├── admin/       # Admin pages
    │   │   └── ...          # Customer pages
    │   ├── contexts/        # React contexts (Cart, Auth)
    │   ├── services/        # API service
    │   ├── utils/           # Utility functions
    │   ├── App.jsx          # Main app component
    │   ├── main.jsx         # Entry point
    │   └── index.css        # Global styles
    ├── public/
    ├── .env.example         # Environment variables template
    └── package.json
```

## 🔌 API Endpoints

### Public Endpoints

- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/categories` - Get all categories
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:orderId/payment-status` - Update payment status

### Admin Endpoints (Protected)

- `POST /api/admin/login` - Admin login
- `GET /api/admin/products` - Get all products (including inactive)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - Get all orders (with filters)
- `PATCH /api/admin/orders/:id` - Update order

## 🎨 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **qrcode.react** - QR code generation

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload
- **Swagger** - API documentation
- **CORS** - Cross-origin requests

## 🔒 Security Notes

1. **Change Default Credentials**: Update admin password after first login
2. **Update JWT Secrets**: Use strong, random secrets in production
3. **Environment Variables**: Never commit `.env` files to version control
4. **HTTPS**: Use HTTPS in production
5. **Input Validation**: All forms include validation
6. **File Upload**: Images are validated for type and size

## 🚢 Deployment

### Backend Deployment

1. Set up MongoDB Atlas or your preferred MongoDB hosting
2. Update environment variables for production
3. Deploy to services like:
   - Heroku
   - Railway
   - DigitalOcean
   - AWS EC2

### Frontend Deployment

1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to:
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3 + CloudFront

### Environment Configuration

Make sure to update these in production:
- Backend API URL in frontend `.env`
- CORS settings in backend
- MongoDB connection string
- JWT secrets
- UPI ID and WhatsApp number

## 📝 Configuration

### WhatsApp Integration

Update `VITE_WHATSAPP_NUMBER` in frontend `.env`:
```
VITE_WHATSAPP_NUMBER=+919876543210
```

### UPI Payment

Update UPI details in both frontend and backend `.env`:
```
VITE_UPI_ID=yourname@upi
VITE_BUSINESS_NAME=Your Store Name
```

### Delivery Charge

Update in backend `.env`:
```
DELIVERY_CHARGE=50
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or connection string is correct
- Check firewall settings for MongoDB Atlas

### Port Already in Use
- Backend: Change `PORT` in backend `.env`
- Frontend: Change port in `vite.config.js`

### Image Upload Issues
- Check `uploads/products` directory exists and has write permissions
- Verify `MAX_FILE_SIZE` in backend `.env`

### CORS Errors
- Ensure backend CORS is configured correctly
- Check `VITE_API_URL` in frontend `.env`

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Support

For issues or questions:
1. Check the API documentation at `/api-docs`
2. Review the console logs for errors
3. Ensure all environment variables are set correctly

## 🎯 Future Enhancements

- [ ] Razorpay payment integration
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Product variants (size, color)
- [ ] Discount codes and coupons

---

**Built with ❤️ using React, Node.js, and MongoDB**
# demo
# trendywear
