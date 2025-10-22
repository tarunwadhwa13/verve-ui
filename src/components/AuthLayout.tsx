import React, { useState } from 'react';
import { Login } from './Login';
import { PasswordReset } from './PasswordReset';

export function AuthLayout() {
  const [currentView, setCurrentView] = useState<'login' | 'reset'>('login');

  if (currentView === 'reset') {
    return <PasswordReset onBackToLogin={() => setCurrentView('login')} />;
  }

  return <Login onSwitchToReset={() => setCurrentView('reset')} />;
}