# Craftivia - Artisan Marketplace

Craftivia is a full-stack e-commerce platform connecting artisans with buyers, built using the MERN stack (MongoDB, Express, React, Node.js).

## Project Overview

Craftivia serves three main user roles:

1. **Buyers**: Browse and purchase handcrafted products
2. **Artisans**: Create, manage and sell their handcrafted products 
3. **Admin**: Manage users, products, and monitor platform performance

## Features

### For Buyers
- Browse products by category
- Search for products
- View product details
- Add products to cart
- Checkout and place orders
- View order history
- User profile management

### For Artisans
- Create and manage products
- Upload product images
- Track inventory
- View sales and orders

### For Admins
- User management
  - View all users
  - Delete user accounts
- Content management
  - Update product details
  - Discontinue/restore products
  - Delete products
  - Manage inventory
- Dashboard & Analytics
  - Track site visits
  - Monitor sales performance
  - View revenue metrics
  - Visualize data with charts (daily, weekly, monthly, yearly)

## Tech Stack

- **Frontend**: React, Bootstrap, Chart.js
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Installation

1. Clone the repository
2. Run the setup script to install dependencies and create an admin user:
   ```
   chmod +x setup.sh
   ./setup.sh
   ```
   
   Or install dependencies manually:
   ```
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Create admin user
   cd backend/scripts
   chmod +x setupAdmin.sh
   ./setupAdmin.sh
   ```

3. Configure environment variables:
   - Create `.env` file in the backend directory
   - Add the following variables:
     ```
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     PORT=5000
     ```

## Running the Application

1. Start the backend server:
   ```
   cd backend
   npm start
   ```

2. Start the frontend development server:
   ```
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## User Types

- **Buyer**: Register as a regular user to browse and purchase products
- **Artisan**: Register as an artisan to sell products
- **Admin**: Use admin login at `/admin/login` with admin credentials

## Admin Access

To access the admin dashboard:
1. Navigate to `/admin/login`
2. Login with the default admin credentials:
   - Email: admin@craftivia.com
   - Password: admin
3. You will be redirected to the admin dashboard with full access to all admin features 