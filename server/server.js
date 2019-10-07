const http = require('http');
const config = require('./src/config');

require('./src/app')().then(app => {
    const server = http.createServer(app);

    server.listen(config.port, () => {
        console.log(`> server started on port ${config.port}`);
    });
}).catch((error) => {
    console.error(error);
})