import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import API from '../api/api';

export default function Checkout() {
  const { cartItems } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  
  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phoneNumber: ''
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: ''
  });
  
  useEffect(() => {
    // Redirect to cart if cart is empty
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo(0, 0);
  };
  
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setStep(3);
    window.scrollTo(0, 0);
  };
  
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };
  
  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Prepare payment data based on selected method
      const paymentData = { method: paymentMethod };
      
      if (paymentMethod === 'credit_card') {
        // Only store the last 4 digits for reference
        paymentData.cardLastFour = paymentInfo.cardNumber.slice(-4);
        paymentData.cardholderName = paymentInfo.cardholderName;
      }
      
      // Create the order
      const response = await API.post('/orders', {
        shipping: shippingInfo,
        payment: paymentData
      });
      
      // Redirect to order confirmation
      navigate(`/order-confirmation/${response.data._id}`);
    } catch (err) {
      console.error('Order placement error:', err);
      setError(err.response?.data?.msg || 'Failed to place order. Please try again.');
      setLoading(false);
    }
  };
  
  const total = cartItems.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity, 0
  );
  
  if (cartItems.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col">
          <h2 className="mb-4">Checkout</h2>
          
          {/* Checkout Progress */}
          <div className="d-flex justify-content-center mb-4">
            <div className="checkout-steps d-flex">
              <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                <div className="step-number">1</div>
                <div className="step-label">Shipping</div>
              </div>
              <div className="step-line"></div>
              <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-label">Payment</div>
              </div>
              <div className="step-line"></div>
              <div className={`step ${step >= 3 ? 'active' : ''}`}>
                <div className="step-number">3</div>
                <div className="step-label">Review</div>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
        </div>
      </div>
      
      <div className="row">
        <div className="col-lg-8">
          {/* Step 1: Shipping Information */}
          {step === 1 && (
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">Shipping Information</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleShippingSubmit}>
                  <div className="mb-3">
                    <label htmlFor="fullName" className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="fullName"
                      name="fullName"
                      value={shippingInfo.fullName}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="city" className="form-label">City</label>
                      <input
                        type="text"
                        className="form-control"
                        id="city"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="state" className="form-label">State/Province</label>
                      <input
                        type="text"
                        className="form-control"
                        id="state"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="postalCode" className="form-label">Postal Code</label>
                      <input
                        type="text"
                        className="form-control"
                        id="postalCode"
                        name="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="country" className="form-label">Country</label>
                      <input
                        type="text"
                        className="form-control"
                        id="country"
                        name="country"
                        value={shippingInfo.country}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={shippingInfo.phoneNumber}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  
                  <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {/* Step 2: Payment Method */}
          {step === 2 && (
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">Payment Method</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handlePaymentSubmit}>
                  <div className="mb-4">
                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="creditCard"
                        value="credit_card"
                        checked={paymentMethod === 'credit_card'}
                        onChange={handlePaymentMethodChange}
                        required
                      />
                      <label className="form-check-label" htmlFor="creditCard">
                        Credit / Debit Card
                      </label>
                    </div>
                    
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="cashOnDelivery"
                        value="cash_on_delivery"
                        checked={paymentMethod === 'cash_on_delivery'}
                        onChange={handlePaymentMethodChange}
                        required
                      />
                      <label className="form-check-label" htmlFor="cashOnDelivery">
                        Cash on Delivery
                      </label>
                    </div>
                  </div>
                  
                  {paymentMethod === 'credit_card' && (
                    <div className="card border p-3 mb-4">
                      <div className="mb-3">
                        <label htmlFor="cardNumber" className="form-label">Card Number</label>
                        <input
                          type="text"
                          className="form-control"
                          id="cardNumber"
                          name="cardNumber"
                          value={paymentInfo.cardNumber}
                          onChange={handlePaymentChange}
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="cardholderName" className="form-label">Cardholder Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="cardholderName"
                          name="cardholderName"
                          value={paymentInfo.cardholderName}
                          onChange={handlePaymentChange}
                          required
                        />
                      </div>
                      
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
                          <input
                            type="text"
                            className="form-control"
                            id="expiryDate"
                            name="expiryDate"
                            value={paymentInfo.expiryDate}
                            onChange={handlePaymentChange}
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="cvv" className="form-label">CVV</label>
                          <input
                            type="text"
                            className="form-control"
                            id="cvv"
                            name="cvv"
                            value={paymentInfo.cvv}
                            onChange={handlePaymentChange}
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="form-text text-muted small">
                        <i className="bi bi-shield-lock me-1"></i>
                        Your payment information is secure. This is a demo app, so no real payment will be processed.
                      </div>
                    </div>
                  )}
                  
                  <div className="d-flex justify-content-between">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => setStep(1)}
                    >
                      Back to Shipping
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Continue to Review
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {/* Step 3: Order Review */}
          {step === 3 && (
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">Review Your Order</h5>
              </div>
              <div className="card-body">
                <h6 className="mb-3">Items</h6>
                <div className="table-responsive mb-4">
                  <table className="table table-borderless">
                    <tbody>
                      {cartItems.map(item => (
                        <tr key={item._id}>
                          <td width="80">
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              style={{ width: 60, height: 60, objectFit: 'cover' }}
                              className="rounded"
                            />
                          </td>
                          <td className="align-middle">
                            <div className="fw-bold">{item.product.name}</div>
                            <div className="text-muted small">Quantity: {item.quantity}</div>
                          </td>
                          <td className="align-middle text-end">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6 className="mb-3">Shipping Address</h6>
                    <p className="mb-1">{shippingInfo.fullName}</p>
                    <p className="mb-1">{shippingInfo.address}</p>
                    <p className="mb-1">
                      {shippingInfo.city}, {shippingInfo.state} {shippingInfo.postalCode}
                    </p>
                    <p className="mb-1">{shippingInfo.country}</p>
                    <p className="mb-0">{shippingInfo.phoneNumber}</p>
                  </div>
                  
                  <div className="col-md-6">
                    <h6 className="mb-3">Payment Method</h6>
                    {paymentMethod === 'credit_card' ? (
                      <div>
                        <p className="mb-1">Credit / Debit Card</p>
                        <p className="mb-1">Card ending in {paymentInfo.cardNumber.slice(-4)}</p>
                        <p className="mb-0">Cardholder: {paymentInfo.cardholderName}</p>
                      </div>
                    ) : (
                      <p className="mb-0">Cash on Delivery</p>
                    )}
                  </div>
                </div>
                
                <div className="d-flex justify-content-between">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => setStep(2)}
                  >
                    Back to Payment
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-success"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              {cartItems.map(item => (
                <div key={item._id} className="d-flex justify-content-between mb-2">
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              
              <hr />
              
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between mb-0">
                <strong>Total:</strong>
                <strong className="text-success">${total.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 