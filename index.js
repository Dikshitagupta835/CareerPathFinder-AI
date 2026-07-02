const { spawn, execSync } = require('child_process');
const path = require('path');

console.log('🚀 Checking and clearing ports 3000 and 5000...');

// Helper to kill processes on a port
function killPort(port) {
  try {
    if (process.platform === 'win32') {
      execSync(`for /f "tokens=5" %a in ('netstat -aon ^| findstr :${port} ^| findstr LISTENING') do taskkill /f /pid %a`, { stdio: 'ignore' });
    } else {
      execSync(`lsof -t -i:${port} | xargs kill -9`, { stdio: 'ignore' });
    }
    console.log(`Cleared port ${port}`);
  } catch (e) {
    // Ignore errors (usually means no process was listening on the port)
  }
}

killPort(3000);
killPort(5000);

console.log('🚀 Starting CareerPathFinder AI full-stack application...');

function runService(name, cwd) {
  const command = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const args = ['run', 'dev'];

  const child = spawn(command, args, {
    cwd,
    stdio: ['ignore', 'inherit', 'inherit'],
    shell: true
  });

  child.on('close', (code) => {
    console.log(`[${name}] process exited with code ${code}`);
  });

  return child;
}

const serverProcess = runService('Backend Server', path.join(__dirname, 'server'));
const clientProcess = runService('Frontend Client', path.join(__dirname, 'client'));

// Clean up child processes when the parent process exits
const cleanup = () => {
  console.log('\nStopping servers...');
  try { serverProcess.kill(); } catch (e) {}
  try { clientProcess.kill(); } catch (e) {}
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
