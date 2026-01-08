import { useState } from 'react';



export default function SuperAdminProfileSettingsPage() {
 
  const [activeTab, setActiveTab] = useState('profile');

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    language: 'English',
    timezone: 'GMT +02:00'
  });

  // Notification toggles state
  const [notificationSettings, setNotificationSettings] = useState({
    personalizedOffers: true,
    onlineWebinars: true,
    newFeatures: true,
    securityBilling: false,
    marketing: false
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggle = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleCancel = () => {
    console.log('Cancelled');
  };

  const handleSave = () => {
    console.log('Saved:', { profileData, notificationSettings });
  };

  const handleFileUpload = () => {
    console.log('File upload clicked');
  };

  return (
    <>
        {/* Page Title and Actions */}
        <div className="superadmin-settings-title-section">
          <h1 className="superadmin-settings-page-title">Settings</h1>
          <div className="superadmin-settings-title-actions">
            <button className="superadmin-settings-cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button className="superadmin-settings-save-btn" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="superadmin-settings-content">
          {/* Tabs */}
          <div className="superadmin-settings-tabs">
            <button 
              className={`superadmin-settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button 
              className={`superadmin-settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </button>
            <button 
              className={`superadmin-settings-tab ${activeTab === 'accounts' ? 'active' : ''}`}
              onClick={() => setActiveTab('accounts')}
            >
              Accounts
            </button>
            <button 
              className={`superadmin-settings-tab ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              Security
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="superadmin-settings-tab-content">
              <div className="superadmin-settings-section">
                <h2 className="superadmin-settings-section-title">Profile Details</h2>
                <p className="superadmin-settings-section-subtitle">Enter your profile information</p>

                {/* Profile Image Upload */}
                <div className="superadmin-settings-upload-section">
                  <label className="superadmin-settings-upload-label">Profile Image</label>
                  <div className="superadmin-settings-upload-area" onClick={handleFileUpload}>
                    <button className="superadmin-settings-upload-btn">Add File</button>
                    <p className="superadmin-settings-upload-text">Or drag and drop files</p>
                  </div>
                </div>

                {/* Name Fields */}
                <div className="superadmin-settings-form-row">
                  <div className="superadmin-settings-form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleInputChange}
                      className="superadmin-settings-input"
                    />
                  </div>
                  <div className="superadmin-settings-form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleInputChange}
                      className="superadmin-settings-input"
                    />
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="superadmin-settings-form-row">
                  <div className="superadmin-settings-form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      className="superadmin-settings-input"
                    />
                  </div>
                  <div className="superadmin-settings-form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      className="superadmin-settings-input"
                    />
                  </div>
                </div>
              </div>

              {/* Regional Settings */}
              <div className="superadmin-settings-section">
                <h2 className="superadmin-settings-section-title">Regional Settings</h2>
                <p className="superadmin-settings-section-subtitle">Set your language and timezone</p>

                <div className="superadmin-settings-form-row">
                  <div className="superadmin-settings-form-group">
                    <label>Language</label>
                    <select
                      name="language"
                      value={profileData.language}
                      onChange={handleInputChange}
                      className="superadmin-settings-select"
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                  <div className="superadmin-settings-form-group">
                    <label>Timezone</label>
                    <select
                      name="timezone"
                      value={profileData.timezone}
                      onChange={handleInputChange}
                      className="superadmin-settings-select"
                    >
                      <option>GMT +02:00</option>
                      <option>GMT +01:00</option>
                      <option>GMT +00:00</option>
                      <option>GMT -05:00</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="superadmin-settings-tab-content">
              <div className="superadmin-settings-toggle-list">
                <div className="superadmin-settings-toggle-item">
                  <div className="superadmin-settings-toggle-info">
                    <h3>Personalized Offers</h3>
                    <p>Receive offers made special for you</p>
                  </div>
                  <label className="superadmin-settings-toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.personalizedOffers}
                      onChange={() => handleToggle('personalizedOffers')}
                    />
                    <span className="superadmin-settings-toggle-slider"></span>
                  </label>
                </div>

                <div className="superadmin-settings-toggle-item">
                  <div className="superadmin-settings-toggle-info">
                    <h3>Online Webinars</h3>
                    <p>Get notified about upcoming webinars</p>
                  </div>
                  <label className="superadmin-settings-toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.onlineWebinars}
                      onChange={() => handleToggle('onlineWebinars')}
                    />
                    <span className="superadmin-settings-toggle-slider"></span>
                  </label>
                </div>

                <div className="superadmin-settings-toggle-item">
                  <div className="superadmin-settings-toggle-info">
                    <h3>New Features</h3>
                    <p>Updates about new features and product releases</p>
                  </div>
                  <label className="superadmin-settings-toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.newFeatures}
                      onChange={() => handleToggle('newFeatures')}
                    />
                    <span className="superadmin-settings-toggle-slider"></span>
                  </label>
                </div>

                <div className="superadmin-settings-toggle-item">
                  <div className="superadmin-settings-toggle-info">
                    <h3>Security and Billing</h3>
                    <p>Account security and notifications about billing</p>
                  </div>
                  <label className="superadmin-settings-toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.securityBilling}
                      onChange={() => handleToggle('securityBilling')}
                    />
                    <span className="superadmin-settings-toggle-slider"></span>
                  </label>
                </div>

                <div className="superadmin-settings-toggle-item">
                  <div className="superadmin-settings-toggle-info">
                    <h3>Marketing</h3>
                    <p>Receive marketing newsletters about our new products.</p>
                  </div>
                  <label className="superadmin-settings-toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.marketing}
                      onChange={() => handleToggle('marketing')}
                    />
                    <span className="superadmin-settings-toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Accounts Tab - Same as Notifications */}
          {activeTab === 'accounts' && (
            <div className="superadmin-settings-tab-content">
              <div className="superadmin-settings-toggle-list">
                <div className="superadmin-settings-toggle-item">
                  <div className="superadmin-settings-toggle-info">
                    <h3>Personalized Offers</h3>
                    <p>Receive offers made special for you</p>
                  </div>
                  <label className="superadmin-settings-toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.personalizedOffers}
                      onChange={() => handleToggle('personalizedOffers')}
                    />
                    <span className="superadmin-settings-toggle-slider"></span>
                  </label>
                </div>

                <div className="superadmin-settings-toggle-item">
                  <div className="superadmin-settings-toggle-info">
                    <h3>Online Webinars</h3>
                    <p>Get notified about upcoming webinars</p>
                  </div>
                  <label className="superadmin-settings-toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.onlineWebinars}
                      onChange={() => handleToggle('onlineWebinars')}
                    />
                    <span className="superadmin-settings-toggle-slider"></span>
                  </label>
                </div>

                <div className="superadmin-settings-toggle-item">
                  <div className="superadmin-settings-toggle-info">
                    <h3>New Features</h3>
                    <p>Updates about new features and product releases</p>
                  </div>
                  <label className="superadmin-settings-toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.newFeatures}
                      onChange={() => handleToggle('newFeatures')}
                    />
                    <span className="superadmin-settings-toggle-slider"></span>
                  </label>
                </div>

                <div className="superadmin-settings-toggle-item">
                  <div className="superadmin-settings-toggle-info">
                    <h3>Security and Billing</h3>
                    <p>Account security and notifications about billing</p>
                  </div>
                  <label className="superadmin-settings-toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.securityBilling}
                      onChange={() => handleToggle('securityBilling')}
                    />
                    <span className="superadmin-settings-toggle-slider"></span>
                  </label>
                </div>

                <div className="superadmin-settings-toggle-item">
                  <div className="superadmin-settings-toggle-info">
                    <h3>Marketing</h3>
                    <p>Receive marketing newsletters about our new products.</p>
                  </div>
                  <label className="superadmin-settings-toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.marketing}
                      onChange={() => handleToggle('marketing')}
                    />
                    <span className="superadmin-settings-toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab - Same as Notifications */}
          {activeTab === 'security' && (
            <div className="superadmin-settings-tab-content">
              <div className="superadmin-settings-toggle-list">
                <div className="superadmin-settings-toggle-item">
                  <div className="superadmin-settings-toggle-info">
                    <h3>Personalized Offers</h3>
                    <p>Receive offers made special for you</p>
                  </div>
                  <label className="superadmin-settings-toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.personalizedOffers}
                      onChange={() => handleToggle('personalizedOffers')}
                    />
                    <span className="superadmin-settings-toggle-slider"></span>
                  </label>
                </div>

                <div className="superadmin-settings-toggle-item">
                  <div className="superadmin-settings-toggle-info">
                    <h3>Online Webinars</h3>
                    <p>Get notified about upcoming webinars</p>
                  </div>
                  <label className="superadmin-settings-toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.onlineWebinars}
                      onChange={() => handleToggle('onlineWebinars')}
                    />
                    <span className="superadmin-settings-toggle-slider"></span>
                  </label>
                </div>

                <div className="superadmin-settings-toggle-item">
                  <div className="superadmin-settings-toggle-info">
                    <h3>New Features</h3>
                    <p>Updates about new features and product releases</p>
                  </div>
                  <label className="superadmin-settings-toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.newFeatures}
                      onChange={() => handleToggle('newFeatures')}
                    />
                    <span className="superadmin-settings-toggle-slider"></span>
                  </label>
                </div>

                <div className="superadmin-settings-toggle-item">
                  <div className="superadmin-settings-toggle-info">
                    <h3>Security and Billing</h3>
                    <p>Account security and notifications about billing</p>
                  </div>
                  <label className="superadmin-settings-toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.securityBilling}
                      onChange={() => handleToggle('securityBilling')}
                    />
                    <span className="superadmin-settings-toggle-slider"></span>
                  </label>
                </div>

                <div className="superadmin-settings-toggle-item">
                  <div className="superadmin-settings-toggle-info">
                    <h3>Marketing</h3>
                    <p>Receive marketing newsletters about our new products.</p>
                  </div>
                  <label className="superadmin-settings-toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.marketing}
                      onChange={() => handleToggle('marketing')}
                    />
                    <span className="superadmin-settings-toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="superadmin-settings-bottom-actions">
          <button className="superadmin-settings-cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button className="superadmin-settings-save-btn" onClick={handleSave}>
            Save
          </button>
        </div>
     
    </>
  );
}