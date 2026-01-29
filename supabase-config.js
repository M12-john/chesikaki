// Supabase Configuration for Chesikaki Farmers Portal

// Supabase client configuration
const SUPABASE_URL = 'https://ympgauiigupqhfrvumpn.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltcGdhdWlpZ3VwcWhmcnZ1bXBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MDc0ODgsImV4cCI6MjA4NTE4MzQ4OH0.uym2qU5HdlPzMVRNgRCexga0oMmHXOat8k_RY-fu668';

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Export for use in other files
export { supabase };

console.log('🔥 Supabase initialized successfully!');