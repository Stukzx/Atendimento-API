import { parse } from 'url';
import { addService, deleteService, readServices, updateService } from './../controllers/services.js';

export function GETServices(req, res) {
    const database = readServices();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(database, null, 4));
}

export function POSTServices(req, res) {
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
            if (typeof data.weekday !== 'number') missing.push('weekday');

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
            res.end(JSON.stringify({ message: 'Service added' }));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Erro ao processar JSON', error: error.message }));
        }
    })
}

export function PUTServices(req, res) {
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

export function DELETEServices(req, res) {
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