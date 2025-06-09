export default {
  // ... andere Einstellungen ...
  transformIgnorePatterns: [
    "/node_modules/(?!node-fetch).+\\.js$"
  ],
  // eventuell benötigst du den ESM-Transformer
  transform: {
    "^.+\\.js$": "babel-jest"
  },
};
