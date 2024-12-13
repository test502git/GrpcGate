module.exports = {
    mode: 'development',
    entry: './static/client.js',
    output: {
        filename: 'bundle.js',
        path: __dirname + '/static/dist'
    },
    resolve: {
        modules: [__dirname, 'node_modules']
    }
};
