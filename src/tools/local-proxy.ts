import { execSync } from 'child_process';
import { Console } from 'console';
import { existsSync } from 'fs';

let domain: string = 'universal-dashboard.local';

const console = new Console({
  stdout: process.stdout,
  stderr: process.stderr,
});

if (process.argv.length > 3) {
  console.error('Expected one or no arguments');
  process.exit(1);
}

if (process.argv.length === 3) {
  // get the original config name
  domain = process.argv[2];
  const keyPath = `./certs/${domain}-key.pem`;
  if (!existsSync(keyPath)) {
    executeCommand(
      `mkcert create-cert --cert ./certs/${domain}.pem --key ${keyPath} --domain ${domain}`,
    );
  }
}

executeCommand(
  `npx local-ssl-proxy --key ./certs/${domain}-key.pem --cert ./certs/${domain}.pem ` +
  '--source 443 --target 3000',
);

function executeCommand(command: string): void {
  console.log(`executing command: ${command}`);
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error('Command failed:', error);
  }
}
