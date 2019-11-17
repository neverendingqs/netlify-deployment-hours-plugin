# netlify-deployment-hours-plugin

A Netlify build plugin that blocks deployment if it outside of deployment hours.

## Usage

Run

```sh
npm i -D netlify-deployment-hours-plugin
```

Then add the following to your `netlify.yml` file:

```yml
plugins:
  - type: netlify-deployment-hours-plugin
```

There are two environment variable used to configure this plugin:

* `DEPLOYMENT_HOURS_EXPRESSION`
  * A cron-like expression that expresses when a deployment can occur
* `DEPLOYMENT_HOURS_TIMEZONE`
  * tz database value that expresses the timezone of the expression

Both are passed into
[cron-allowed-range](https://github.com/neverendingqs/cron-allowed-range) to
determine if a deployment should proceed. See the [`cron-allowed-range`
documentation](https://github.com/neverendingqs/cron-allowed-range) for more
details on how to form the cron-like expression.
