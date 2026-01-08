import React, { useState, useEffect } from 'react';
import { D1 } from '../assets/Index';
import { userService } from '../services/userService';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    email: '',
    phone: '',
    country: '',
    location: '',
    bio: ''
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification state
  const [notificationData, setNotificationData] = useState({
    newsUpdates: true,
    tipsTutorials: true,
    userResearch: true,
    commentsOption: 'all'
  });

  useEffect(() => {
    fetchUserProfile();
    fetchNotificationPreferences();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const userData = await userService.getProfile();
      setFormData({
        name: userData.name || '',
        displayName: userData.displayName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        country: userData.country || '',
        location: userData.location || '',
        bio: userData.bio || ''
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotificationPreferences = async () => {
    try {
      const prefs = await userService.getNotificationPreferences();
      setNotificationData({
        newsUpdates: prefs.newsUpdates ?? true,
        tipsTutorials: prefs.tipsTutorials ?? true,
        userResearch: prefs.userResearch ?? false,
        commentsOption: prefs.commentsOption || 'all'
      });
    } catch (err) {
      console.error('Error fetching notification preferences:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationCheckbox = (field) => {
    setNotificationData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleCommentsOptionChange = (option) => {
    setNotificationData(prev => ({
      ...prev,
      commentsOption: option
    }));
  };

  const handleUploadAvatar = () => {
    alert('Avatar upload coming soon!');
  };

  const handleDeleteAvatar = async () => {
    try {
      await userService.deleteAvatar();
      alert('Avatar deleted successfully');
    } catch (err) {
      alert('Error deleting avatar: ' + err);
    }
  };

  const handleCancel = () => {
    if (activeTab === 'profile') {
      fetchUserProfile();
    } else if (activeTab === 'password') {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } else if (activeTab === 'notification') {
      fetchNotificationPreferences();
    }
  };

  const handleUpdate = async () => {
    try {
      if (activeTab === 'profile') {
        const result = await userService.updateProfile(formData);
        
        if (formData.name) {
          localStorage.setItem('userName', formData.name);
        }
        
        alert(result.message || 'Profile updated successfully');
        fetchUserProfile();
      } else if (activeTab === 'password') {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          alert('New passwords do not match');
          return;
        }
        
        const result = await userService.changePassword(passwordData);
        alert(result.message || 'Password changed successfully');
        
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else if (activeTab === 'notification') {
        const result = await userService.updateNotificationPreferences(notificationData);
        alert(result.message || 'Notification preferences updated successfully');
      }
    } catch (err) {
      console.error('Error updating:', err);
      alert('Error: ' + err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div>Loading settings...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Title */}
      <div className="settings-page-title">
        <h1>Settings</h1>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ padding: '20px', color: 'red', textAlign: 'center', marginBottom: '20px' }}>
          Error loading settings: {error.toString()}
        </div>
      )}

      {/* Settings Content */}
      <div className="settings-content">
        <div className="settings-section-title">
          <h2>Account Settings</h2>
        </div>

        {/* Tabs */}
        <div className="settings-tabs">
          <button 
            className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button 
            className={`settings-tab ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            Password
          </button>
          <button 
            className={`settings-tab ${activeTab === 'notification' ? 'active' : ''}`}
            onClick={() => setActiveTab('notification')}
          >
            Notification
          </button>
        </div>

        {/* Profile Tab Content */}
        {activeTab === 'profile' && (
          <div className="settings-form-container">
            {/* Avatar Section */}
            <div className="settings-avatar-section">
              <div className="settings-avatar-wrapper">
                <img src={D1} alt="User Avatar" className="settings-avatar-image" />
              </div>
              <div className="settings-avatar-buttons">
                <button className="settings-upload-btn" onClick={handleUploadAvatar}>
                  Upload New
                </button>
                <button className="settings-delete-btn" onClick={handleDeleteAvatar}>
                  Delete Avatar
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="settings-form">
              <div className="settings-form-row">
                <div className="settings-form-group">
                  <label htmlFor="name">Your Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="settings-input"
                  />
                </div>
                <div className="settings-form-group">
                  <label htmlFor="displayName">Display Name</label>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="settings-input"
                  />
                </div>
              </div>

              <div className="settings-form-row">
                <div className="settings-form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="settings-input"
                    style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                  />
                  <small style={{ color: '#6b7280' }}>Email cannot be changed</small>
                </div>
                <div className="settings-form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="settings-input"
                  />
                </div>
              </div>

              <div className="settings-form-row">
                <div className="settings-form-group">
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="settings-input"
                  />
                </div>
                <div className="settings-form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="settings-input"
                  />
                </div>
              </div>

              <div className="settings-form-group full-width">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="settings-textarea"
                  rows="5"
                />
              </div>

              {/* Action Buttons */}
              <div className="settings-form-actions">
                <button className="settings-cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="settings-update-btn" onClick={handleUpdate}>
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Password Tab Content */}
        {activeTab === 'password' && (
          <div className="settings-form-container">
            <div className="settings-form">
              <div className="settings-form-group full-width">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="settings-input"
                />
              </div>

              <div className="settings-form-group full-width">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="settings-input"
                />
              </div>

              <div className="settings-form-group full-width">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="settings-input"
                />
              </div>

              {/* Action Buttons */}
              <div className="settings-form-actions">
                <button className="settings-cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="settings-update-btn" onClick={handleUpdate}>
                  Change Password
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notification Tab Content */}
        {activeTab === 'notification' && (
          <div className="settings-form-container">
            <div className="settings-notification-content">
              {/* Email Section */}
              <div className="settings-notification-section">
                <h3 className="settings-notification-title">Email</h3>
                
                <div className="settings-notification-group">
                  <h4 className="settings-notification-subtitle">Notifications from us</h4>
                  <p className="settings-notification-description">
                    Receive the latest news and updates about our products from us.
                  </p>

                  <div className="settings-checkbox-group">
                    <label className="settings-checkbox-label">
                      <input
                        type="checkbox"
                        checked={notificationData.newsUpdates}
                        onChange={() => handleNotificationCheckbox('newsUpdates')}
                        className="settings-checkbox-input"
                      />
                      <span className="settings-checkbox-custom"></span>
                      <div className="settings-checkbox-text">
                        <span className="settings-checkbox-title">News and updates</span>
                        <span className="settings-checkbox-desc">News about product and feature updates.</span>
                      </div>
                    </label>

                    <label className="settings-checkbox-label">
                      <input
                        type="checkbox"
                        checked={notificationData.tipsTutorials}
                        onChange={() => handleNotificationCheckbox('tipsTutorials')}
                        className="settings-checkbox-input"
                      />
                      <span className="settings-checkbox-custom"></span>
                      <div className="settings-checkbox-text">
                        <span className="settings-checkbox-title">Tips and tutorials</span>
                        <span className="settings-checkbox-desc">Tips on getting more out of our platform.</span>
                      </div>
                    </label>

                    <label className="settings-checkbox-label">
                      <input
                        type="checkbox"
                        checked={notificationData.userResearch}
                        onChange={() => handleNotificationCheckbox('userResearch')}
                        className="settings-checkbox-input"
                      />
                      <span className="settings-checkbox-custom"></span>
                      <div className="settings-checkbox-text">
                        <span className="settings-checkbox-title">User research</span>
                        <span className="settings-checkbox-desc">Get involved in our beta testing program.</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="settings-notification-group">
                  <h4 className="settings-notification-subtitle">Comments</h4>
                  <p className="settings-notification-description">
                    These are notifications for comments on your posts
                  </p>

                  <div className="settings-radio-group">
                    <label className="settings-radio-label">
                      <input
                        type="radio"
                        name="commentsOption"
                        checked={notificationData.commentsOption === 'none'}
                        onChange={() => handleCommentsOptionChange('none')}
                        className="settings-radio-input"
                      />
                      <span className="settings-radio-custom"></span>
                      <div className="settings-radio-text">
                        <span className="settings-radio-title">Do not notify me</span>
                      </div>
                    </label>

                    <label className="settings-radio-label">
                      <input
                        type="radio"
                        name="commentsOption"
                        checked={notificationData.commentsOption === 'mentions'}
                        onChange={() => handleCommentsOptionChange('mentions')}
                        className="settings-radio-input"
                      />
                      <span className="settings-radio-custom"></span>
                      <div className="settings-radio-text">
                        <span className="settings-radio-title">Mentions only</span>
                        <span className="settings-radio-desc">Only notify me if I'm mentioned in a comment.</span>
                      </div>
                    </label>

                    <label className="settings-radio-label">
                      <input
                        type="radio"
                        name="commentsOption"
                        checked={notificationData.commentsOption === 'all'}
                        onChange={() => handleCommentsOptionChange('all')}
                        className="settings-radio-input"
                      />
                      <span className="settings-radio-custom"></span>
                      <div className="settings-radio-text">
                        <span className="settings-radio-title">All comments</span>
                        <span className="settings-radio-desc">Notify me for all comments on my posts.</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="settings-form-actions" style={{ marginTop: '30px' }}>
                  <button className="settings-cancel-btn" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button className="settings-update-btn" onClick={handleUpdate}>
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;