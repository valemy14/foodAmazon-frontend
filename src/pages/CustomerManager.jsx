import { useState } from 'react';
import SuperAdminCustomerPage from './SuperAdminCustomerPage';
import CustomerInformationPage from './CustomerInformationPage';
import AddCustomerPage from './AddCustomerPage';

/**
 * Customer Manager Component
 * Manages navigation between customer pages
 */

export default function CustomerManager() {
  // State to track which page is currently active
  const [currentPage, setCurrentPage] = useState('list'); // 'list', 'info', 'add'
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Navigation handlers
  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setCurrentPage('info');
  };

  const handleAddCustomer = () => {
    setCurrentPage('add');
  };

  const handleBackToList = () => {
    setCurrentPage('list');
    setSelectedCustomer(null);
  };

  

  // Render the appropriate page based on currentPage state
  return (
    <>
      {currentPage === 'list' && (
        <SuperAdminCustomerPage 
          onViewCustomer={handleViewCustomer}
          onAddCustomer={handleAddCustomer}
        />
      )}
      
      
      {currentPage === 'info' && (
        <CustomerInformationPage 
          customer={selectedCustomer}
          onBack={handleBackToList}
        />
      )}
      
      {currentPage === 'add' && (
        <AddCustomerPage 
          onBack={handleBackToList}
        />
      )}
    </>
  );
}