import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/api';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/orders/${id}`);
        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details. Please check your order history.');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <div className="text-center mt-4">
          <Link to="/" className="btn btn-primary">Return to Home</Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm mb-4">
            <div className="card-body text-center py-5">
              <div className="mb-4">
                <span className="display-1 text-success">
                  <i className="bi bi-check-circle"></i>
                </span>
              </div>
              <h2 className="mb-4">Order Confirmed!</h2>
              <p className="lead mb-1">Thank you for your purchase.</p>
              <p className="mb-4">Your order has been received and is being processed.</p>
              <div className="alert alert-light border mb-4">
                <p className="mb-1"><strong>Order Number:</strong> {order._id}</p>
                <p className="mb-0"><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/profile" className="btn btn-outline-primary">
                  View Order History
                </Link>
                <Link to="/" className="btn btn-primary">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">Order Details</h5>
            </div>
            <div className="card-body">
              <div className="row mb-4">
                <div className="col-md-6 mb-3 mb-md-0">
                  <h6 className="mb-3">Shipping Address</h6>
                  <p className="mb-1">{order.shipping.fullName}</p>
                  <p className="mb-1">{order.shipping.address}</p>
                  <p className="mb-1">
                    {order.shipping.city}, {order.shipping.state} {order.shipping.postalCode}
                  </p>
                  <p className="mb-1">{order.shipping.country}</p>
                  <p className="mb-0">{order.shipping.phoneNumber}</p>
                </div>
                
                <div className="col-md-6">
                  <h6 className="mb-3">Payment Method</h6>
                  {order.payment.method === 'credit_card' ? (
                    <div>
                      <p className="mb-1">Credit / Debit Card</p>
                      {order.payment.cardLastFour && (
                        <p className="mb-1">Card ending in {order.payment.cardLastFour}</p>
                      )}
                      {order.payment.cardholderName && (
                        <p className="mb-0">Cardholder: {order.payment.cardholderName}</p>
                      )}
                    </div>
                  ) : (
                    <p className="mb-0">Cash on Delivery</p>
                  )}
                </div>
              </div>

              <h6 className="mb-3">Items</h6>
              <div className="table-responsive mb-3">
                <table className="table table-borderless">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <div className="d-flex align-items-center">
                            {item.product.images && (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                style={{ width: 50, height: 50, objectFit: 'cover' }}
                                className="me-3 rounded"
                              />
                            )}
                            <span>{item.product.name}</span>
                          </div>
                        </td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>{item.quantity}</td>
                        <td className="text-end">${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="table-light">
                    <tr>
                      <td colSpan="3" className="text-end">Subtotal:</td>
                      <td className="text-end">${order.itemsTotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="text-end">Shipping:</td>
                      <td className="text-end">${order.shippingCost.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                      <td className="text-end"><strong>${order.totalAmount.toFixed(2)}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 