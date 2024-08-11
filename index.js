import http from 'http';
import fs from 'fs';
const port = 3000;

const database_dir = './services.json';

function readServices() {
    try {
        const database = fs.readFileSync(database_dir);

        return JSON.parse(database);
    } catch (err) {
        console.error('Error reading services:', err);
    }
}

function writeService(service, weekday) {
    const database = readServices();
    database[weekday].push(service);

    try {
        fs.writeFileSync(
            database_dir,
            JSON.stringify(database, null, 4)
        );
    } catch (error) {
        console.error('Error writing services:', error);
    }
}

const server = http.createServer((req, res) => {
    const hostname = req.headers.host;
    const path = req.url;
    const url = new URL('https://' + hostname + path);
    const queryParams = new URLSearchParams(url.search);

    const name = queryParams.get('name');
    const type = queryParams.get('type');
    const time = queryParams.get('time');
    const phone = queryParams.get('phone');
    const weekday = queryParams.get('weekday');
    const edit = queryParams.get('edit');
    const del = queryParams.get('del');

    if (path === '/services') {
        const database = readServices();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(database, null, 4));
    }

    if (!weekday) {
        res.writeHead(400);
        return res.end('Missing required parameter: weekday');
    }

    if (del) {
        if (!time) {
            res.writeHead(400);
            return res.end('Missing required parameters: time');
        }

        const database = readServices();
        const index = database[weekday].findIndex(
            (service) => service.time === time
        );

        if (index === -1) {
            res.writeHead(404);
            return res.end('Service not found');
        }

        database[weekday].splice(index, 1);
        fs.writeFileSync(
            database_dir,
            JSON.stringify(database, null, 4)
        );

        res.writeHead(200);
        return res.end('Service deleted successfully');
    }

    if (!name || !type || !time || !phone) {
        res.writeHead(400);
        return res.end('Missing required parameters: name, type, time, phone');
    }

    if (edit) {
        const database = readServices();
        const index = database[weekday].findIndex(
            (service) => service.time === time
        );

        if (index === -1) {
            res.writeHead(404);
            return res.end('Service not found');
        }

        database[weekday][index] = {
            name,
            type,
            time,
            phone
        };

        fs.writeFileSync(
            database_dir,
            JSON.stringify(database, null, 4)
        );

        res.writeHead(200);
        return res.end('Service updated successfully');
    }
    
    writeService({
        name,
        type,
        time,
        phone
    }, weekday);

    res.writeHead(201);
    return res.end('Service successfully created!');
});

server.listen(port, () => {
    console.log('Server is running on port 3000');
});