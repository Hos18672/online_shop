import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://teucttndugrjbuxejjpd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRldWN0dG5kdWdyamJ1eGVqanBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NDIwMTEsImV4cCI6MjA2ODUxODAxMX0.Hmp1vQWLnHFu12UbE8avKfG8uAwz58Qmz4J6zEKuNrQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
