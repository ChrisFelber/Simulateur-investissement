window.InvestmentConfig = Object.freeze({
  defaults: Object.freeze({
    initialCapital: 5000,
    contribution: 100,
    contributionFrequency: 'monthly',
    annualReturn: 0.04,
    durationYears: 10
  }),

  frequencies: Object.freeze({
    monthly: Object.freeze({ periodsPerYear: 12 }),
    weekly: Object.freeze({ periodsPerYear: 52 })
  }),

  strategies: Object.freeze({
    income: Object.freeze({ annualReturn: 0.04 }),
    balanced: Object.freeze({ annualReturn: 0.06 }),
    growth: Object.freeze({ annualReturn: 0.08 }),
    equities: Object.freeze({ annualReturn: 0.10 })
  })
});
