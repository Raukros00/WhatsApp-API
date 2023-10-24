var Service = require('node-windows').Service
var svc = new Service ({
    name: "WhatsApp-API",
    description: "API WhatsApp in Node.JS",
    script: "E:\\WEB\\WhatsApp-API\\App.js"
});

svc.on('install', () => {
    svc.start();
});

svc.install();


