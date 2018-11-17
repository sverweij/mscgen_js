module.exports = () => {
    return {
        mode: 'production',
        entry: './src/script/mscgen-interpreter.js',
        output: {
            filename: 'mscgen-interpreter.min.js',
            path: `${__dirname}/build`
        }
    };
};
