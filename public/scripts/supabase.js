// SUPABASE INIT

const SUPABASE_URL = "https://ysgebcbptgjlpbgnlcjt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzZ2ViY2JwdGdqbHBiZ25sY2p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5OTMzNTUsImV4cCI6MjA4NTU2OTM1NX0.R-M89T_wNR-JvY2wtFRl4BDau63kl5Ko_8yYLSngB2M";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
