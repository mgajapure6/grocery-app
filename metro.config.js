const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname, {
    // Do not disable CSS support when using Tailwind.
    isCSSEnabled: true,
});

// Support for react-native-svg-transformer
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

// Support NativeWind (Tailwind CSS)
// config.transformer.getTransformOptions = async () => ({
//   transform: {
//     experimentalImportSupport: false,
//     inlineRequires: true,
//   },
// });

// Resolver extensions
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg').concat(['html']); // Include HTML assets
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg', 'css', 'cjs']; // Add css for NativeWind, svg, and cjs

// Asset handling
config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];
module.exports = withNativeWind(config,{ input: "./global.css" });