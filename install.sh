#!/bin/bash
echo "Installing backend dependencies..."
cd backend
npm install

echo "Installing frontend dependencies..."
cd ../frontend
npm install

echo "Installation complete! Start the application with:"
echo "Backend: cd backend && npm start"
echo "Frontend: cd frontend && npm start" 