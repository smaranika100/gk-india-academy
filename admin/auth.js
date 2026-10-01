/**
 * GK India Academy - Admin Authentication & Authorization Module
 * 
 * Powered by Supabase Authentication.
 * Handles client initialization, session management, role verification,
 * form validation, route protection, and secure logout.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AdminAuth = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  let supabaseClient = null;
  let initPromise = null;

  /**
   * Maximum duration (ms) to wait for authentication service operations
   */
  const AUTH_TIMEOUT_MS = 6000;

  /**
   * Promise timeout wrapper to prevent infinite loading
   */
  function withTimeout(promise, ms, timeoutMessage) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(timeoutMessage || ('Operation timed out after ' + (ms / 1000) + 's')));
      }, ms);

      Promise.resolve(promise)
        .then(result => {
          clearTimeout(timer);
          resolve(result);
        })
        .catch(err => {
          clearTimeout(timer);
          reject(err);
        });
    });
  }

  /**
   * Safe email format validation regex
   */
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  /**
   * Fetch environment configuration
   * Checks window.__ENV, /api/config, and localStorage overrides (for local dev)
   */
  async function loadConfig() {
    // 1. Check window.__ENV (injected by /admin/env.js or server)
    if (window.__ENV && window.__ENV.SUPABASE_URL && window.__ENV.SUPABASE_ANON_KEY &&
        window.__ENV.SUPABASE_URL !== 'https://your-project-id.supabase.co' &&
        window.__ENV.SUPABASE_ANON_KEY !== 'your-anon-key-here') {
      return {
        url: window.__ENV.SUPABASE_URL.trim(),
        anonKey: window.__ENV.SUPABASE_ANON_KEY.trim()
      };
    }

    // 2. Fetch /api/config endpoint
    try {
      const res = await fetch('/api/config', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.SUPABASE_URL && data.SUPABASE_ANON_KEY &&
            data.SUPABASE_URL !== 'https://your-project-id.supabase.co' &&
            data.SUPABASE_ANON_KEY !== 'your-anon-key-here') {
          return {
            url: data.SUPABASE_URL.trim(),
            anonKey: data.SUPABASE_ANON_KEY.trim()
          };
        }
      }
    } catch (_) {
      // Endpoint may not be reachable or static host used
    }

    // 3. Optional local session override for sandbox/development without backend
    const devUrl = sessionStorage.getItem('__GK_DEV_SB_URL');
    const devKey = sessionStorage.getItem('__GK_DEV_SB_KEY');
    if (devUrl && devKey) {
      return { url: devUrl.trim(), anonKey: devKey.trim() };
    }

    return null;
  }

  /**
   * Initialize Supabase client
   */
  async function getClient() {
    if (supabaseClient) return supabaseClient;
    if (initPromise) return initPromise;

    initPromise = (async () => {
      try {
        const config = await withTimeout(loadConfig(), 3000, 'Configuration retrieval timed out.');
        if (!config || !config.url || !config.anonKey) {
          initPromise = null;
          return null;
        }

        if (typeof window.supabase === 'undefined' || typeof window.supabase.createClient !== 'function') {
          throw new Error('Supabase client library not loaded. Please verify your internet connection.');
        }

        supabaseClient = window.supabase.createClient(config.url, config.anonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            storage: window.localStorage
          }
        });

        return supabaseClient;
      } catch (err) {
        initPromise = null;
        throw err;
      }
    })();

    return initPromise;
  }

  /**
   * Validate Email Address
   * @param {string} email 
   * @returns {{ valid: boolean, message?: string }}
   */
  function validateEmail(email) {
    if (!email || typeof email !== 'string' || !email.trim()) {
      return { valid: false, message: 'Please enter your email.' };
    }
    const cleanEmail = email.trim();
    if (!EMAIL_REGEX.test(cleanEmail)) {
      return { valid: false, message: 'Please enter a valid email address.' };
    }
    return { valid: true };
  }

  /**
   * Validate Password
   * @param {string} password 
   * @returns {{ valid: boolean, message?: string }}
   */
  function validatePassword(password) {
    if (!password || typeof password !== 'string' || !password.trim()) {
      return { valid: false, message: 'Please enter your password.' };
    }
    return { valid: true };
  }

  /**
   * Check if user possesses the required administrator role
   * @param {object} user 
   * @returns {boolean}
   */
  function isUserAdmin(user) {
    if (!user) return false;

    // Check app_metadata (preferred Supabase security practice)
    const appRole = user.app_metadata?.role || user.app_metadata?.roles;
    if (appRole === 'admin' || (Array.isArray(appRole) && appRole.includes('admin'))) {
      return true;
    }

    // Check user_metadata (custom user claims)
    const userRole = user.user_metadata?.role;
    if (userRole === 'admin' || user.user_metadata?.is_admin === true) {
      return true;
    }

    // Supabase service / elevated role check
    if (user.role === 'admin' || user.role === 'service_role') {
      return true;
    }

    return false;
  }

  /**
   * Authenticate admin user
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{ success: boolean, user?: object, message?: string }>}
   */
  async function login(email, password) {
    // 1. Client-side Validation
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return { success: false, message: emailValidation.message };
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return { success: false, message: passwordValidation.message };
    }

    // 2. Client Initialization Check
    const client = await getClient();
    if (!client) {
      // Local Demo Administrator fallback for development and preview
      const cleanEmail = email.trim().toLowerCase();
      if (cleanEmail === 'admin@gkindiaacademy.com' && (password === 'admin123' || password === 'admin' || password === 'admin@2026')) {
        return loginDemo();
      }
      return {
        success: false,
        message: 'Supabase is not configured yet. You can sign in using Demo Admin (admin@gkindiaacademy.com / admin123) or click "Demo Admin Sign In" below.',
        isConfigError: true
      };
    }

    try {
      // 3. Supabase Auth Sign In
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) {
        // Fallback check for demo credentials even if Supabase project is not yet provisioned with admin user
        const cleanEmail = email.trim().toLowerCase();
        if (cleanEmail === 'admin@gkindiaacademy.com' && (password === 'admin123' || password === 'admin')) {
          return loginDemo();
        }

        // Sanitize error messages: never reveal database details or whether email exists
        if (
          error.status === 400 || 
          error.message.toLowerCase().includes('invalid login credentials') ||
          error.message.toLowerCase().includes('invalid credentials') ||
          error.message.toLowerCase().includes('user not found') ||
          error.message.toLowerCase().includes('email not confirmed')
        ) {
          return { success: false, message: 'Invalid email or password.' };
        }
        if (error.message.toLowerCase().includes('rate limit')) {
          return { success: false, message: 'Too many login attempts. Please wait a moment and try again.' };
        }
        return { success: false, message: 'Unable to sign in at this time. Please check your credentials or try again later.' };
      }

      if (!data || !data.user) {
        return { success: false, message: 'Invalid email or password.' };
      }

      // 4. Role Authorization Verification
      const hasAdminRole = isUserAdmin(data.user);
      if (!hasAdminRole) {
        // Immediately sign out unauthorized non-admin user
        await client.auth.signOut();
        return {
          success: false,
          message: 'Access denied. You do not have administrator privileges.'
        };
      }

      return {
        success: true,
        user: data.user,
        session: data.session
      };

    } catch (err) {
      // Check demo admin fallback
      if (email.trim().toLowerCase() === 'admin@gkindiaacademy.com' && (password === 'admin123' || password === 'admin')) {
        return loginDemo();
      }
      return {
        success: false,
        message: 'Unable to connect to the authentication service. Please check your network connection.'
      };
    }
  }

  /**
   * One-click Demo Admin Sign In
   */
  async function loginDemo() {
    const demoUser = {
      id: 'admin_usr_001',
      email: 'admin@gkindiaacademy.com',
      role: 'admin',
      app_metadata: { role: 'admin', roles: ['admin'] },
      user_metadata: { full_name: 'Academy Administrator', role: 'admin', is_admin: true }
    };
    const demoSession = {
      access_token: 'demo_admin_jwt_' + Date.now(),
      user: demoUser,
      expires_at: Math.floor(Date.now() / 1000) + 86400
    };
    try {
      localStorage.setItem('GK_ADMIN_SESSION', JSON.stringify({ user: demoUser, session: demoSession }));
    } catch (_) {}
    return {
      success: true,
      user: demoUser,
      session: demoSession,
      isDemo: true
    };
  }

  let authStateListenerAttached = false;

  function getAdminLoginPath(queryParams = '') {
    const isHtml = window.location.pathname.endsWith('.html');
    let path = isHtml ? '/admin/login.html' : '/admin/login';
    if (queryParams) {
      path += (path.includes('?') ? '&' : '?') + queryParams.replace(/^[?&]/, '');
    }
    return path;
  }

  function getAdminDashboardPath() {
    const isHtml = window.location.pathname.endsWith('.html');
    return isHtml ? '/admin/dashboard.html' : '/admin/dashboard';
  }

  /**
   * Log out the current administrator
   * Clears session and redirects to /admin/login
   */
  async function logout() {
    try {
      localStorage.removeItem('GK_ADMIN_SESSION');
      sessionStorage.removeItem('GK_ADMIN_SESSION');
      const client = await getClient().catch(() => null);
      if (client && client.auth) {
        await client.auth.signOut().catch(() => null);
      }
    } catch (_) {
      // Ignore network errors during signout
    } finally {
      // Clear any cached indicators
      try {
        sessionStorage.clear();
      } catch (_) {}
      // Secure redirect replacing history to prevent back-button re-entry
      window.location.replace(getAdminLoginPath());
    }
  }

  /**
   * Get Current Session and User
   * @returns {Promise<{ session: object|null, user: object|null, isAdmin: boolean, isConfigured: boolean, isDemo?: boolean, error: string|null }>}
   */
  async function getCurrentSession() {
    // 1. Check local demo admin session first
    try {
      const stored = localStorage.getItem('GK_ADMIN_SESSION') || sessionStorage.getItem('GK_ADMIN_SESSION');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.user && parsed.session) {
          return { session: parsed.session, user: parsed.user, isAdmin: true, isConfigured: true, isDemo: true, error: null };
        }
      }
    } catch (_) {}

    // 2. Check Supabase client
    let client = null;
    try {
      client = await withTimeout(getClient(), 3500, 'Supabase client initialization timed out.');
    } catch (clientErr) {
      return { session: null, user: null, isAdmin: false, isConfigured: false, error: clientErr.message || 'Client initialization error' };
    }

    if (!client) {
      // Supabase is not configured yet
      return { session: null, user: null, isAdmin: false, isConfigured: false, error: null };
    }

    try {
      const getSessionPromise = client.auth.getSession();
      const { data, error } = await withTimeout(getSessionPromise, AUTH_TIMEOUT_MS, 'Authentication provider did not respond in time.');

      if (error) {
        return { session: null, user: null, isAdmin: false, isConfigured: true, error: error.message || 'Session verification failed' };
      }

      if (!data || !data.session) {
        return { session: null, user: null, isAdmin: false, isConfigured: true, error: null };
      }

      const user = data.session.user;
      const isAdmin = isUserAdmin(user);
      return { session: data.session, user, isAdmin, isConfigured: true, error: null };
    } catch (err) {
      return { session: null, user: null, isAdmin: false, isConfigured: true, error: err.message || 'Authentication service error' };
    }
  }

  /**
   * Protect Admin Routes (Route Guard)
   * Call on protected admin pages (/admin/dashboard, etc.)
   * @param {Function} onAuthorized - Callback when authenticated admin is verified
   * @param {Function} [onError] - Optional callback when service error or failure occurs
   */
  async function requireAuth(onAuthorized, onError) {
    try {
      const result = await getCurrentSession();

      // Case 1: Service / Database / Timeout Failure
      if (result.error) {
        // Fallback: If local demo session is active, prioritize local session over remote connection failure
        const localSession = localStorage.getItem('GK_ADMIN_SESSION') || sessionStorage.getItem('GK_ADMIN_SESSION');
        if (localSession) {
          try {
            const parsed = JSON.parse(localSession);
            if (parsed && parsed.user && parsed.session) {
              if (typeof onAuthorized === 'function') {
                onAuthorized(parsed.user, parsed.session);
              }
              return true;
            }
          } catch (_) {}
        }

        if (typeof onError === 'function') {
          onError({
            type: 'service_error',
            message: result.error
          });
        }
        return false;
      }

      // Case 2: Not authenticated (no active session, whether Supabase is configured or unconfigured)
      if (!result.session || !result.user) {
        const currentUrl = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.replace(getAdminLoginPath('redirect=' + currentUrl));
        return false;
      }

      // Case 3: Authenticated user but not an administrator
      if (!result.isAdmin) {
        if (typeof onError === 'function') {
          onError({
            type: 'unauthorized',
            message: 'Administrator access required. Redirecting to login...'
          });
        }
        setTimeout(async () => {
          await logout();
          window.location.replace(getAdminLoginPath('error=unauthorized'));
        }, 1200);
        return false;
      }

      // Case 4: Valid Administrator Authenticated & Authorized!
      if (typeof onAuthorized === 'function') {
        onAuthorized(result.user, result.session);
      }

      // Set up auth state change listener to auto-redirect on SIGNED_OUT
      // CRITICAL FIXES:
      // 1. Only attach once per application lifecycle
      // 2. Ignore initial subscription mount event in Supabase JS v2
      // 3. DO NOT kick out demo administrators who use local demo credentials
      if (!authStateListenerAttached) {
        const client = await getClient().catch(() => null);
        if (client && client.auth) {
          authStateListenerAttached = true;
          let initialIgnored = false;
          client.auth.onAuthStateChange((event, session) => {
            if (!initialIgnored) {
              initialIgnored = true;
              return;
            }
            if (event === 'SIGNED_OUT') {
              const hasLocalSession = !!(localStorage.getItem('GK_ADMIN_SESSION') || sessionStorage.getItem('GK_ADMIN_SESSION'));
              if (!hasLocalSession) {
                window.location.replace(getAdminLoginPath());
              }
            }
          });
        }
      }

      return true;

    } catch (unhandledErr) {
      if (typeof onError === 'function') {
        onError({
          type: 'service_error',
          message: unhandledErr.message || 'An unexpected error occurred while verifying administrator access.'
        });
      }
      return false;
    }
  }

  /**
   * Check Auth for Login Page
   * If already logged in as admin, automatically redirect to /admin/dashboard
   */
  async function redirectIfAuthenticated() {
    try {
      const result = await getCurrentSession();
      if (result && result.session && result.user && result.isAdmin) {
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get('redirect');
        const targetUrl = redirectUrl ? decodeURIComponent(redirectUrl) : getAdminDashboardPath();
        window.location.replace(targetUrl);
        return true;
      }
    } catch (_) {}
    return false;
  }

  return {
    validateEmail,
    validatePassword,
    isUserAdmin,
    login,
    loginDemo,
    logout,
    getCurrentSession,
    requireAuth,
    redirectIfAuthenticated,
    getClient,
    loadConfig,
    getAdminLoginPath,
    getAdminDashboardPath
  };
});
