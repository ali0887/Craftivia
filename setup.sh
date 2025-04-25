#!/bin/bash
echo "Setting up Craftivia..."

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
npm install chart.js react-chartjs-2 --save

# Create admin user
echo "Creating admin user..."
cd scripts
chmod +x setupAdmin.sh
./setupAdmin.sh
cd ../..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
npm install chart.js react-chartjs-2 --save

echo "Setup complete!"
echo "To start the application:"
echo "1. Start backend: cd backend && npm start"
echo "2. Start frontend: cd frontend && npm start"
echo ""
echo "Admin login credentials:"
echo "Username: admin@craftivia.com"
echo "Password: admin" 