const path = require('path')

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    output: {
        filename: 'index.umd.js',
        path: path.resolve(__dirname, 'built'),
        library: "extSms",
        libraryTarget: "umd"
    }
}