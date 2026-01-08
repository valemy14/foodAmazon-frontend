import { useState,useEffect } from 'react';
import { messageService } from '../services/messageService';
import {   Mail, Settings,  Search, MoreVertical, Phone, Video, Smile, Paperclip, Send } from 'lucide-react';


export default function SuperAdminInbox() {
  const [selectedChat, setSelectedChat] = useState(0);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

 

  const [contacts, setContacts] = useState([]);
const [chatMessages, setChatMessages] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [sendingMessage, setSendingMessage] = useState(false);

useEffect(() => {
  loadConversations();
}, []);

const loadConversations = async () => {
  try {
    setLoading(true);
    const response = await messageService.getConversations();
    
    if (response.success) {
      // Transform API data to match your UI format
      const formattedContacts = response.conversations.map((conv, index) => ({
        id: conv.user._id,
        name: conv.user.name,
        avatar: conv.user.name ? conv.user.name.charAt(0).toUpperCase() : '👤',
        lastMessage: conv.lastMessage,
        time: new Date(conv.lastMessageTime).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit' 
        }),
        unread: conv.unreadCount,
        online: true, // You can track this separately if needed
        bgColor: getRandomColor()
      }));
      
      setContacts(formattedContacts);
      
      // Load first conversation by default
      if (formattedContacts.length > 0) {
        loadConversationMessages(formattedContacts[0].id);
      }
      
      setError(null);
    } else {
      setError(response.error);
    }
  } catch (err) {
    setError(err.message);
    console.error('Error loading conversations:', err);
  } finally {
    setLoading(false);
  }
};

const getRandomColor = () => {
  const colors = ['#fecaca', '#a5f3fc', '#fde68a', '#86efac', '#ddd6fe'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const loadConversationMessages = async (userId) => {
  try {
    const response = await messageService.getConversationWithUser(userId);
    
    if (response.success) {
      // Transform messages to match UI format
      const formattedMessages = response.messages.map(msg => ({
        id: msg._id,
        sender: msg.sender._id === localStorage.getItem('userId') ? 'me' : 'other',
        message: msg.content,
        time: new Date(msg.createdAt).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit' 
        }),
        avatar: msg.sender.name ? msg.sender.name.charAt(0).toUpperCase() : '👤',
        bgColor: '#fecaca',
        images: msg.attachments || []
      }));
      
      setChatMessages(formattedMessages);
    }
  } catch (err) {
    console.error('Error loading messages:', err);
  }
};


  const handleSendMessage = async () => {
  if (!messageInput.trim()) return;
  
  if (contacts.length === 0) {
    alert('No conversation selected');
    return;
  }

  const currentContact = contacts.find(c => c.id === selectedChat);
  if (!currentContact) {
    alert('Please select a conversation');
    return;
  }

  try {
    setSendingMessage(true);
    const response = await messageService.sendMessage(
      currentContact.id,
      messageInput.trim()
    );
    
    if (response.success) {
      setMessageInput('');
      // Reload messages for current conversation
      loadConversationMessages(currentContact.id);
      // Refresh conversations list
      loadConversations();
    } else {
      alert('Error sending message: ' + response.error);
    }
  } catch (err) {
    alert('Error: ' + err.message);
  } finally {
    setSendingMessage(false);
  }
};

 const filteredContacts = contacts.filter(contact =>
  contact.name?.toLowerCase().includes(searchTerm.toLowerCase())
);

  const handleChatSelect = (contactId) => {
  setSelectedChat(contactId);
  loadConversationMessages(contactId);
};

const currentContact = contacts.find(c => c.id === selectedChat);


if (loading) {
  return (
    <div className="inbox-container">
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div>Loading messages...</div>
        </div>
      </div>
    </div>
  );
}

