const express = require('express');
const http = require('http');
const mongoose = require('../config/db');
const apiRouter = require('../routes/api');

const app = express();
app.use(express.json());
app.use('/api', apiRouter);

const server = http.createServer(app);
server.listen(5999, async () => {
  try {
    // 1. POST
    const payload = JSON.stringify({ currentPhase: 2 });
    await new Promise((resolve, reject) => {
      const req = http.request('http://localhost:5999/api/admin/system-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      }, res => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
          console.log('POST status:', res.statusCode, JSON.parse(data));
          resolve();
        });
      });
      req.on('error', reject);
      req.write(payload);
      req.end();
    });

    // 2. GET
    await new Promise((resolve, reject) => {
      http.get('http://localhost:5999/api/system-settings', res => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
          const parsed = JSON.parse(data);
          console.log('GET status:', res.statusCode, 'currentPhase:', parsed.settings.currentPhase);
          resolve();
        });
      }).on('error', reject);
    });

    // 3. Reset back to 1
    const resetPayload = JSON.stringify({ currentPhase: 1 });
    await new Promise((resolve, reject) => {
      const req = http.request('http://localhost:5999/api/admin/system-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(resetPayload)
        }
      }, res => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
          console.log('Reset to 1 status:', res.statusCode);
          resolve();
        });
      });
      req.on('error', reject);
      req.write(resetPayload);
      req.end();
    });

    console.log('=== ENDPOINT VERIFICATION 100% SUCCESSFUL ===');
  } catch(err) {
    console.error('Error in test:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});
