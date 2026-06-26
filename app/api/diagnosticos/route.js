import { NextResponse } from 'next/server';
import { exec } from 'child_process';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const checkType = searchParams.get('check') || 'all';

  const results = {};

  if (checkType === 'db' || checkType === 'all') {
    results.database = await new Promise((resolve) => {
      // Execute a quick select command to verify postgres is up and credentials work
      exec('PGPASSWORD=postgres psql -h localhost -U postgres -d medusadb -c "SELECT 1;"', (err, stdout, stderr) => {
        if (err) {
          resolve({ 
            success: false, 
            status: 'Offline / Error', 
            message: stderr.trim() || err.message 
          });
        } else {
          resolve({ 
            success: true, 
            status: 'Online', 
            message: 'Conexión a PostgreSQL (medusadb) exitosa y activa.' 
          });
        }
      });
    });
  }

  if (checkType === 'logs' || checkType === 'all') {
    results.logs = await new Promise((resolve) => {
      // Query the user's systemd log history for idarthur.service
      exec('journalctl --user -u idarthur.service -n 40 --no-pager', (err, stdout, stderr) => {
        if (err) {
          resolve({ 
            success: false, 
            message: 'No se pudo leer el registro de logs mediante systemd: ' + (stderr.trim() || err.message) 
          });
        } else {
          // Filter logs to remove empty lines and return them
          const lines = stdout.split('\n')
            .filter(Boolean)
            .map(line => line.substring(line.indexOf('paicita-'))); // Remove system prefix for cleaner output
          resolve({ 
            success: true, 
            lines: lines 
          });
        }
      });
    });
  }

  return NextResponse.json({ success: true, results });
}
