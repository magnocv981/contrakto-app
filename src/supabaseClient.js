// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pfmeoerycefpdwzwvdrk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmbWVvZXJ5Y2VmcGR3end2ZHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3NjY1MzYsImV4cCI6MjA2NzM0MjUzNn0.HCUY1UVEwBspYfReY_eQYrLc_SxQdbPM-YlT-wC8c-o'
export const supabase = createClient(supabaseUrl, supabaseKey);
