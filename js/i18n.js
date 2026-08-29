(function () {
  'use strict';

  var languages = ['fr', 'de', 'en'];
  var locales = { fr: 'fr-CH', de: 'de-CH', en: 'en-CH' };
  var translations = {
    fr: {
      documentTitle: 'Simulateur d’investissement',
      eyebrow: 'Projection d’investissement',
      title: 'Simulateur d’investissement',
      intro: 'Visualisez l’impact du temps, des versements réguliers et du rendement sur votre portefeuille.',
      preferencesAria: 'Préférences de l’application',
      languageAria: 'Changer de langue',
      themeAria: 'Thème — disponible prochainement',
      resultsAria: 'Résultats de la simulation',
      estimatedValue: 'Valeur estimée du portefeuille',
      investedCapital: 'Capital investi',
      gains: 'Gains générés',
      performance: 'Performance',
      evolution: 'Évolution',
      chartTitle: 'Projection du portefeuille',
      chartLegendAria: 'Légende du graphique',
      portfolio: 'Portefeuille',
      chartInvested: 'Capital investi',
      chartAria: 'Graphique de projection du portefeuille',
      controlsAria: 'Paramètres de la simulation',
      parameters: 'Paramètres',
      adjustProjection: 'Ajustez votre projection',
      initialCapital: 'Capital initial',
      recurringContribution: 'Versement régulier',
      frequencyAria: 'Fréquence des versements',
      monthly: 'Mensuel',
      weekly: 'Hebdomadaire',
      annualReturn: 'Rendement annuel moyen',
      duration: 'Durée d’investissement',
      strategies: 'Stratégies',
      chooseHypothesis: 'Choisissez une hypothèse',
      strategyAria: 'Hypothèses de rendement',
      income: 'Revenu',
      incomeDesc: 'Priorité à la stabilité',
      balanced: 'Équilibré',
      balancedDesc: 'Équilibre rendement / risque',
      growth: 'Croissance',
      growthDesc: 'Potentiel de croissance accru',
      equities: 'Actions',
      equitiesDesc: 'Hypothèse la plus dynamique',
      strategyNote: 'Ces rendements sont des hypothèses de simulation, pas des performances garanties.',
      perMonth: '/mois',
      perWeek: '/semaine',
      year: 'an',
      years: 'ans',
      yearsAxis: 'Années'
    },
    de: {
      documentTitle: 'Anlagesimulator',
      eyebrow: 'Anlageprojektion',
      title: 'Anlagesimulator',
      intro: 'Sehen Sie, wie Zeit, regelmässige Einzahlungen und Rendite Ihr Portfolio beeinflussen.',
      preferencesAria: 'App-Einstellungen',
      languageAria: 'Sprache wechseln',
      themeAria: 'Design — demnächst verfügbar',
      resultsAria: 'Simulationsergebnisse',
      estimatedValue: 'Geschätzter Portfoliowert',
      investedCapital: 'Investiertes Kapital',
      gains: 'Erzielter Gewinn',
      performance: 'Performance',
      evolution: 'Entwicklung',
      chartTitle: 'Portfolio-Projektion',
      chartLegendAria: 'Diagrammlegende',
      portfolio: 'Portfolio',
      chartInvested: 'Investiertes Kapital',
      chartAria: 'Diagramm der Portfolio-Projektion',
      controlsAria: 'Simulationsparameter',
      parameters: 'Parameter',
      adjustProjection: 'Projektion anpassen',
      initialCapital: 'Startkapital',
      recurringContribution: 'Regelmässige Einzahlung',
      frequencyAria: 'Einzahlungsrhythmus',
      monthly: 'Monatlich',
      weekly: 'Wöchentlich',
      annualReturn: 'Durchschnittliche Jahresrendite',
      duration: 'Anlagedauer',
      strategies: 'Strategien',
      chooseHypothesis: 'Annahme auswählen',
      strategyAria: 'Renditeannahmen',
      income: 'Ertrag',
      incomeDesc: 'Stabilität im Vordergrund',
      balanced: 'Ausgewogen',
      balancedDesc: 'Ausgewogenes Rendite-Risiko-Verhältnis',
      growth: 'Wachstum',
      growthDesc: 'Höheres Wachstumspotenzial',
      equities: 'Aktien',
      equitiesDesc: 'Dynamischste Annahme',
      strategyNote: 'Diese Renditen sind Simulationsannahmen und keine garantierten Ergebnisse.',
      perMonth: '/Monat',
      perWeek: '/Woche',
      year: 'Jahr',
      years: 'Jahre',
      yearsAxis: 'Jahre'
    },
    en: {
      documentTitle: 'Investment simulator',
      eyebrow: 'Investment projection',
      title: 'Investment simulator',
      intro: 'See how time, recurring contributions and returns can affect your portfolio.',
      preferencesAria: 'Application preferences',
      languageAria: 'Change language',
      themeAria: 'Theme — coming soon',
      resultsAria: 'Simulation results',
      estimatedValue: 'Estimated portfolio value',
      investedCapital: 'Invested capital',
      gains: 'Generated gains',
      performance: 'Performance',
      evolution: 'Growth',
      chartTitle: 'Portfolio projection',
      chartLegendAria: 'Chart legend',
      portfolio: 'Portfolio',
      chartInvested: 'Invested capital',
      chartAria: 'Portfolio projection chart',
      controlsAria: 'Simulation parameters',
      parameters: 'Parameters',
      adjustProjection: 'Adjust your projection',
      initialCapital: 'Initial capital',
      recurringContribution: 'Recurring contribution',
      frequencyAria: 'Contribution frequency',
      monthly: 'Monthly',
      weekly: 'Weekly',
      annualReturn: 'Average annual return',
      duration: 'Investment duration',
      strategies: 'Strategies',
      chooseHypothesis: 'Choose an assumption',
      strategyAria: 'Return assumptions',
      income: 'Income',
      incomeDesc: 'Stability first',
      balanced: 'Balanced',
      balancedDesc: 'Balanced return / risk',
      growth: 'Growth',
      growthDesc: 'Higher growth potential',
      equities: 'Equities',
      equitiesDesc: 'Most dynamic assumption',
      strategyNote: 'These returns are simulation assumptions, not guaranteed performance.',
      perMonth: '/month',
      perWeek: '/week',
      year: 'year',
      years: 'years',
      yearsAxis: 'Years'
    }
  };

  function loadLanguage() {
    try {
      var saved = sessionStorage.getItem('investment-language');
      if (languages.indexOf(saved) !== -1) return saved;
    } catch (error) {}
    return 'fr';
  }

  var currentLanguage = loadLanguage();

  function t(key) {
    return translations[currentLanguage][key] || translations.fr[key] || key;
  }

  function apply(root) {
    var scope = root || document;
    var textNodes = scope.querySelectorAll('[data-i18n]');
    for (var i = 0; i < textNodes.length; i += 1) {
      textNodes[i].textContent = t(textNodes[i].getAttribute('data-i18n'));
    }

    var ariaNodes = scope.querySelectorAll('[data-i18n-aria-label]');
    for (var j = 0; j < ariaNodes.length; j += 1) {
      ariaNodes[j].setAttribute('aria-label', t(ariaNodes[j].getAttribute('data-i18n-aria-label')));
    }

    document.documentElement.lang = currentLanguage;
    document.title = t('documentTitle');
  }

  function setLanguage(language) {
    if (languages.indexOf(language) === -1) return currentLanguage;
    currentLanguage = language;
    try { sessionStorage.setItem('investment-language', currentLanguage); } catch (error) {}
    apply(document);
    return currentLanguage;
  }

  function nextLanguage() {
    var index = languages.indexOf(currentLanguage);
    return setLanguage(languages[(index + 1) % languages.length]);
  }

  window.InvestmentI18n = Object.freeze({
    t: t,
    apply: apply,
    setLanguage: setLanguage,
    nextLanguage: nextLanguage,
    getLanguage: function () { return currentLanguage; },
    getLocale: function () { return locales[currentLanguage]; }
  });
}());
