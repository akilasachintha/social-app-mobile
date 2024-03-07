module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        env: {
            production: {
                plugins: ['react-native-paper/babel'],
            },
        },
        plugins: [
            ['module-resolver', {
                root: ['./src'],
                alias: {
                    '@components': './src/components',
                    '@screens': './src/screens',
                    '@navigations': './src/navigations',
                    '@utils': './src/utils',
                    '@assets': './src/assets',
                    '@constants': './src/constants',
                    '@services': './src/services',
                    '@redux': './src/redux',
                    '@slices': './src/redux/slices',
                    '@hooks': './src/hooks',
                    '@interfaces': './src/interfaces',
                    '@context': './src/context',
                    '@config': './src/config',
                    '@db': './src/db',
                },
            }],
            ['react-native-reanimated/plugin'],
        ],
    };
};
