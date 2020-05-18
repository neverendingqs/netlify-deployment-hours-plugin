const CronAllowedRange = require('cron-allowed-range');

module.exports = {
    onPreBuild: ({ utils, inputs }) => {
      const expression = inputs.env || process.env.DEPLOYMENT_HOURS_EXPRESSION || '* * * * *';
      const timezone = inputs.env || process.env.DEPLOYMENT_HOURS_TIMEZONE || 'America/Toronto';

      const cr = getCronAllowedRange(expression, timezone, utils);
      const now = new Date();

      console.log(`Current time: '${now}'. Expression: '${expression}'. Timezone: '${timezone}'.`);

      if(!cr.isDateAllowed(now)) {
        utils.build.cancelBuild('Deployment not allowed at this time.');
      }
    }
};

const getCronAllowedRange = function(expression, timezone, utils) {
  try {
    return new CronAllowedRange(expression, timezone);
  } catch (error) {
    utils.build.failPlugin('Invalid Cron expression or timezone', { error })
  }
};
