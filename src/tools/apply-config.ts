/**
 * apply-config.ts
 * ----------------------------------------------------
 * Purpose:
 *   Builds a consolidated runtime configuration by importing the appropriate
 *   server + client configuration modules for a specified environment and
 *   writing the result into a `.env.<target>.local` file.
 *
 * Why this script exists:
 *   - Centralizes environment‑specific configuration assembly.
 *   - Allows missing "local" config files without failing production builds.
 *   - Serializes structured config objects into environment variables so that
 *     both Next.js server and client layers can consume them at runtime.
 *
 * Generated Output:
 *   .env.<target>.local  (e.g. `.env.development.local`, `.env.production.local`)
 *     Contains:
 *       - Individual key=value lines for any declared envVariables in configs.
 *       - SERVER_CONFIG=<json>   (if server config present, minus envVariables)
 *       - NEXT_PUBLIC_CONFIG=<json> (if client config present, minus envVariables)
 *
 * CLI Usage Examples:
 *   node ./src/tools/apply-config.js --source local --target development
 *   node ./src/tools/apply-config.js -s production -t production
 *   node ./src/tools/apply-config.js --help
 *
 * Flags:
 *   -s, --source  Environment to load (local | production)
 *   -t, --target  Target environment file name segment (e.g. development, production)
 *   -h, --help    Display help and exit
 *
 * Exit Codes:
 *   0 Success / help displayed
 *   1 CLI parsing failure / unsupported environment / write failure
 *
 * Future Enhancements (non-breaking ideas):
 *   - Add a --dry-run flag to print without writing.
 *   - Add schema validation (e.g. zod) before serialization.
 *   - Add watch mode for local development.
 */

import { Console } from 'console';
import fs from 'fs';

import { parse } from 'ts-command-line-args';

import { ClientConfig, ServerConfig } from '@/layers/Configuration';

/**
 * Command line arguments accepted by this script.
 */
interface CommandLineOptions {
  /** Environment source identifier (e.g. 'local', 'production'). */
  source: string;
  /** Target environment file segment (used in `.env.<target>.local`). */
  target: string;
  /** Print help and exit. */
  help?: boolean;
};

const console = new Console({
  stdout: process.stdout,
  stderr: process.stderr,
});

/**
 * Attempts a dynamic ESM import and returns a fallback value if the module
 * is not found. Re-throws any other type of error to avoid masking issues.
 *
 * This primarily supports the "local" configuration which may not exist in
 * production deployment artifacts.
 */
async function safeImport<T>(path: string, fallback: T): Promise<T> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return (await import(path)).default;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (err.code === 'MODULE_NOT_FOUND') return fallback;
    throw err;
  }
}

/**
 * Serializes a key/value object of environment variables into newline-separated
 * entries ready for inclusion in an .env file.
 */
function parseEnvVariable(envVariables?: Record<string, string>): string {
  if (!envVariables) return '';

  return Object.entries(envVariables)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
}

/**
 * Orchestrates CLI parsing, configuration module resolution, aggregation, and
 * final .env file emission.
 */
async function main() {
  const argsDefinitions = {
    source: { type: String, alias: 's', description: 'Source directory to apply the configuration' },
    target: { type: String, alias: 't', description: 'Target directory for the configuration' },
    help: { type: Boolean, alias: 'h', description: 'Display this help message', optional: true },
  } as const;

  let options: CommandLineOptions;
  try {
    // parse command line arguments
    options = parse<CommandLineOptions>(argsDefinitions, {
      stopAtFirstUnknown: true,
      partial: true,
      helpArg: 'help',
    });
    if (options.help) {
      process.exit(0);
    }
  } catch (error) {
    console.error('Error parsing command line arguments:', error);
    process.exit(1);
  }
  const env = options.source; // Which configuration set to load
  const target = options.target; // Which .env.<target>.local file to produce

  let serverConfig: ServerConfig | null = null;
  let clientConfig: ClientConfig | null = null;

  switch (env) {
    // local config is not deployed to production,
    // so we need to prevent build from failure by
    // wrapping imports in try-catch blocks
    case 'local': {
      serverConfig = await safeImport<ServerConfig | null>('../config/server.local', null);
      clientConfig = await safeImport<ClientConfig | null>('../config/client.local', null);
      break;
    }
    case 'production': {
      const productionServerModule = await import('../config/server.production');
      const productionClientModule = await import('../config/client.production');
      clientConfig = productionClientModule.default;
      serverConfig = productionServerModule.default;
      break;
    }
    default:
      console.error(`Unsupported environment: ${env}`);
      process.exit(1);
  }
  let finalConfig: string = '';
  if (serverConfig) {
    const {envVariables, ...serverConfigWithoutEnv} = serverConfig;
    finalConfig += parseEnvVariable(envVariables);
    finalConfig += `\nSERVER_CONFIG=${JSON.stringify(serverConfigWithoutEnv)}`;
  }
  if (clientConfig) {
    const {envVariables, ...clientConfigWithoutEnv} = clientConfig;
    finalConfig += parseEnvVariable(envVariables);
    finalConfig += `\nNEXT_PUBLIC_CONFIG=${JSON.stringify(clientConfigWithoutEnv)}`;
  }

  try {
  // Persist the assembled configuration.
    fs.writeFileSync(`.env.${target}.local`, finalConfig);
  } catch (error) {
    console.error('Error writing final configuration:', error);
    process.exit(1);
  }
}

// Execute the main function
main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});

