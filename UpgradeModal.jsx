import React, { useState } from 'react';
import './UpgradeModal.css';

const plans = [
  { id: '1m', months: 1, price: 9.99, name: '1 Month' },
  { id: '6m', months: 6, price: 49.99, name: '6 Months', bestValue: true },
  { id: '12m', months: 12, price: 89.99, name: '1 Year' },
];

// --- NEW: Data for country codes with flags ---
const countryCodes = [
  { name: 'Ghana', code: '+233', flag: '🇬🇭' },
  { name: 'Nigeria', code: '+234', flag: '🇳🇬' },
  { name: 'Kenya', code: '+254', flag: '🇰🇪' },
  { name: 'South Africa', code: '+27', flag: '🇿🇦' },
  { name: 'United States', code: '+1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { name: 'India', code: '+91', flag: '🇮🇳' },
];

// --- Mock Payment Forms (for UI demonstration only) ---

// Mock Card Payment Form
const CardPaymentForm = ({ plan, onBack, onPay }) => (
  <div>
    <h4>Pay ${plan.price} with Card</h4>
    <p className="disclaimer">This is a UI demo. Do not enter real card details.</p>
    <div className="form-group">
      <label>Card Number</label>
      <input type="text" placeholder="**** **** **** 1234" />
    </div>
    <div className="form-row">
      <div className="form-group">
        <label>Expiry Date</label>
        <input type="text" placeholder="MM / YY" />
      </div>
      <div className="form-group">
        <label>CVC</label>
        <input type="text" placeholder="123" />
      </div>
    </div>
    <div className="modal-footer">
      <button className="back-button" onClick={onBack}>Back</button>
      <button className="pay-button" onClick={onPay}>Pay Now</button>
    </div>
  </div>
);

// Mock PayPal Form
const PayPalForm = ({ plan, onBack, onPay }) => (
  <div className="paypal-form">
    <h4>Pay ${plan.price} with PayPal</h4>
    <p>You will be redirected to PayPal to complete your payment securely.</p>
    <div className="modal-footer">
      <button className="back-button" onClick={onBack}>Back</button>
      <button className="pay-button paypal" onClick={onPay}>
        <i className="fab fa-paypal"></i> Proceed to PayPal
      </button>
    </div>
  </div>
);

// Mock Mobile Money Form
const MobileMoneyForm = ({ plan, onBack, onPay }) => {
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleFinalPay = () => {
    // In a real app, you would validate the full number here
    if (!phoneNumber) {
      alert("Please enter a phone number.");
      return;
    }
    // This is where you would trigger the payment process
    alert(`Simulating payment for ${selectedCountry.code}${phoneNumber}`);
    onPay();
  };

  return (
    <div>
      <h4>Pay ${plan.price} with Mobile Money</h4>
      <p className="disclaimer">This is a UI demo. Do not enter real information.</p>
      
      <div className="form-group">
        <label>Phone Number</label>
        <div className="phone-input-group">
          <select 
            className="country-code-select"
            value={selectedCountry.code}
            onChange={(e) => setSelectedCountry(countryCodes.find(c => c.code === e.target.value))}
          >
            {countryCodes.map(country => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.code}
              </option>
            ))}
          </select>
          <input 
            type="tel" 
            placeholder="e.g., 241234567" 
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Network</label>
        <select>
            <option>MTN</option>
            <option>Vodafone</option>
            <option>AirtelTigo</option>
        </select>
      </div>
      <div className="modal-footer">
        <button className="back-button" onClick={onBack}>Back</button>
        <button className="pay-button" onClick={handleFinalPay}>Confirm Payment</button>
      </div>
    </div>
  );
};


function UpgradeModal({ onClose }) {
  const [selectedPlanId, setSelectedPlanId] = useState(plans[1].id);
  const [step, setStep] = useState('selectPlan'); // 'selectPlan', 'card', 'paypal', 'mobileMoney'

  const selectedPlan = plans.find(p => p.id === selectedPlanId);

  const handleFinalPay = () => {
    alert(`This is a UI demo for the ${selectedPlan.name} plan. No payment was processed.`);
    onClose();
  };

  const renderStep = () => {
    switch (step) {
      case 'card':
        return <CardPaymentForm plan={selectedPlan} onBack={() => setStep('selectPlan')} onPay={handleFinalPay} />;
      case 'paypal':
        return <PayPalForm plan={selectedPlan} onBack={() => setStep('selectPlan')} onPay={handleFinalPay} />;
      case 'mobileMoney':
        return <MobileMoneyForm plan={selectedPlan} onBack={() => setStep('selectPlan')} onPay={handleFinalPay} />;
      default: // 'selectPlan'
        return (
          <>
            <p>Choose your plan to unlock premium features, priority access, and faster responses.</p>
            <div className="plan-options">
              {plans.map(plan => (
                <div
                  key={plan.id}
                  className={`plan-card ${selectedPlanId === plan.id ? 'selected' : ''} ${plan.bestValue ? 'best-value' : ''}`}
                  onClick={() => setSelectedPlanId(plan.id)}
                >
                  {plan.bestValue && <div className="best-value-badge">Best Value</div>}
                  <h3>{plan.name}</h3>
                  <p className="price">${plan.price}</p>
                  <p className="per-month-price">${(plan.price / plan.months).toFixed(2)} / month</p>
                </div>
              ))}
            </div>
            <div className="payment-methods">
              <h4>Pay With</h4>
              <div className="payment-icons">
                <i className="fab fa-cc-visa" onClick={() => setStep('card')}></i>
                <i className="fab fa-cc-mastercard" onClick={() => setStep('card')}></i>
                <i className="fab fa-cc-paypal" onClick={() => setStep('paypal')}></i>
                <span className="mobile-money-icon" onClick={() => setStep('mobileMoney')}>
                  <i className="fas fa-mobile-alt"></i> Mobile Money
                </span>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Upgrade to Pro</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}

export default UpgradeModal;