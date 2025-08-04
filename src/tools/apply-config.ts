import { Console } from 'console';
import fs from 'fs';

import { parse } from 'ts-command-line-args';

import { ClientConfig, ServerConfig } from '@/layers/Configuration';

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
  let clientConfig: ClientConfig | null = null;

  switch (env) {
    case 'local': {
      const localServerModule = await import('@/config/server.local');
      const localClientModule = await import('@/config/client.local');
      clientConfig = localClientModule.default;
      serverConfig = localServerModule.default;
      break;
    }
    case 'production': {
      const productionServerModule = await import('@/config/server.production');
      const productionClientModule = await import('@/config/client.production');
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
    finalConfig = `SERVER_CONFIG=${JSON.stringify(serverConfig)}`;
  }
  if (clientConfig) {
    finalConfig += `\nNEXT_PUBLIC_CONFIG=${JSON.stringify(clientConfig)}`;
  }

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

