const createCronAllowedRange = require('./lib/cron-allowed-range');
const getConfigValue = require('./lib/get-config-value');

module.exports = {
  onPreBuild: ({ utils, inputs }) => {
    const expression = getConfigValue({
      configName: 'expression',
      defaultValue: '* * * * *',
      env: process.env.DEPLOYMENT_HOURS_EXPRESSION,
      input: inputs.expression
    });

    const timezone = getConfigValue({
      configName: 'timezone',
      defaultValue: 'America/Toronto',
      env: process.env.DEPLOYMENT_HOURS_TIMEZONE,
      input: inputs.timezone
    });

    let cr;
    try {
      cr = createCronAllowedRange(expression, timezone);
    } catch (error) {
      utils.build.failPlugin('Invalid Cron expression or timezone', { error });
      return;
    }

    const now = new Date();

    console.log(`Current time: '${now}'. Expression: '${expression}'. Timezone: '${timezone}'.`);

    if(!cr.isDateAllowed(now)) {
      utils.build.cancelBuild('Deployment not allowed at this time.');
    }
  }
};
