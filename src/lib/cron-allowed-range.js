const CronAllowedRange = require('cron-allowed-range');

module.exports = function (...args) {
  return new CronAllowedRange(...args);
}
