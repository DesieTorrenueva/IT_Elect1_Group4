const { getDefaultConfig } = require("expo/metro-config");

// Use async pattern and safe resolver so Node won't throw if a specific subpath
// cannot be resolved on some environments. Falls back to package name when
// require.resolve fails.
function safeResolve(name) {
  try {
    return require.resolve(name);
  } catch (e) {
    return name;
  }
}


const config = getDefaultConfig(__dirname);

config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    "firebase": safeResolve("firebase"),
    "firebase/app": safeResolve("firebase/app"),
    "firebase/auth": safeResolve("firebase/auth"),
    "firebase/firestore": safeResolve("firebase/firestore"),
    "firebase/storage": safeResolve("firebase/storage"),
  },
};

module.exports = config;
