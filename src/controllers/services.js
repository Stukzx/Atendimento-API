import fs from 'fs';
import 'dotenv/config';

export function readServices() {
    try {
        const database = fs.readFileSync(process.env.DATABASE_DIR, 'utf8');
        return JSON.parse(database);
    } catch (err) {
        return [[], [], [], [], []];
    }
}

export function writeDatabase(database) {
    try {
        fs.writeFileSync(process.env.DATABASE_DIR, JSON.stringify(database, null, 4), 'utf8');
    } catch (err) {
        console.error('Error writing services:', err);
    }
}

export function addService(service, weekday) {
    const database = readServices();
    database[weekday].push(service);
    writeDatabase(database);
}

export function updateService(weekday, time, updatedService) {
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

export function deleteService(weekday, time) {
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