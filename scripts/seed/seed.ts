import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Need service role for admin bypass

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase URL or Service Role Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function runSeed() {
  console.log('🌱 Starting FixIt Database Seed...');

  try {
    // 1. Read mock data
    const dataPath = path.resolve(__dirname, 'mock-data.json');
    const mockData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // 2. Insert Users (Auth & Profiles)
    console.log('👤 Seeding Users & Profiles...');
    const userMap = new Map(); // Store created user UUIDs

    for (const user of mockData.users) {
      // Create user in Auth (Admin API)
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: 'Password123!',
        email_confirm: true,
        user_metadata: { full_name: user.full_name }
      });

      if (authError) {
        if (authError.message.includes('already exists')) {
          console.log(`⚠️ User ${user.email} already exists, skipping auth creation.`);
        } else {
          throw authError;
        }
      } else if (authData.user) {
        userMap.set(user.id, authData.user.id);
        
        // Profiles are usually created via trigger, but we'll update them with seed data
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            role: user.role,
            department: user.department,
            reputation_score: user.reputation_score
          })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;
      }
    }

    // 3. Insert Reports
    console.log('📝 Seeding Reports...');
    
    // We need actual UUIDs for foreign keys. If we just created them, we have them in userMap.
    // If they already existed, we would need to fetch them. For a fresh seed, userMap is fine.
    
    if (userMap.size > 0) {
      const reportsToInsert = mockData.reports.map((report: any) => ({
        title: report.title,
        description: report.description,
        category: report.category,
        latitude: report.latitude,
        longitude: report.longitude,
        urgency_score: report.urgency_score,
        status: report.status,
        confirmations: report.confirmations,
        image_url: report.image_url,
        // Map the mock author_index to the newly created UUIDs
        author_id: Array.from(userMap.values())[report.author_index]
      }));

      const { error: reportsError } = await supabase
        .from('reports')
        .insert(reportsToInsert);

      if (reportsError) throw reportsError;
      console.log(`✅ Successfully inserted ${reportsToInsert.length} reports.`);
    } else {
      console.log('⚠️ No new users were created, skipping report insertion to avoid foreign key errors.');
    }

    console.log('🎉 Seed complete! Your Bangalore mock data is ready.');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

runSeed();
