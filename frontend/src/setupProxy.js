const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api/pvws',
        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true,
            ws: true, // Enables WebSocket support
            pathRewrite: { '^/api/pvws': '/pvws/pv' }
        })
    );

    app.use(
        '/api/qserver',
        createProxyMiddleware({
            target: 'http://localhost:60610',
            changeOrigin: true,
            pathRewrite: { '^/api/server': '' }
        })
    );

    app.use(
        '/api/camera',
        createProxyMiddleware({
            target: 'http://localhost:8000',
            changeOrigin: true,
            ws: true, // Enables WebSocket support
            pathRewrite: { '^/api/camera': '/pvws/pv' }
        })
    );

    app.use(
        '/queue_server',
        createProxyMiddleware({
            target: 'ws://localhost:8000',
            changeOrigin: true,
            ws: true, // Enables WebSocket support
        })
    );
};

// setupProxy.js
/* const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    // Create proxy instances for WebSocket-enabled routes
    const pvwsProxy = createProxyMiddleware('/api/pvws', {
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: true,
        pathRewrite: { '^/api/pvws': '/pwvs/pv' }
    });

    const cameraProxy = createProxyMiddleware('/api/camera', {
        target: 'http://localhost:8000',
        changeOrigin: true,
        ws: true,
        pathRewrite: { '^/api/camera': '/pvws/pv' }
    });

    const qsConsoleProxy = createProxyMiddleware('/api/qsConsole', {
        target: 'http://localhost:8000',
        changeOrigin: true,
        ws: true,
        pathRewrite: { '^/api/qsConsole': '/queue_server' }
    });

    // Use proxies in Express app for HTTP routes
    app.use('/api/pvws', pvwsProxy);
    app.use('/api/camera', cameraProxy);
    app.use('/api/qsConsole', qsConsoleProxy);

    // Upgrade handling: Add 'upgrade' event listeners for WebSocket connections
    app.server.on('upgrade', (req, socket, head) => {
        if (req.url.startsWith('/api/pvws')) {
            pvwsProxy.upgrade(req, socket, head);
        } else if (req.url.startsWith('/api/camera')) {
            cameraProxy.upgrade(req, socket, head);
        } else if (req.url.startsWith('/api/qsConsole')) {
            qsConsoleProxy.upgrade(req, socket, head);
        }
    });
}; */
