import { useState } from 'react';
import CouponListPage from './CouponListPage';
import CreateCouponPage from './CreateCouponPage';

/**
 * Coupon Manager Component
 * Manages navigation between coupon list and create coupon pages
 */
export default function CouponManager() {
  const [currentPage, setCurrentPage] = useState('list');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreateCoupon = () => {
    setCurrentPage('create');
  };

  const handleBackToList = () => {
    setCurrentPage('list');
  };

  const handleSaveCoupon = (couponData) => {
    console.log('Saving coupon:', couponData);
    // Go back to list - the CouponListPage will automatically reload
    setCurrentPage('list');
    // Force refresh of the list
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      {currentPage === 'list' && (
        <CouponListPage 
          key={refreshKey} 
          onCreateCoupon={handleCreateCoupon} 
        />
      )}
      
      {currentPage === 'create' && (
        <CreateCouponPage 
          onBack={handleBackToList}
          onSave={handleSaveCoupon}
        />
      )}
    </>
  );
}