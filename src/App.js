import React, { useState, useEffect } from 'react';
import { TodoWrapper } from './components/TodoWrapper';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState('light');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const savedTheme = localStorage.getItem('todoapp-theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing app:', error);
        setIsLoading(false);
      }
    };

    initializeApp();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('todoapp-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-container">
          <div className="loading-logo">
            <div className="logo-icon">✓</div>
            <h1 className="logo-text">TodoMaster</h1>
          </div>
          <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Preparing your workspace...</p>
          </div>
          <div className="loading-progress">
            <div className="progress-bar"></div>
          </div>
        </div>
        <div className="loading-background">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
          <div className="floating-shape shape-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app-background">
        <div className="background-gradient"></div>
        <div className="background-pattern"></div>
        <div className="floating-elements">
          <div className="floating-element element-1"></div>
          <div className="floating-element element-2"></div>
          <div className="floating-element element-3"></div>
        </div>
      </div>

      <header className="app-header">
        <div className="header-content">
          <div className="app-branding">
            <div className="app-logo">
              <div className="logo-icon">✓</div>
              <div className="logo-text">
                <h1>TodoMaster</h1>
                <span className="logo-tagline">Organize. Achieve. Succeed.</span>
              </div>
            </div>
          </div>

          <div className="header-controls">
            <div className="connection-status">
              <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
                <span className="status-dot"></span>
                <span className="status-text">{isOnline ? 'Online' : 'Offline'}</span>
              </div>
            </div>

            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              <div className="theme-toggle-track">
                <div className="theme-toggle-thumb">
                  <span className="theme-icon">
                    {theme === 'light' ? '🌙' : '☀️'}
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="main-container">
          <div className="app-intro">
            <h2 className="intro-title">Welcome to your productivity hub</h2>
            <p className="intro-description">
              Transform your daily tasks into achievements. Stay organized, focused, and productive.
            </p>
          </div>

          <div className="todo-container">
            <TodoWrapper />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-info">
            <p>&copy; 2024 TodoMaster. Crafted with ❤️ for productivity enthusiasts.</p>
          </div>
          <div className="footer-links">
            <a href="#privacy" className="footer-link">Privacy</a>
            <a href="#terms" className="footer-link">Terms</a>
            <a href="#support" className="footer-link">Support</a>
          </div>
        </div>
      </footer>

      {!isOnline && (
        <div className="offline-banner">
          <div className="offline-content">
            <span className="offline-icon">📡</span>
            <span className="offline-message">You're offline. Changes will sync when connection is restored.</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
