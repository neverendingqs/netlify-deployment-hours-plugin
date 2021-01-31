const { expect } = require('chai');

const getConfigValue = require('../../src/lib/get-config-value');

describe('get-config-value', function() {
  beforeEach(function() {
    this.defaultValue = 'defaultValue';
    this.env = 'env';
    this.input = 'input';

    this.getConfigValue = ({ defaultValue, env, input }) =>
      getConfigValue({ configName: 'configName', defaultValue, env, input });
  });

  it('uses default value if no input is provided', function() {
    expect(
      this.getConfigValue({ defaultValue: this.defaultValue })
    ).to.equal(this.defaultValue);
  });

  it('uses input value if provided', function() {
    expect(
      this.getConfigValue({
        defaultValue: this.defaultValue,
        input: this.input
      })
    ).to.equal(this.input);
  });

  it('uses env value if provided (overrides input value)', function() {
    expect(
      this.getConfigValue({
        defaultValue: this.defaultValue,
        env: this.env,
        input: this.input
      })
    ).to.equal(this.env);
  });
});
