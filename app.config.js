const fs = require('fs');
const path = require('path');
const base = require('./app.json');
let apiKey = '';
try {
  const secrets = JSON.parse(fs.readFileSync(path.join(__dirname, 'secrets.json'), 'utf8'));
  apiKey = secrets.anthropicApiKey || '';
} catch (e) {
  apiKey = process.env.ANTHROPIC_API_KEY || '';
}
module.exports = () => {
  const cfg = JSON.parse(JSON.stringify(base));
  cfg.expo.extra = { ...(cfg.expo.extra || {}), anthropicApiKey: apiKey };
  return cfg;
};
