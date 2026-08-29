window.InvestmentConfig = Object.freeze({
  defaults: Object.freeze({
    initialCapital: 5000,
    contribution: 100,
    contributionFrequency: 'monthly',
    annualReturn: 0.035,
    durationYears: 10
  }),

  frequencies: Object.freeze({
    monthly: Object.freeze({ periodsPerYear: 12 }),
    weekly: Object.freeze({ periodsPerYear: 52 })
  }),

  strategies: Object.freeze({
    income: Object.freeze({ annualReturn: 0.035 }),
    balanced: Object.freeze({ annualReturn: 0.055 }),
    growth: Object.freeze({ annualReturn: 0.075 }),
    equities: Object.freeze({ annualReturn: 0.095 })
  })
});
