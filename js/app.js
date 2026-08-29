(function () {
  'use strict';

  const state = {
    contributionFrequency: 'monthly',
    selectedStrategy: 'income'
  };

  function i18n() {
    return window.InvestmentI18n;
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat(i18n().getLocale(), {
      style: 'currency',
      currency: 'CHF',
      maximumFractionDigits: 0
    }).format(value);
  }

  function formatPercent(value, digits) {
    return `${(value * 100).toLocaleString(i18n().getLocale(), {
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
      languageButton: document.getElementById('language-button'),
      frequencyButtons: Array.from(document.querySelectorAll('.frequency-button')),
      strategyButtons: Array.from(document.querySelectorAll('.strategy-button')),
      portfolioChart: document.getElementById('portfolio-chart')
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
    const frequencySuffix = inputs.contributionFrequency === 'weekly' ? i18n().t('perWeek') : i18n().t('perMonth');

    elements.initialCapitalOutput.textContent = formatCurrency(inputs.initialCapital);
    elements.contributionOutput.textContent = `${formatCurrency(inputs.contribution)}${frequencySuffix}`;
    elements.annualReturnOutput.textContent = formatPercent(inputs.annualReturn, 1);
    elements.durationYearsOutput.textContent = `${inputs.durationYears} ${i18n().t(inputs.durationYears === 1 ? 'year' : 'years')}`;

    elements.portfolioValue.textContent = formatCurrency(result.portfolioValue);
    elements.investedCapital.textContent = formatCurrency(result.investedCapital);
    elements.gains.textContent = formatCurrency(result.gains);
    elements.performance.textContent = formatPercent(result.performance, 1);
  }

  function updateStrategySelection(elements) {
    elements.strategyButtons.forEach((button) => {
      const isActive = button.dataset.strategy === state.selectedStrategy;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  }

  function updateLanguage(elements) {
    i18n().apply(document);
    if (elements.languageButton) elements.languageButton.textContent = i18n().getLanguage().toUpperCase();
  }

  function refresh(elements) {
    const inputs = readInputs(elements);
    const result = window.InvestmentSimulation.simulateInvestment(inputs);
    updateOutputs(elements, inputs, result);

    if (window.InvestmentChart && typeof window.InvestmentChart.renderChart === 'function' && elements.portfolioChart) {
      try {
        window.InvestmentChart.renderChart(elements.portfolioChart, result);
      } catch (error) {
        console.error('Chart rendering error:', error);
      }
    }

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

  function setStrategy(elements, strategyKey) {
    const strategy = window.InvestmentConfig.strategies[strategyKey];
    if (!strategy) return;

    state.selectedStrategy = strategyKey;
    elements.annualReturn.value = String(strategy.annualReturn * 100);
    updateStrategySelection(elements);
    refresh(elements);
  }

  function init() {
    const elements = getElements();
    const rangeInputs = [elements.initialCapital, elements.contribution, elements.durationYears];

    rangeInputs.forEach((input) => input.addEventListener('input', () => refresh(elements)));

    elements.annualReturn.addEventListener('input', () => {
      state.selectedStrategy = null;
      updateStrategySelection(elements);
      refresh(elements);
    });

    elements.frequencyButtons.forEach((button) => {
      button.addEventListener('click', () => setFrequency(elements, button.dataset.frequency));
    });

    elements.strategyButtons.forEach((button) => {
      button.addEventListener('click', () => setStrategy(elements, button.dataset.strategy));
    });

    if (elements.languageButton) {
      elements.languageButton.addEventListener('click', () => {
        i18n().nextLanguage();
        updateLanguage(elements);
        refresh(elements);
      });
    }

    updateLanguage(elements);
    updateStrategySelection(elements);
    refresh(elements);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
