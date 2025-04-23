const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Support for react-native-svg-transformer
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

// Support HTML assets for WebView
config.resolver.assetExts = [...config.resolver.assetExts, 'html'];

// Asset handling
config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];

// Support CommonJS modules
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];

module.exports = config;