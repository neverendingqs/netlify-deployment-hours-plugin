const CronAllowedRange = require('cron-allowed-range');

function getConfigValue({ configName, defaultValue, env, input }) {
  if(env) {
    console.log(`Using '${configName}=${env}' (from environment variable)`);
    return env;
  }

  if(input) {
    console.log(`Using '${configName}=${input}' (from manifest file)`);
    return input;
  }

  console.log(`Using '${configName}=${defaultValue}' (default value)`);
  return defaultValue;
}

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
