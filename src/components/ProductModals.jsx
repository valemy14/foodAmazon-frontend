import React from 'react';
import { X, Check } from 'lucide-react';

// Success Modal Component
export const SuccessModal = ({ show, onClose, title, message, type = 'success' }) => {
  if (!show) return null;

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return '#10b981'; // green
      case 'delete':
        return '#ef4444'; // red
      case 'import':
        return '#10b981'; // green
      default:
        return '#10b981';
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-container success-modal">
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className="success-icon" style={{ backgroundColor: `${getIconColor()}20` }}>
          <Check size={32} color={getIconColor()} />
        </div>
        
        <h2 className="success-title">{title}</h2>
        
        {message && <p className="success-message">{message}</p>}
        
        <button className="success-continue-btn" onClick={onClose}>
          Continue
        </button>
      </div>
    </>
  );
};

// Delete Confirmation Modal Component
export const DeleteConfirmModal = ({ show, onClose, onConfirm, itemCount = 1 }) => {
  if (!show) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-container delete-modal">
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
        
        <h2 className="delete-title">Delete Items</h2>
        
        <p className="delete-message">
          Are you sure you want to delete {itemCount} selected item{itemCount > 1 ? 's' : ''}?
        </p>
        
        <div className="delete-actions">
          <button className="delete-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="delete-confirm-btn" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

// Generic Modal Wrapper (for future use)
export const Modal = ({ show, onClose, children, title }) => {
  if (!show) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-container">
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
        {title && <h2 className="modal-title">{title}</h2>}
        <div className="modal-content">
          {children}
        </div>
      </div>
    </>
  );
};