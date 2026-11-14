import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * AuthPage is archived because FOYC is now 100% local-first.
 * Automatically redirects any remaining direct visits to /dashboard.
 */
export const AuthPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/dashboard', { replace: true });
  }, [navigate]);

  return null;
};
