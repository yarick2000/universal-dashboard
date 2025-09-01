import { Console } from 'console';
import fs from 'fs';
import path from 'path';

import esbuild from 'esbuild';
import { parse } from 'ts-command-line-args';

interface CommandLineOptions {
  minimize: boolean;
  sourcemap: boolean;
  help?: boolean;
};

const console = new Console({
  stdout: process.stdout,
  stderr: process.stderr,
});

async function main() {
  const argsDefinitions = {
    minimize: { type: Boolean, alias: 'm', description: 'Minimize the output' },
    sourcemap: { type: Boolean, alias: 's', description: 'Generate sourcemaps' },
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

  const srcWorkersDir = path.join(__dirname, '../workers');
  const outputDir = path.join(__dirname, '../../public/workers');

  // Find all worker entry points
  const workerDirs = fs.readdirSync(srcWorkersDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  // Build each worker as a separate bundle
  try {
    await Promise.all(
      workerDirs.map(workerName => {
        const entryPoint = path.join(srcWorkersDir, workerName, 'index.ts');
        const outfile = path.join(outputDir, `${workerName}.js`);

        return esbuild.build({
          entryPoints: [entryPoint],
          bundle: true,
          outfile: outfile,
          format: 'iife', // Immediately Invoked Function Expression for web workers
          target: 'es2022',
          minify: options.minimize, // Set to true for production
          sourcemap: options.sourcemap,
          platform: 'browser',
          define: {
            'process.env.NODE_ENV': '"production"',
          },
        });
      }),
    );
    console.log('Workers built successfully!');
  } catch (error) {
    console.error('Build failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Execute the main function
main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
