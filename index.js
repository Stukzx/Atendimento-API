import http from 'http';
import fs from 'fs';
import { parse } from 'url';
const port = 3000;

const databaseDir = './services.json';

function readServices() {
    try {
        const database = fs.readFileSync(databaseDir, 'utf8');
        return JSON.parse(database);
    } catch (err) {
        return [[], [], [], [], []];
    }
}

function writeDatabase(database) {
    try {
        fs.writeFileSync(databaseDir, JSON.stringify(database, null, 4), 'utf8');
    } catch (err) {
        console.error('Error writing services:', err);
    }
}

function addService(service, weekday) {
    const database = readServices();
    database[weekday].push(service);
    writeDatabase(database);
}

function updateService(weekday, time, updatedService) {
    const database = readServices();
    const index = database[weekday].findIndex(
        service => service.time === time
    );

    if (index === -1) {
        const error = new Error();
        error.message = `Service with time ${time} was not found`;
        error.status = 404;
        throw error;
    };

    const selectedService = database[weekday][index];

    database[weekday][index] = {
        name: updatedService.name || selectedService.name,
        type: updatedService.type || selectedService.type,
        time: updatedService.time || selectedService.time,
        phone: updatedService.phone || selectedService.time
    };

    writeDatabase(database);
}

function deleteService(weekday, time) {
    const database = readServices();
    const index = database[weekday].findIndex(
        service => service.time === time
    );

    if (index === -1) {
        const error = new Error();
        error.message = `Service with time ${time} was not found`;
        error.status = 404;
        throw error;
    };

    database[weekday].splice(index, 1);
    writeDatabase(database);
}

const server = http.createServer((req, res) => {
    // Configuração dos cabeçalhos CORS
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.method === 'GET' && req.url === '/services') {
        const database = readServices();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(database, null, 4));
        return;
    }

    if (req.method === 'POST' && req.url === '/services') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const missing = [];

                if (!data.name) missing.push('name');
                if (!data.type) missing.push('type');
                if (!data.time) missing.push('time');
                if (!data.phone) missing.push('phone');
                if (typeof data.weekday !== 'number' || data.weekday < 0 || data.weekday > 5) missing.push('weekday');

                if (missing.length > 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: `Missing the following parameters: ${missing.join(', ')}` }));
                    return;
                }

                addService({
                    name: data.name,
                    type: data.type,
                    time: data.time,
                    phone: data.phone
                }, data.weekday);

                res.writeHead(201, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Service added' }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Erro ao processar JSON', error: error.message }));
            }
        })
    }

    if (req.method === 'PUT') {
        const parsedUrl = parse(req.url, true);
        const path = parsedUrl.pathname;

        const match = path.match(/^\/services\/([^\/]+)\/([^\/]+)$/);

        if (match) {
            const weekday = match[1];
            const time = match[2];

            let body = '';

            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                try {
                    const data = JSON.parse(body);

                    updateService(weekday, time, data);

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        message: `Service updated for ${weekday} at ${time}`
                    }));
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: 'Erro ao processar JSON', error: error.message }));
                }
            });
        }
    }

    if (req.method === 'DELETE') {
        const parsedUrl = parse(req.url, true);
        const path = parsedUrl.pathname;

        const match = path.match(/^\/services\/([^\/]+)\/([^\/]+)$/);

        if (match) {
            const weekday = match[1];
            const time = match[2];

            try {
                deleteService(weekday, time);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: `Service deleted for ${weekday} at ${time}` }));
            } catch (error) {
                res.writeHead(error.status || 500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: error.message }));
            }
        }
    }
});

server.listen(port, () => {
    console.log('Server is running on port 3000');
});