if (error) {
  return (
    <div className="inbox-container">
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', color: 'red' }}>
          Error: {error}
          <button onClick={loadConversations} style={{ marginLeft: '10px', padding: '8px 16px' }}>
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}

  return (
    <>
     
        {/* Inbox Title */}
        <div className="inbox-header">
          <h1 className="inbox-title">Inbox</h1>
        </div>

        {/* Inbox Content */}
        <div className="inbox-content">
          {/* Messages List */}
          <div className="messages-panel">
            <div className="messages-header">
              <h2>Messages</h2>
              <button className="more-btn">
                <MoreVertical size={20} />
              </button>
            </div>

            <div className="messages-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search...."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="messages-list">
                    {filteredContacts.length === 0 ? (<div style={{ textAlign: 'center', padding: '20px', color: '#9ca3af' }}>No conversations yet
            </div>
                 ) : (
              filteredContacts.map((contact) => (
            <div
                key={contact.id}
                className={`message-item ${selectedChat === contact.id ? 'active' : ''}`}
                onClick={() => handleChatSelect(contact.id)}>
                <div className="message-avatar" style={{ backgroundColor: contact.bgColor }}>
                {contact.avatar}
                {contact.online && <span className="online-indicator"></span>}
                </div>
        <div className="message-info">
          <div className="message-header-row">
            <h4>{contact.name}</h4>
            <span className="message-time">{contact.time}</span>
          </div>
          <div className="message-preview-row">
            <p>{contact.lastMessage}</p>
            {contact.unread > 0 && (
              <span className="unread-badge">{contact.unread}</span>
            )}
          </div>
        </div>
      </div>
    ))
  )}
</div>
          </div>

          {/* Chat Area */}
        <div className="chat-panel">
           <div className="chat-header">
                <div className="chat-user-info">
                    <div
                    className="chat-avatar"
                    style={{ backgroundColor: currentContact?.bgColor || '#fecaca' }}
                    >
                    {currentContact?.avatar || '👤'}
                    {currentContact?.online && <span className="online-status"></span>}
                    </div>
                    <div>
                    <h3>{currentContact?.name || 'Select a conversation'}</h3>
                    <span className="status-text">Active Now</span>
                    </div>
                </div>
                <div className="chat-actions">
                    <button className="chat-action-btn">
                    <Phone size={20} />
                    </button>
                    <button className="chat-action-btn">
                    <Video size={20} />
                    </button>
                    <button className="chat-action-btn">
                    <MoreVertical size={20} />
                    </button>
                </div>
        </div>


            <div className="chat-date-divider">
              <span>Today</span>
            </div>

           <div className="chat-messages">
                 {chatMessages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                No messages yet. Start the conversation!
                </div>
                    ) : (
              chatMessages.map((msg) => (
            <div key={msg.id} className={`chat-message ${msg.sender}`}>
                {msg.sender === 'other' && (
                <div className="message-avatar-small" style={{ backgroundColor: msg.bgColor }}>
                    {msg.avatar}
                </div>
        )}
        <div className="message-content">
          <div className="message-bubble">
            {msg.message}
          </div>
          {msg.images && msg.images.length > 0 && (
            <div className="message-images">
              {msg.images.map((img, idx) => (
                <div key={idx} className="message-image">
                  <span style={{ fontSize: '60px' }}>{img}</span>
                </div>
              ))}
            </div>
          )}
          <span className="message-timestamp">{msg.time}</span>
        </div>
        {msg.sender === 'me' && (
          <button className="message-options">
            <MoreVertical size={16} />
          </button>
        )}
      </div>
    ))
  )}
</div>

            <div className="chat-input-container">
              <div className="chat-input-wrapper">
                <div className="user-avatar-input">👤</div>
                <input
                  type="text"
                  placeholder="Write a message down here..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <div className="input-actions">
                  <button className="input-action-btn">
                    <Smile size={20} />
                  </button>
                  <button className="input-action-btn">
                    <Paperclip size={20} />
                  </button>
                 <button 
                     className="send-btn"  onClick={handleSendMessage} disabled={sendingMessage || !messageInput.trim()}style={{ opacity: sendingMessage ? 0.5 : 1 }}>
                    <Send size={20} />
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}