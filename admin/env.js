// admin/env.js - Default environment configuration loader
// When served via server.ps1 or backend server, this endpoint is dynamically generated from .env.
// In static preview environments, window.__ENV is initialized safely here.
window.__ENV = window.__ENV || {
  SUPABASE_URL: '',
  SUPABASE_ANON_KEY: ''
};
