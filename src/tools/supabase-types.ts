import { execSync, spawnSync } from 'child_process';
import { Console } from 'console';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const OUTPUT_PATH = './src/layers/Data/types/SupabaseDatabaseTypes.ts';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const console = new Console({
  stdout: process.stdout,
  stderr: process.stderr,
});

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  try {
    console.log('🚀 Supabase Types Generator');
    console.log('===========================\n');

    // Step 1: Login to Supabase
    console.log('1. Logging into Supabase...');
    console.log('This will open a browser window for authentication.');

    try {
      spawnSync('npx', ['supabase', 'login'], { stdio: 'inherit' });
      console.log('✅ Successfully logged into Supabase\n');
    } catch (error) {
      console.error('❌ Failed to login to Supabase', error);
      process.exit(1);
    }

    // Step 2: Get project ID from user
    const projectId = await question('2. Enter your Supabase project ID: ');

    if (!projectId.trim()) {
      console.error('❌ Project ID is required');
      process.exit(1);
    }

    // Step 3: Generate types
    console.log('\n3. Generating TypeScript types...');

    const outputDir = path.dirname(OUTPUT_PATH);

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const command = `npx supabase gen types typescript --project-id "${projectId.trim()}" > ` +
      OUTPUT_PATH;

    try {
      execSync(command, { stdio: 'pipe' });
      console.log('✅ TypeScript types generated successfully!');
      console.log(`📁 Output: ${OUTPUT_PATH}`);
    } catch (error) {
      console.error('❌ Failed to generate types');
      console.error(error);
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ An error occurred:', error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Execute the main function
main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
