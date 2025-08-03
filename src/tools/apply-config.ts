import { Console } from 'console';
import fs from 'fs';

import { parse } from 'ts-command-line-args';

import { ServerConfig } from '@/layers/Configuration';

interface CommandLineOptions {
  source: string;
  target: string;
  help?: boolean;
};

const console = new Console({
  stdout: process.stdout,
  stderr: process.stderr,
});

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
  const env = options.source;
  const target = options.target;

  let serverConfig: ServerConfig | null = null;

  switch (env) {
  case 'local': {
    const localModule = await import('@/config/server.local');
    serverConfig = localModule.default;
    break;
  }
  case 'production': {
    const productionModule = await import('@/config/server.production');
    serverConfig = productionModule.default;
    break;
  }
  default:
    console.error(`Unsupported environment: ${env}`);
    process.exit(1);
  }

  const finalConfig = `SERVER_CONFIG=${JSON.stringify(serverConfig)}`;

  try {
    // Write the final configuration to the target file
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

