import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthLayout } from './components/AuthLayout';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Navigation } from './components/Navigation';
import { MobileNavigation } from './components/MobileNavigation';
import { Header } from './components/Header';
import { SendCoins } from './components/SendCoins';
import { Wallet } from './components/Wallet';
import { TransactionHistory } from './components/TransactionHistory';
import { Notifications } from './components/Notifications';
import { Chat } from './components/Chat';
import { Badges } from './components/Badges';
import { Profile } from './components/Profile';
import { AdminPanel } from './components/AdminPanel';
import { ErrorBoundary } from './components/ErrorBoundary';

function AppContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('wallet');
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [appError, setAppError] = useState<string | null>(null);
  const [isAppReady, setIsAppReady] = useState(false);

  // Minimal initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle hash navigation for history
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleHashChange = () => {
      if (window.location.hash === '#history') {
        setCurrentPage('history');
        window.history.replaceState(null, '', window.location.pathname);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Basic error handling
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleError = (event: ErrorEvent) => {
      console.error('App error:', event.error || event.message);
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled rejection:', event.reason);
      event.preventDefault();
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  // Show app error if any
  if (appError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Application Error
            </h1>
            <p className="text-gray-600 mb-4">
              There was a problem starting the application.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {appError}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while app is initializing or auth is loading
  if (!isAppReady || isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated || !user) {
    return <AuthLayout />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'send':
        return <SendCoins user={user} />;
      case 'wallet':
        return <Wallet user={user} />;
      case 'history':
        return <TransactionHistory user={user} />;
      case 'notifications':
        return <Notifications user={user} />;
      case 'chat':
        return <Chat user={user} onNavigate={setCurrentPage} />;
      case 'badges':
        return <Badges user={user} />;
      case 'profile':
        return <Profile user={user} />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Wallet user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Global Header */}
      <Header 
        user={user} 
        onNavigate={setCurrentPage} 
        isCollapsed={isHeaderCollapsed}
        onToggleCollapse={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
      />

      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        <Navigation 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          user={user}
          showHistoryAndNotifications={false}
        />
        <main className="flex-1 overflow-hidden">
          {renderCurrentPage()}
        </main>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col min-h-screen">
        <main className={`flex-1 overflow-y-auto ${currentPage === 'chat' ? '' : 'pb-20'}`}>
          {renderCurrentPage()}
        </main>
        {currentPage !== 'chat' && (
          <MobileNavigation 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage}
            user={user}
            showHistoryAndNotifications={false}
          />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}