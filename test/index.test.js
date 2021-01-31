
const chai = require('chai');
const proxyquire =  require('proxyquire');
const sinon = require('sinon');

const expect = chai.expect;
chai.use(require('sinon-chai'));

describe('index', function() {
  before(function() {
    // crude workaround for https://github.com/sinonjs/sinon/issues/1720
    process.env.DEPLOYMENT_HOURS_EXPRESSION = process.env.DEPLOYMENT_HOURS_EXPRESSION || '';
    process.env.DEPLOYMENT_HOURS_TIMEZONE = process.env.DEPLOYMENT_HOURS_TIMEZONE || '';
  });

  beforeEach(function() {
    this.sandbox = sinon.createSandbox();
  });

  afterEach(function() {
    this.sandbox.verifyAndRestore();
  });

  describe('onPreBuild()', function() {
    beforeEach(function() {
      this.createCronAllowedRange = this.sandbox.stub();
      const getConfigValue = this.sandbox.stub();

      const { onPreBuild } = proxyquire('../src', {
        './lib/cron-allowed-range': this.createCronAllowedRange,
        './lib/get-config-value': getConfigValue
      });

      this.config = {
        expression: '* * * * *',
        timezone: 'America/Toronto'
      };

      this.sandbox.stub(process.env, 'DEPLOYMENT_HOURS_EXPRESSION')
        .value(this.config.expression);

      this.sandbox.stub(process.env, 'DEPLOYMENT_HOURS_TIMEZONE')
        .value(this.config.timezone);

      const inputs = {
        expression: '* * * * 1',
        timezone: 'Africa/Abidjan'
      };

      getConfigValue
        .withArgs({
          configName: 'expression',
          defaultValue: '* * * * *',
          env: this.config.expression,
          input: inputs.expression
        })
        .returns(this.config.expression);

      getConfigValue
        .withArgs({
          configName: 'timezone',
          defaultValue: 'America/Toronto',
          env: this.config.timezone,
          input: inputs.timezone
        })
        .returns(this.config.timezone);

      this.utils = {
        build: {
          cancelBuild: this.sandbox.stub(),
          failPlugin: this.sandbox.stub()
        }
      };
      this.onPreBuild = () => onPreBuild({ inputs, utils: this.utils });

      this.cr = {
        isDateAllowed: this.sandbox.stub()
      };
    });

    it('fails build when CronAllowedRange throws an exception', function() {
      const error = new Error('Syntax issue');

      this.createCronAllowedRange
        .withArgs(this.config.expression, this.config.timezone)
        .throws(error);

      this.onPreBuild();

      expect(this.utils.build.failPlugin)
        .to.have.been.calledWith('Invalid Cron expression or timezone', { error });
    });

    it('cancels build if deployment is not allowed', function() {
      this.createCronAllowedRange
        .withArgs(this.config.expression, this.config.timezone)
        .returns(this.cr);

      this.cr.isDateAllowed
        .returns(false);

      this.onPreBuild();

      expect(this.utils.build.cancelBuild)
        .to.have.been.calledWith('Deployment not allowed at this time.');
    });

    it('cancels build if deployment is allowed', function() {
      this.createCronAllowedRange
        .withArgs(this.config.expression, this.config.timezone)
        .returns(this.cr);

      this.cr.isDateAllowed
        .returns(true);

      this.onPreBuild();

      expect(this.utils.build.cancelBuild)
        .to.not.have.been.called;
    });
  });
});
