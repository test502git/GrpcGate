const path = require('path');

module.exports = {
    mode: 'development',
    entry: './static/client.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'static/dist')
    },
    resolve: {
        extensions: ['.js']
    }
};
