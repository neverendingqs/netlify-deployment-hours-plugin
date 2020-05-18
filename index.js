const CronAllowedRange = require('cron-allowed-range');

module.exports = function(config) {
  return {
    name: 'deployment-hours',
    onInit: ({ utils, inputs: { expression, timezone } }) => {
      const cr = new CronAllowedRange(expression, timezone);
      const now = new Date();

      console.log(`Current time: '${now}'. Expression: '${expression}'. Timezone: '${timezone}'.`);

      if(!cr.isDateAllowed(now)) {
        utils.build.failBuild('Deployment not allowed at this time.');
      }
    }
  }
};
