const http = require('http');
const fs = require('fs');
const process = require('process');

const options = {
    hostname: 'localhost',
    port: 9090,
    path: '/no-existing-path',
    method: 'GET'
};

const buf = fs.readFileSync('.github/PULL_REQUEST_TEMPLATE.md').toString();

const req = http.request(options, res => {
    if (res.statusCode !== 404) {
        console.error(`expected 404, got ${res.statusCode}`);
        process.exit(1);
        return;
    }

    if (res.headers['content-length'] !== buf.length.toString()) {
        console.error(`expected ${buf.length}, got ${res.headers['content-length']}`);
        process.exit(1);
        return;
    }

    let allTheData = "";

    res.on('data', d => {
        allTheData += d.toString();
    });

    res.on('end', () => {
        if (allTheData !== buf) {
            console.error(`expected ${buf}, but got ${allTheData}`);
            process.exit(1);
            return;
        }
    });
})

req.on('error', error => {
    console.error(error);
    process.exit(1);
    return;
});

req.end();