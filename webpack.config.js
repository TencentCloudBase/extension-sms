const path = require('path')
const pkgJson = require('./package.json')

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
        filename: 'extension-sms.js',
        path: path.resolve(__dirname, 'built', pkgJson.version),
        library: "extSms",
        libraryTarget: "umd"
    }
}