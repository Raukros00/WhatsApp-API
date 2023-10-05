var Service = require('node-windows').Service
var svc = new Service ({
    name: "WhatsApp-API",
    description: "API WhatsApp in Node.JS",
    script: "C:\\Users\\alessandro\\Desktop\\Whatsapp-API\\App.js"
});

svc.on('install', () => {
    svc.start();
});

svc.install();


