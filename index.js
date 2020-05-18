const CronAllowedRange = require('cron-allowed-range');

module.exports = function(config) {
  return {
    name: 'deployment-hours',
    onInit: ({ utils }) => {
      const expression = process.env.DEPLOYMENT_HOURS_EXPRESSION || '* * * * *';
      const timezone = process.env.DEPLOYMENT_HOURS_TIMEZONE || 'America/Toronto';

      const cr = new CronAllowedRange(expression, timezone);
      const now = new Date();

      console.log(`Current time: '${now}'. Expression: '${expression}'. Timezone: '${timezone}'.`);

      if(!cr.isDateAllowed(now)) {
        utils.build.cancelBuild('Deployment not allowed at this time.');
      }
    }
  }
};
