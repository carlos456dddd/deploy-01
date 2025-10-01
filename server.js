// server.js  (mismo código de antes, pero ahora lee DATABASE_URL)
require('dotenv').config();   // dotenv ya está instalado DENTRO del contenedor
const http = require('http');
const { Pool } = require('pg'); // pg ya está instalado DENTRO del contenedor
const fs = require('fs');
const path = require('path');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const PORT = process.env.PORT || 8080;

const server = http.createServer(async (req, res) => {
    // CORS para que el navegador permita llamadas desde otro puerto
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

    // Ruta 1: página inicial
    if (req.method === 'GET' && req.url === '/') {
        const filePath = path.join(__dirname, 'public', 'index.html');
        fs.readFile(filePath, (err, data) => {
            if (err) { res.writeHead(500); res.end('Error'); return; }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
        return;
    }

    // Ruta 2: leer contador
    if (req.method === 'GET' && req.url === '/count') {
        const r = await pool.query('SELECT valor FROM contador');
        const count = r.rows[0].valor;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ count }));
        return;
    }

    // Ruta 3: incrementar contador
    if (req.method === 'POST' && req.url === '/count') {
        const r = await pool.query('UPDATE contador SET valor = valor + 1 RETURNING valor');
        const count = r.rows[0].valor;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ count }));
        return;
    }
    // 
    if (req.method === 'POST' && req.url === '/count/pop') {
        const r = await pool.query('UPDATE contador SET valor = valor - 1 RETURNING valor');
        const count = r.rows[0].valor;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ count }));
        return;
    }

    // 
    if (req.method === 'POST' && req.url === '/count/zero') {
        const r = await pool.query('UPDATE contador SET valor = 0 RETURNING valor');
        const count = r.rows[0].valor;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ count }));
        return;
    }


    // 404 resto
    res.writeHead(404);
    res.end('Not found');
});

server.listen(PORT, () => console.log(`Corriendo en puerto ${PORT}`));