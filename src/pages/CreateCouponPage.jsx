import { useState } from 'react';
import { ArrowLeft, DollarSign, ShoppingBag as BagIcon, Truck, Tag, Calendar } from 'lucide-react';
import { couponService } from '../services/couponService';

export default function CreateCouponPage({ onBack, onSave }) {
  const [formData, setFormData] = useState({
    couponCode: '',
    couponName: '',
    couponType: 'fixed',
    discountValue: '',
    appliesTo: '',
    duration: '',
    usageLimit: '',
    dontSetDuration: false,
    dontLimitUses: false
  });

  const [submitLoading, setSubmitLoading] = useState(false);

  const couponTypes = [
    { id: 'fixed', label: 'Fixed Discount', icon: <DollarSign size={24} /> },
    { id: 'percentage', label: 'Percentage Discount', icon: <BagIcon size={24} /> },
    { id: 'shipping', label: 'Free Shipping', icon: <Truck size={24} /> },
    { id: 'price', label: 'Price Discount', icon: <Tag size={24} /> }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.couponCode.trim()) {
      alert('Please enter a coupon code');
      return;
    }
    if (!formData.couponName.trim()) {
      alert('Please enter a coupon name');
      return;
    }
    if (!formData.discountValue) {
      alert('Please enter a discount value');
      return;
    }

    try {
      setSubmitLoading(true);
      
      // Prepare data for API
      const couponData = {
        couponCode: formData.couponCode,
        couponName: formData.couponName,
        couponType: formData.couponType,
        discountValue: parseFloat(formData.discountValue),
        appliesTo: formData.appliesTo,
        duration: formData.dontSetDuration ? null : formData.duration,
        usageLimit: formData.dontLimitUses ? null : parseInt(formData.usageLimit),
        status: 'Active'
      };

      const response = await couponService.createCoupon(couponData);
      
      if (response.success) {
        alert('Coupon created successfully!');
        onSave(couponData); // This will go back to list and reload
      } else {
        alert('Error: ' + response.error);
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Page Title */}
      <div className="page-title-section">
        <div className="title-with-back">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className="page-title">Create Coupon</h1>
        </div>
        <div className="title-actions">
          <button className="cancel-btn" onClick={onBack} disabled={submitLoading}>Cancel</button>
          <button className="save-btn" onClick={handleSubmit} disabled={submitLoading}>
            {submitLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="coupon-form-container">
        {/* Coupon Information Section */}
        <div className="form-section">
          <h3 className="section-title">Coupon Information</h3>
          <p className="section-subtitle">Code will be used by users in checkout</p>
          
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Coupon Code</label>
              <input
                type="text"
                className="form-input"
                placeholder="Shipfree20"
                value={formData.couponCode}
                onChange={(e) => handleInputChange('couponCode', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Coupon Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Free Shipping"
                value={formData.couponName}
                onChange={(e) => handleInputChange('couponName', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Coupon Type Section */}
        <div className="form-section">
          <h3 className="section-title">Coupon Type</h3>
          <p className="section-subtitle">Type of coupon you want to create</p>
          
          <div className="coupon-type-grid">
            {couponTypes.map((type) => (
              <button
                key={type.id}
                className={`coupon-type-card ${formData.couponType === type.id ? 'selected' : ''}`}
                onClick={() => handleInputChange('couponType', type.id)}
              >
                <div className="coupon-type-icon">{type.icon}</div>
                <span className="coupon-type-label">{type.label}</span>
              </button>
            ))}
          </div>

          <div className="form-grid" style={{ marginTop: '24px' }}>
            <div className="form-group">
              <label className="form-label">Discount Value</label>
              <input
                type="text"
                className="form-input"
                placeholder="Amount"
                value={formData.discountValue}
                onChange={(e) => handleInputChange('discountValue', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Applies to</label>
              <select
                className="form-select"
                value={formData.appliesTo}
                onChange={(e) => handleInputChange('appliesTo', e.target.value)}
              >
                <option value="">Choose</option>
                <option value="all">All Products</option>
                <option value="specific">Specific Products</option>
                <option value="categories">Product Categories</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Duration</label>
              <div className="date-input-wrapper">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Set Duration"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  disabled={formData.dontSetDuration}
                />
                <Calendar size={18} className="input-icon" />
              </div>
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="noDuration"
                  checked={formData.dontSetDuration}
                  onChange={(e) => handleInputChange('dontSetDuration', e.target.checked)}
                />
                <label htmlFor="noDuration">Don't set duration</label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Usage Limits</label>
              <input
                type="text"
                className="form-input"
                placeholder="Amount of uses"
                value={formData.usageLimit}
                onChange={(e) => handleInputChange('usageLimit', e.target.value)}
                disabled={formData.dontLimitUses}
              />
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="noLimit"
                  checked={formData.dontLimitUses}
                  onChange={(e) => handleInputChange('dontLimitUses', e.target.checked)}
                />
                <label htmlFor="noLimit">Don't limit amount of uses</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="bottom-actions">
        <button className="cancel-btn" onClick={onBack} disabled={submitLoading}>Cancel</button>
        <button className="save-btn" onClick={handleSubmit} disabled={submitLoading}>
          {submitLoading ? 'Saving...' : 'Save'}
        </button>
      </div>

      <style>{`
        .page-title-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .title-with-back {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: transparent;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s;
        }

        .back-btn:hover {
          background: #f3f4f6;
        }

        .page-title {
          font-size: 28px;
          font-weight: 600;
          margin: 0;
        }

        .title-actions {
          display: flex;
          gap: 12px;
        }

        .cancel-btn {
          padding: 10px 20px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .cancel-btn:hover {
          background: #f3f4f6;
        }

        .save-btn {
          padding: 10px 20px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .save-btn:hover {
          background: #1d4ed8;
        }

        .coupon-form-container {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .form-section {
          background: white;
          padding: 24px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 8px 0;
        }

        .section-subtitle {
          color: #6b7280;
          margin: 0 0 24px 0;
          font-size: 14px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-weight: 500;
          font-size: 14px;
          color: #374151;
        }

        .form-input,
        .form-select {
          padding: 10px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
        }

        .form-input:disabled {
          background: #f3f4f6;
          cursor: not-allowed;
        }

        .date-input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          pointer-events: none;
        }

        .checkbox-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
        }

        .checkbox-wrapper input[type="checkbox"] {
          cursor: pointer;
        }

        .checkbox-wrapper label {
          font-size: 14px;
          color: #6b7280;
          cursor: pointer;
        }

        .coupon-type-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .coupon-type-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 24px;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .coupon-type-card:hover {
          border-color: #2563eb;
        }

        .coupon-type-card.selected {
          border-color: #2563eb;
          background: #eff6ff;
        }

        .coupon-type-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
          border-radius: 12px;
          color: #6b7280;
        }

        .coupon-type-card.selected .coupon-type-icon {
          background: #dbeafe;
          color: #2563eb;
        }

        .coupon-type-label {
          font-size: 14px;
          font-weight: 500;
          text-align: center;
        }

        .bottom-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .coupon-type-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}