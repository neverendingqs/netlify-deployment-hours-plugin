[![CircleCI](https://circleci.com/gh/neverendingqs/netlify-deployment-hours-plugin.svg?style=svg)](https://circleci.com/gh/neverendingqs/netlify-deployment-hours-plugin)
[![npm
version](https://badge.fury.io/js/netlify-deployment-hours-plugin.svg)](https://badge.fury.io/js/netlify-deployment-hours-plugin)

# netlify-deployment-hours-plugin

A Netlify build plugin that blocks deployment if it is outside of deployment
hours.

## Usage

To install, add the following lines to your `netlify.toml` file:

```toml
[[plugins]]
package = "netlify-deployment-hours-plugin"
```

Note: The `[[plugins]]` line is required for each plugin, even if you have other
plugins in your `netlify.toml` file already.

There are two `inputs` used to configure this plugin:

```toml
[[plugins]]
package = "netlify-deployment-hours-plugin"

  [plugins.inputs]
  # A cron-like expression that expresses when a deployment can occur
  expression = "* * * * *"
  # tz database value that expresses the timezone of the expression
  timezone = "America/Toronto"
```

Both are passed into
[cron-allowed-range](https://github.com/neverendingqs/cron-allowed-range) to
determine if a deployment should proceed. See the [`cron-allowed-range`
documentation](https://github.com/neverendingqs/cron-allowed-range) for more
details on how to form the cron-like expression.

The `inputs` can be overridden with environment variables for scenarios where
emergency deploys were required outside of regular deployment hours:

```
* `DEPLOYMENT_HOURS_EXPRESSION`
* `DEPLOYMENT_HOURS_TIMEZONE`
```
