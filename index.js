const CronAllowedRange = require('cron-allowed-range');

module.exports = {
  name: 'deployment-hours',
  init: () => {
    const expression = process.env.DEPLOYMENT_HOURS_EXPRESSION || '* * * * *';
    const timezone = process.env.DEPLOYMENT_HOURS_TIMEZONE || 'America/Toronto';

    const cr = new CronAllowedRange(expression, timezone);
    const now = new Date();

    console.log(`Current time: '${now}'. Expression: ${expression}. Timezone: ${timezone}.`);

    if(!cr.isDateAllowed(now)) {
      throw new Error('Deployment not allowed at this time.');
    }
  }
};
