// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://idvrzbithlfsfdllarhn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkdnJ6Yml0aGxmc2ZkbGxhcmhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MjA3NzQsImV4cCI6MjA1OTA5Njc3NH0.jeSbsF_qDOjlhXAyokAfWjK-W92l4-6x63jyo4CD_38";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);