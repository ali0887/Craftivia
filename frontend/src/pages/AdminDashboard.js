import React, { useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

// Only import what we need, removing Pie since it's not used
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement
);

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(user?.role === 'artisan' ? 'products' : 'analytics');
  
  // Check if user is admin or artisan, if not redirect
  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'artisan')) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 d-md-block bg-dark sidebar" style={{ minHeight: 'calc(100vh - 56px)' }}>
          <div className="position-sticky pt-3">
            <ul className="nav flex-column">
              {user?.role === 'admin' && (
                <>
                  <li className="nav-item">
                    <button 
                      className={`nav-link btn btn-link text-white ${activeTab === 'analytics' ? 'active' : ''}`}
                      onClick={() => setActiveTab('analytics')}
                    >
                      <i className="bi bi-graph-up me-2"></i>
                      Dashboard & Analytics
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link btn btn-link text-white ${activeTab === 'users' ? 'active' : ''}`}
                      onClick={() => setActiveTab('users')}
                    >
                      <i className="bi bi-people me-2"></i>
                      User Management
                    </button>
                  </li>
                </>
              )}
              <li className="nav-item">
                <button 
                  className={`nav-link btn btn-link text-white ${activeTab === 'products' ? 'active' : ''}`}
                  onClick={() => setActiveTab('products')}
                >
                  <i className="bi bi-box me-2"></i>
                  {user?.role === 'admin' ? 'Content Management' : 'My Products'}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Main content */}
        <div className="col-md-9 col-lg-10 ms-sm-auto">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h2>{user?.role === 'admin' ? 'Admin Dashboard' : 'Artisan Dashboard'}</h2>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'analytics' && user?.role === 'admin' && <AnalyticsDashboard />}
            {activeTab === 'products' && <ContentManagement />}
            {activeTab === 'users' && user?.role === 'admin' && <UserManagement />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Analytics Dashboard Component
function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState('week');
  const [loading, setLoading] = useState(true);

  // Use useCallback to properly handle the function in the dependency array
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get(`/admin/analytics/${period}`);
      setAnalytics(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]); // Now fetchAnalytics is properly included

  // Handle period change
  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  // Prepare chart data
  const getVisitChartData = () => {
    if (!analytics?.series?.visits || analytics.series.visits.length === 0) {
      return {
        labels: [],
        datasets: [{
          label: 'Visits',
          data: [],
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        }]
      };
    }

    return {
      labels: analytics.series.visits.map(item => item.date),
      datasets: [{
        label: 'Visits',
        data: analytics.series.visits.map(item => item.visits),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4
      }]
    };
  };

  const getOrderChartData = () => {
    if (!analytics?.series?.orders || analytics.series.orders.length === 0) {
      return {
        labels: [],
        datasets: [{
          label: 'Orders',
          data: [],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        }]
      };
    }

    return {
      labels: analytics.series.orders.map(item => item.date),
      datasets: [{
        label: 'Orders',
        data: analytics.series.orders.map(item => item.orders),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      }]
    };
  };

  const getRevenueChartData = () => {
    if (!analytics?.series?.orders || analytics.series.orders.length === 0) {
      return {
        labels: [],
        datasets: [{
          label: 'Revenue',
          data: [],
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
        }]
      };
    }

    return {
      labels: analytics.series.orders.map(item => item.date),
      datasets: [{
        label: 'Revenue ($)',
        data: analytics.series.orders.map(item => item.revenue),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4
      }]
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Analytics Data',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div>
      <div className="mb-4">
        <div className="btn-group">
          <button 
            className={`btn ${period === 'day' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => handlePeriodChange('day')}
          >
            Today
          </button>
          <button 
            className={`btn ${period === 'week' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => handlePeriodChange('week')}
          >
            Week
          </button>
          <button 
            className={`btn ${period === 'month' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => handlePeriodChange('month')}
          >
            Month
          </button>
          <button 
            className={`btn ${period === 'year' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => handlePeriodChange('year')}
          >
            Year
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card bg-primary text-white h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">Total Visits</h5>
                  <p className="card-text display-4 mt-auto mb-0">
                    {analytics?.summary?.totalVisits || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-success text-white h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">Orders Placed</h5>
                  <p className="card-text display-4 mt-auto mb-0">
                    {analytics?.summary?.totalOrders || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-danger text-white h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">Revenue Generated</h5>
                  <p className="card-text display-4 mt-auto mb-0">
                    ${analytics?.summary?.totalRevenue?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="row mb-4">
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header">
                  <h5 className="mb-0">Site Visits</h5>
                </div>
                <div className="card-body">
                  <Line data={getVisitChartData()} options={chartOptions} />
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header">
                  <h5 className="mb-0">Orders</h5>
                </div>
                <div className="card-body">
                  <Bar data={getOrderChartData()} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Revenue</h5>
                </div>
                <div className="card-body">
                  <Line data={getRevenueChartData()} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Content Management Component
function ContentManagement() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get('/products');
      setProducts(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  // Filter products based on search term and user role
  const filteredProducts = products.filter(product => {
    // If artisan, only show their own products
    if (user.role === 'artisan') {
      if (!product.artisan || product.artisan._id !== user.id) {
        return false;
      }
    }
    
    return product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           product.category.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Handle product deletion
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await API.delete(`/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  // Handle product discontinuation
  const handleToggleAvailability = async (product) => {
    try {
      const updatedStatus = product.countInStock > 0 ? 0 : 10;
      await API.put(`/products/${product._id}`, { countInStock: updatedStatus });
      
      // Update product in state
      setProducts(products.map(p => 
        p._id === product._id ? { ...p, countInStock: updatedStatus } : p
      ));
    } catch (error) {
      console.error('Error updating product availability:', error);
      alert('Failed to update product availability');
    }
  };

  // Handle stock update
  const handleUpdateStock = async (product) => {
    const newStock = prompt(`Enter new stock for ${product.name}:`, product.countInStock);
    if (newStock === null) return;
    
    const stockValue = parseInt(newStock);
    if (isNaN(stockValue) || stockValue < 0) {
      alert('Please enter a valid number (0 or higher)');
      return;
    }
    
    try {
      await API.put(`/products/${product._id}`, { countInStock: stockValue });
      
      // Update product in state
      setProducts(products.map(p => 
        p._id === product._id ? { ...p, countInStock: stockValue } : p
      ));
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock');
    }
  };

  // Handle product name update
  const handleUpdateName = async (product) => {
    const newName = prompt(`Enter new name for ${product.name}:`, product.name);
    if (!newName || newName === product.name) return;
    
    try {
      await API.put(`/products/${product._id}`, { name: newName });
      
      // Update product in state
      setProducts(products.map(p => 
        p._id === product._id ? { ...p, name: newName } : p
      ));
    } catch (error) {
      console.error('Error updating product name:', error);
      alert('Failed to update product name');
    }
  };

  // Handle category update
  const handleUpdateCategory = async (product) => {
    const newCategory = prompt(`Enter new category for ${product.name}:`, product.category);
    if (!newCategory || newCategory === product.category) return;
    
    try {
      await API.put(`/products/${product._id}`, { category: newCategory });
      
      // Update product in state
      setProducts(products.map(p => 
        p._id === product._id ? { ...p, category: newCategory } : p
      ));
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category');
    }
  };

  // Handle image update
  const handleUpdateImage = async (product) => {
    const newImageUrl = prompt(`Enter new image URL for ${product.name}:`, product.images?.[0] || '');
    if (!newImageUrl) return;
    
    try {
      await API.put(`/products/${product._id}`, { images: [newImageUrl] });
      
      // Update product in state
      setProducts(products.map(p => 
        p._id === product._id ? { ...p, images: [newImageUrl] } : p
      ));
    } catch (error) {
      console.error('Error updating image:', error);
      alert('Failed to update image');
    }
  };

  return (
    <div>
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <input
          type="text"
          className="form-control me-2"
          style={{ maxWidth: '300px' }}
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        {user.role === 'artisan' && (
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/add-product')}
          >
            <i className="bi bi-plus-circle me-1"></i>
            Add New Product
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    {user.role === 'artisan' 
                      ? "You haven't added any products yet." 
                      : "No products found."}
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product._id}>
                    <td>
                      <img 
                        src={product.images?.[0] || 'https://via.placeholder.com/50'} 
                        alt={product.name} 
                        className="img-thumbnail" 
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.countInStock}</td>
                    <td>
                      <span className={`badge ${product.countInStock > 0 ? 'bg-success' : 'bg-danger'}`}>
                        {product.countInStock > 0 ? 'Available' : 'Discontinued'}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group">
                        <button 
                          className="btn btn-sm btn-outline-primary" 
                          onClick={() => handleUpdateName(product)}
                          title="Update Name"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-success" 
                          onClick={() => handleUpdateStock(product)}
                          title="Update Stock"
                        >
                          <i className="bi bi-box"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-info" 
                          onClick={() => handleUpdateCategory(product)}
                          title="Update Category"
                        >
                          <i className="bi bi-tag"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-secondary" 
                          onClick={() => handleUpdateImage(product)}
                          title="Update Image"
                        >
                          <i className="bi bi-image"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-warning" 
                          onClick={() => handleToggleAvailability(product)}
                          title={product.countInStock > 0 ? "Discontinue" : "Restore"}
                        >
                          <i className={`bi ${product.countInStock > 0 ? 'bi-x-octagon' : 'bi-check-circle'}`}></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger" 
                          onClick={() => handleDeleteProduct(product._id)}
                          title="Delete"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// User Management Component
function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/users');
      setUsers(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle user deletion
  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await API.delete(`/admin/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">No users found</td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        {user.profileImage ? (
                          <img 
                            src={user.profileImage} 
                            alt={user.name} 
                            className="rounded-circle me-2" 
                            style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div 
                            className="rounded-circle me-2 d-flex align-items-center justify-content-center bg-secondary text-white" 
                            style={{ width: '30px', height: '30px' }}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        {user.name}
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge ${
                        user.role === 'admin' ? 'bg-danger' :
                        user.role === 'artisan' ? 'bg-success' : 'bg-primary'
                      }`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      {user.role !== 'admin' && (
                        <button 
                          className="btn btn-sm btn-outline-danger" 
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          <i className="bi bi-trash me-1"></i>
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
