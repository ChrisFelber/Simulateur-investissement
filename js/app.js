(function () {
  'use strict';

  const state = {
    contributionFrequency: 'monthly'
  };

  const formatCurrency = new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF',
    maximumFractionDigits: 0
  });

  function formatPercent(value, digits) {
    return `${(value * 100).toLocaleString('fr-CH', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    })} %`;
  }

  function getElements() {
    return {
      initialCapital: document.getElementById('initial-capital'),
      contribution: document.getElementById('contribution'),
      annualReturn: document.getElementById('annual-return'),
      durationYears: document.getElementById('duration-years'),
      initialCapitalOutput: document.getElementById('initial-capital-output'),
      contributionOutput: document.getElementById('contribution-output'),
      annualReturnOutput: document.getElementById('annual-return-output'),
      durationYearsOutput: document.getElementById('duration-years-output'),
      portfolioValue: document.getElementById('portfolio-value'),
      investedCapital: document.getElementById('invested-capital'),
      gains: document.getElementById('gains'),
      performance: document.getElementById('performance'),
      detailInitial: document.getElementById('detail-initial'),
      detailContributions: document.getElementById('detail-contributions'),
      detailCount: document.getElementById('detail-count'),
      detailReturn: document.getElementById('detail-return'),
      detailDuration: document.getElementById('detail-duration'),
      detailFrequency: document.getElementById('detail-frequency'),
      frequencyButtons: Array.from(document.querySelectorAll('.frequency-button'))
    };
  }

  function readInputs(elements) {
    return {
      initialCapital: Number(elements.initialCapital.value),
      contribution: Number(elements.contribution.value),
      contributionFrequency: state.contributionFrequency,
      annualReturn: Number(elements.annualReturn.value) / 100,
      durationYears: Number(elements.durationYears.value)
    };
  }

  function updateOutputs(elements, inputs, result) {
    const frequencySuffix = inputs.contributionFrequency === 'weekly' ? '/semaine' : '/mois';

    elements.initialCapitalOutput.textContent = formatCurrency.format(inputs.initialCapital);
    elements.contributionOutput.textContent = `${formatCurrency.format(inputs.contribution)}${frequencySuffix}`;
    elements.annualReturnOutput.textContent = formatPercent(inputs.annualReturn, 1);
    elements.durationYearsOutput.textContent = `${inputs.durationYears} ${inputs.durationYears === 1 ? 'an' : 'ans'}`;

    elements.portfolioValue.textContent = formatCurrency.format(result.portfolioValue);
    elements.investedCapital.textContent = formatCurrency.format(result.investedCapital);
    elements.gains.textContent = formatCurrency.format(result.gains);
    elements.performance.textContent = formatPercent(result.performance, 1);

    elements.detailInitial.textContent = formatCurrency.format(result.initialCapital);
    elements.detailContributions.textContent = formatCurrency.format(result.totalContributions);
    elements.detailCount.textContent = result.contributionCount.toLocaleString('fr-CH');
    elements.detailReturn.textContent = formatPercent(inputs.annualReturn, 1);
    elements.detailDuration.textContent = `${inputs.durationYears} ${inputs.durationYears === 1 ? 'an' : 'ans'}`;
    elements.detailFrequency.textContent = inputs.contributionFrequency === 'weekly' ? 'Hebdomadaire' : 'Mensuelle';
  }

  function refresh(elements) {
    const inputs = readInputs(elements);
    const result = window.InvestmentSimulation.simulateInvestment(inputs);
    updateOutputs(elements, inputs, result);
    window.currentInvestmentSimulation = result;
  }

  function setFrequency(elements, frequency) {
    state.contributionFrequency = frequency;
    elements.frequencyButtons.forEach((button) => {
      const isActive = button.dataset.frequency === frequency;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
    refresh(elements);
  }

  function init() {
    const elements = getElements();
    const rangeInputs = [
      elements.initialCapital,
      elements.contribution,
      elements.annualReturn,
      elements.durationYears
    ];

    rangeInputs.forEach((input) => {
      input.addEventListener('input', () => refresh(elements));
    });

    elements.frequencyButtons.forEach((button) => {
      button.addEventListener('click', () => setFrequency(elements, button.dataset.frequency));
    });

    refresh(elements);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
