module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Temporairement désactivé pour debug
      // 'react-native-reanimated/plugin',
    ],
  };
};
