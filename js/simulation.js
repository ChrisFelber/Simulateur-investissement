(function () {
  'use strict';

  function assertFiniteNonNegative(value, name) {
    if (!Number.isFinite(value) || value < 0) {
      throw new RangeError(`${name} must be a finite number greater than or equal to 0.`);
    }
  }

  function assertPositiveInteger(value, name) {
    if (!Number.isInteger(value) || value <= 0) {
      throw new RangeError(`${name} must be a positive integer.`);
    }
  }

  function getFrequencyConfig(frequency) {
    const config = window.InvestmentConfig;
    if (!config || !config.frequencies || !config.frequencies[frequency]) {
      throw new RangeError(`Unsupported contribution frequency: ${frequency}`);
    }
    return config.frequencies[frequency];
  }

  function annualToPeriodicRate(annualReturn, periodsPerYear) {
    if (!Number.isFinite(annualReturn) || annualReturn <= -1) {
      throw new RangeError('annualReturn must be greater than -1.');
    }
    assertPositiveInteger(periodsPerYear, 'periodsPerYear');
    return Math.pow(1 + annualReturn, 1 / periodsPerYear) - 1;
  }

  function normalizeInputs(input) {
    const defaults = window.InvestmentConfig.defaults;
    const values = Object.assign({}, defaults, input || {});

    assertFiniteNonNegative(values.initialCapital, 'initialCapital');
    assertFiniteNonNegative(values.contribution, 'contribution');
    assertFiniteNonNegative(values.durationYears, 'durationYears');

    if (!Number.isFinite(values.annualReturn) || values.annualReturn <= -1) {
      throw new RangeError('annualReturn must be a finite number greater than -1.');
    }

    const frequency = getFrequencyConfig(values.contributionFrequency);
    const totalPeriods = Math.round(values.durationYears * frequency.periodsPerYear);

    return Object.freeze({
      initialCapital: values.initialCapital,
      contribution: values.contribution,
      contributionFrequency: values.contributionFrequency,
      annualReturn: values.annualReturn,
      durationYears: values.durationYears,
      periodsPerYear: frequency.periodsPerYear,
      totalPeriods
    });
  }

  function simulateInvestment(input) {
    const params = normalizeInputs(input);
    const periodicRate = annualToPeriodicRate(params.annualReturn, params.periodsPerYear);

    let portfolioValue = params.initialCapital;
    let totalContributions = 0;
    const series = [{
      period: 0,
      elapsedYears: 0,
      investedCapital: params.initialCapital,
      portfolioValue,
      gains: 0
    }];

    for (let period = 1; period <= params.totalPeriods; period += 1) {
      portfolioValue *= 1 + periodicRate;
      portfolioValue += params.contribution;
      totalContributions += params.contribution;

      const investedCapital = params.initialCapital + totalContributions;
      series.push({
        period,
        elapsedYears: period / params.periodsPerYear,
        investedCapital,
        portfolioValue,
        gains: portfolioValue - investedCapital
      });
    }

    const investedCapital = params.initialCapital + totalContributions;
    const gains = portfolioValue - investedCapital;
    const performance = investedCapital > 0 ? gains / investedCapital : 0;

    return Object.freeze({
      params,
      periodicRate,
      initialCapital: params.initialCapital,
      totalContributions,
      investedCapital,
      portfolioValue,
      gains,
      performance,
      contributionCount: params.totalPeriods,
      series
    });
  }

  window.InvestmentSimulation = Object.freeze({
    annualToPeriodicRate,
    normalizeInputs,
    simulateInvestment
  });
}());
