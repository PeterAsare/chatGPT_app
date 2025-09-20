import React, { useState } from 'react';
import './UpgradeModal.css';

const plans = [
  { id: '1m', months: 1, price: 9.99, name: '1 Month' },
  { id: '6m', months: 6, price: 49.99, name: '6 Months', bestValue: true },
  { id: '12m', months: 12, price: 89.99, name: '1 Year' },
];

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

const MobileMoneyForm = ({ plan, onBack, onPay }) => {
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleFinalPay = () => {
    if (!phoneNumber) {
      alert("Please enter a phone number.");
      return;
    }
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

// --- ADDED: Mock Card Payment Form ---
const CardPaymentForm = ({ plan, onBack, onPay }) => {
  return (
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
        <button className="pay-button" onClick={onPay}>Pay ${plan.price}</button>
      </div>
    </div>
  );
};

// --- ADDED: Mock PayPal Form ---
const PayPalForm = ({ plan, onBack, onPay }) => {
  return (
    <div>
      <h4>Pay ${plan.price} with PayPal</h4>
      <p>You will be redirected to PayPal to complete your purchase securely.</p>
      <div className="modal-footer">
        <button className="back-button" onClick={onBack}>Back</button>
        <button className="paypal-button" onClick={onPay}>
          Proceed to PayPal
        </button>
      </div>
    </div>
  );
};


function UpgradeModal({ onClose }) {
  const [selectedPlanId, setSelectedPlanId] = useState(plans[1].id);
  // --- UPDATED: Added 'card' and 'paypal' steps ---
  const [step, setStep] = useState('selectPlan'); // 'selectPlan', 'mobileMoney', 'card', 'paypal'

  const selectedPlan = plans.find(p => p.id === selectedPlanId);

  const handleFinalPay = () => {
    alert(`This is a UI demo for the ${selectedPlan.name} plan. No payment was processed.`);
    onClose();
  };

  const renderStep = () => {
    switch (step) {
      case 'mobileMoney':
        return <MobileMoneyForm plan={selectedPlan} onBack={() => setStep('selectPlan')} onPay={handleFinalPay} />;
      // --- ADDED: Cases for 'card' and 'paypal' ---
      case 'card':
        return <CardPaymentForm plan={selectedPlan} onBack={() => setStep('selectPlan')} onPay={handleFinalPay} />;
      case 'paypal':
        return <PayPalForm plan={selectedPlan} onBack={() => setStep('selectPlan')} onPay={handleFinalPay} />;
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
            {/* --- UPDATED: Added buttons for all payment methods --- */}
            <div className="payment-methods">
              <p className="payment-title">Select Payment Method</p>
              <button className="payment-button mobile-money" onClick={() => setStep('mobileMoney')}>
                Mobile Money
              </button>
              <button className="payment-button card" onClick={() => setStep('card')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                Pay with Card
              </button>
              <button className="payment-button paypal" onClick={() => setStep('paypal')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8.32 21.499a.999.999 0 0 1-.63-1.784l3.96-3.168c.356-.285.77-.447 1.209-.447h2.299c3.564 0 6.45-2.886 6.45-6.45s-2.886-6.45-6.45-6.45H9.15c-.624 0-1.16.43-1.29.993l-2.78 11.6c-.11.46.14.93.6.93h4.19c.52 0 .97-.35 1.12-.84l.53-1.71h.01c.38.63 1.05.95 1.8.95 1.31 0 2.4-1.09 2.4-2.4s-1.09-2.4-2.4-2.4c-.75 0-1.42.32-1.8.95l-.53 1.71c-.15.49-.6.84-1.12.84H8.95c-.25 0-.48-.17-.56-.41l-1.17-4.89c-.04-.15.06-.3.21-.3h9.02c2.4 0 4.35 1.95 4.35 4.35s-1.95 4.35-4.35 4.35h-2.3c-.94 0-1.82.35-2.52.96l-3.96 3.168c-.19.15-.43.23-.67.23z"></path></svg>
                Pay with PayPal
              </button>
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