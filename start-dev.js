const { spawn } = require('child_process');

// Try ports in order: 3000, 3001, 3002, 3003
const ports = [3000, 3001, 3002, 3003];

function tryPort(portIndex = 0) {
  if (portIndex >= ports.length) {
    console.error('No available ports found');
    process.exit(1);
  }

  const port = ports[portIndex];
  console.log(`Trying to start server on port ${port}...`);

  const child = spawn('npm', ['run', 'dev', '--', '--port', port], {
    stdio: 'inherit',
    shell: true
  });

  child.on('error', (error) => {
    console.error(`Error starting on port ${port}:`, error.message);
    tryPort(portIndex + 1);
  });

  child.on('exit', (code) => {
    if (code !== 0) {
      console.log(`Port ${port} failed, trying next port...`);
      tryPort(portIndex + 1);
    }
  });
}

tryPort();
