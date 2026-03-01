import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import demoUsersData from '../mock-api/demo-users.json';

const AuthContext = createContext(null);

const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth`;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('osintx_token');
      const storedSession = sessionStorage.getItem('osintx_session');
      
      // First check for JWT token
      if (storedToken) {
        try {
          const res = await fetch(`${API_BASE}/me`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          const data = await res.json();
          
          if (data.success && data.user) {
            setUser(data.user);
            setToken(storedToken);
            setIsDemo(false);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          // Token invalid, clear it
          localStorage.removeItem('osintx_token');
        }
      }
      
      // Fallback to session storage (for demo users)
      if (storedSession) {
        try {
          const session = JSON.parse(storedSession);
          setUser(session.user);
          setIsDemo(session.isDemo);
        } catch (e) {
          sessionStorage.removeItem('osintx_session');
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  // Persist session for demo users
  const persistSession = useCallback((userData, isDemoSession, authToken = null) => {
    if (authToken) {
      localStorage.setItem('osintx_token', authToken);
    }
    const session = {
      user: userData,
      isDemo: isDemoSession,
      createdAt: new Date().toISOString()
    };
    sessionStorage.setItem('osintx_session', JSON.stringify(session));
  }, []);

  // Demo login - instant access without password (preserved)
  const loginAsDemo = useCallback((role) => {
    setIsLoading(true);
    setAuthError(null);

    setTimeout(() => {
      const demoUser = demoUsersData.demoUsers.find(u => u.role === role);
      
      if (demoUser) {
        const userData = {
          ...demoUser,
          sessionType: 'demo',
          loginTime: new Date().toISOString()
        };
        setUser(userData);
        setIsDemo(true);
        setToken(null);
        persistSession(userData, true);
      } else {
        setAuthError('Demo account not found');
      }
      setIsLoading(false);
    }, 800);
  }, [persistSession]);

  // Regular login - calls real API
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (data.success && data.user) {
        setUser(data.user);
        setToken(data.token);
        setIsDemo(false);
        persistSession(data.user, false, data.token);
        setIsLoading(false);
        return { success: true };
      } else {
        setAuthError(data.error || 'Login failed');
        setIsLoading(false);
        return { success: false, error: data.error };
      }
    } catch (err) {
      setAuthError('Failed to connect to server');
      setIsLoading(false);
      return { success: false, error: 'Connection failed' };
    }
  }, [persistSession]);

  // OAuth — initiate Google login
  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      // Get selected role from sessionStorage
      const role = sessionStorage.getItem('osintx_selected_role') || 'user';
      const res = await fetch(`${API_BASE}/google?role=${role}`);
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setAuthError('Failed to initiate Google login');
        setIsLoading(false);
      }
    } catch {
      setAuthError('Failed to connect to server for Google login');
      setIsLoading(false);
    }
  }, []);

  // OAuth — initiate GitHub login
  const loginWithGithub = useCallback(async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      // Get selected role from sessionStorage
      const role = sessionStorage.getItem('osintx_selected_role') || 'user';
      const res = await fetch(`${API_BASE}/github?role=${role}`);
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setAuthError('Failed to initiate GitHub login');
        setIsLoading(false);
      }
    } catch {
      setAuthError('Failed to connect to server for GitHub login');
      setIsLoading(false);
    }
  }, []);

  // OAuth — handle callback after redirect
  const handleOAuthCallback = useCallback(async (provider, code) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      // Get selected role from sessionStorage
      const role = sessionStorage.getItem('osintx_selected_role') || 'user';
      const res = await fetch(`${API_BASE}/${provider}/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, role }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setToken(data.token);
        setIsDemo(false);
        persistSession(data.user, false, data.token);
        setIsLoading(false);
        return { success: true };
      } else {
        setAuthError(data.error || 'OAuth authentication failed');
        setIsLoading(false);
        return { success: false, error: data.error };
      }
    } catch {
      setAuthError('OAuth callback failed');
      setIsLoading(false);
      return { success: false, error: 'OAuth callback failed' };
    }
  }, [persistSession]);

  // Signup - calls real API
  const signup = useCallback(async (userData) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: userData.role || 'student'
        })
      });
      
      const data = await res.json();
      
      if (data.success && data.user) {
        setUser(data.user);
        setToken(data.token);
        setIsDemo(false);
        persistSession(data.user, false, data.token);
        setIsLoading(false);
        return { success: true };
      } else {
        setAuthError(data.error || 'Signup failed');
        setIsLoading(false);
        return { success: false, error: data.error };
      }
    } catch (err) {
      setAuthError('Failed to connect to server');
      setIsLoading(false);
      return { success: false, error: 'Connection failed' };
    }
  }, [persistSession]);

  // Logout
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setIsDemo(false);
    setAuthError(null);
    localStorage.removeItem('osintx_token');
    sessionStorage.removeItem('osintx_session');
    sessionStorage.removeItem('osintx_selected_role');
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setAuthError(null);
  }, []);

  // Update user data (for profile updates)
  const updateUser = useCallback((userData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
    // Update session storage
    const session = {
      user: { ...user, ...userData },
      isDemo: isDemo,
      createdAt: new Date().toISOString()
    };
    sessionStorage.setItem('osintx_session', JSON.stringify(session));
  }, [user, isDemo]);

  // Get auth header for API calls
  const getAuthHeader = useCallback(() => {
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  }, [token]);

  const value = {
    user,
    token,
    isLoading,
    isDemo,
    authError,
    isAuthenticated: !!user,
    login,
    loginAsDemo,
    loginWithGoogle,
    loginWithGithub,
    handleOAuthCallback,
    signup,
    logout,
    clearError,
    getAuthHeader,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
