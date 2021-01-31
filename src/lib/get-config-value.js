module.exports = function ({ configName, defaultValue, env, input }) {
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
