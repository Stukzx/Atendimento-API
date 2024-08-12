import http from 'http';
import 'dotenv/config';
import { DELETEServices, GETServices, POSTServices, PUTServices } from './src/routes/services.js';
 
const server = http.createServer((req, res) => {
    // Configuração dos cabeçalhos CORS
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.url === '/') {
        return res.end('Hello, World!');
    }

    if (req.method === 'GET' && req.url === '/services') {
        return GETServices(req, res);
    }

    if (req.method === 'POST' && req.url === '/services') {
       return POSTServices(req, res);
    }

    if (req.method === 'PUT') {
        return PUTServices(req, res);
    }

    if (req.method === 'DELETE') {
        return DELETEServices(req, res);
    }
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});