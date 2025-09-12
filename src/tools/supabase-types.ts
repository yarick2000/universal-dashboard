/**
 * Supabase Types Generation Tool
 * --------------------------------
 * Utility script to interactively generate TypeScript database type definitions
 * from a Supabase project and store them inside the application source tree.
 *
 * Workflow:
 * 1. Prompts the user to authenticate with Supabase CLI (opens browser window).
 * 2. Asks for a Supabase project ID (ref value shown in the Supabase dashboard).
 * 3. Executes `supabase gen types typescript` to produce database types.
 * 4. Persists the generated output to `OUTPUT_PATH` (creating directories if needed).
 *
 * The produced file can be imported across the app to provide strongly typed
 * access to database entities. This script is intended to be run manually when
 * the database schema changes.
 *
 * Usage (from project root):
 *   npx ts-node src/tools/supabase-types.ts
 * or (if compiled) with node:
 *   node dist/src/tools/supabase-types.js
 *
 * Requirements:
 * - Supabase CLI installed (will be invoked via npx)
 * - Network access for authentication and schema retrieval
 *
 * Exits with non‑zero status code on failure so it can be integrated into CI if desired.
 */
import { execSync, spawnSync } from 'child_process';
import { Console } from 'console';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

/**
 * Filesystem path (relative to project root) where generated Supabase database types
 * will be written. Adjust if the layered architecture changes.
 */
const OUTPUT_PATH = './src/layers/Data/types/SupabaseDatabaseTypes.ts';

/** Readline interface for interactive CLI prompts. */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/** Dedicated console instance (explicit to avoid accidental global console mocking). */
const console = new Console({
  stdout: process.stdout,
  stderr: process.stderr,
});

/**
 * Promisified helper around readline.question for cleaner async/await usage.
 * @param query Prompt message shown to the user.
 * @returns Resolves with the raw user input (without trimming).
 */
function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

/**
 * Orchestrates the interactive generation process. Handles authentication, user
 * input collection, invocation of the Supabase CLI, error handling, and resource cleanup.
 */
async function main() {
  try {
    console.log('🚀 Supabase Types Generator');
    console.log('===========================\n');

    // Step 1: Login to Supabase via CLI (opens browser)
    console.log('1. Logging into Supabase...');
    console.log('This will open a browser window for authentication.');

    try {
      spawnSync('npx', ['supabase', 'login'], { stdio: 'inherit' });
      console.log('✅ Successfully logged into Supabase\n');
    } catch (error) {
      console.error('❌ Failed to login to Supabase', error);
      process.exit(1);
    }

    // Step 2: Ask user for the Supabase project ID (project ref).
    const projectId = await question('2. Enter your Supabase project ID: ');

    if (!projectId.trim()) {
      console.error('❌ Project ID is required');
      process.exit(1);
    }

    // Step 3: Generate types via Supabase CLI
    console.log('\n3. Generating TypeScript types...');

    const outputDir = path.dirname(OUTPUT_PATH);

    // Ensure output directory exists (recursive to create nested path structure)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Use shell redirection to capture CLI output into our target file.
    const command = `npx supabase gen types typescript --project-id "${projectId.trim()}" > ${OUTPUT_PATH}`;

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

// Kick off execution; unhandled rejections get logged and cause non‑zero exit.
main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
