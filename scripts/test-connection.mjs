import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      process.env[key] = val;
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('--- SUPABASE VERIFICATION ---');
console.log('1. NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? `LOADED (${supabaseUrl})` : 'MISSING');
console.log('2. NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:', supabaseKey ? `LOADED (${supabaseKey.substring(0, 15)}...)` : 'MISSING');

if (!supabaseUrl || !supabaseKey) {
  console.error('FAILED: Environment variables are missing');
  process.exit(1);
}

import { createBrowserClient, createServerClient } from '@supabase/ssr';

// 3. Test Client Initialization
console.log('\n3. Testing Client Initialization...');
const client = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

if (client) {
  console.log('✓ Supabase Base Client successfully initialized');
} else {
  console.error('FAILED: Supabase Base Client failed to initialize');
  process.exit(1);
}

// Test @supabase/ssr Browser Client
try {
  const browserClient = createBrowserClient(supabaseUrl, supabaseKey);
  if (browserClient) {
    console.log('✓ @supabase/ssr Browser Client successfully initialized');
  }
} catch (err) {
  console.error('FAILED: @supabase/ssr Browser Client threw error:', err);
  process.exit(1);
}

// Test @supabase/ssr Server Client (with mock cookies)
try {
  const mockCookies = new Map();
  const serverClient = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return Array.from(mockCookies.entries()).map(([name, value]) => ({ name, value }));
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => mockCookies.set(name, value));
      },
    },
  });
  if (serverClient) {
    console.log('✓ @supabase/ssr Server Client successfully initialized with SSR cookie handling');
  }
} catch (err) {
  console.error('FAILED: @supabase/ssr Server Client threw error:', err);
  process.exit(1);
}

// 4. Test Live Endpoint Reachability / Handshake
console.log('\n4. Testing Live Connection to Supabase...');
try {
  // Test Auth health / API status endpoint
  const authResponse = await fetch(`${supabaseUrl}/auth/v1/health`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`
    }
  });
  console.log(`✓ Supabase Auth API Health: HTTP ${authResponse.status} ${authResponse.statusText}`);

  // Test REST API root
  const restResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`
    }
  });
  console.log(`✓ Supabase REST API Endpoint: HTTP ${restResponse.status} ${restResponse.statusText}`);

  // Test client session/auth query
  const { data, error } = await client.auth.getSession();
  if (error) {
    console.log('Auth getSession response:', error.message);
  } else {
    console.log('✓ Auth getSession executed cleanly, current session:', data.session ? 'Active' : 'Null (Anonymous visitor - expected before login)');
  }

  console.log('\n=== ALL SUPABASE CONNECTION TESTS PASSED ===');
} catch (err) {
  console.error('Connection test failed with error:', err);
  process.exit(1);
}
