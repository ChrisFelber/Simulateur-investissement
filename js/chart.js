(function () {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';

  function createSvgElement(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs || {}).forEach(([key, value]) => el.setAttribute(key, value));
    return el;
  }

  function formatCompactCurrency(value) {
    return new Intl.NumberFormat('fr-CH', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1
    }).format(value).replace(/k/i, 'k');
  }

  function renderChart(svg, simulation) {
    if (!svg || !simulation || !Array.isArray(simulation.series) || simulation.series.length === 0) return;

    const width = 800;
    const height = 340;
    const padding = { top: 20, right: 20, bottom: 40, left: 58 };
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;
    const series = simulation.series;
    const maxValue = Math.max(...series.map((p) => Math.max(p.portfolioValue, p.investedCapital)), 1);
    const niceMax = maxValue * 1.08;
    const maxYears = Math.max(simulation.params.durationYears, 1);

    const x = (years) => padding.left + (years / maxYears) * innerWidth;
    const y = (value) => padding.top + innerHeight - (value / niceMax) * innerHeight;

    svg.replaceChildren();
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    const defs = createSvgElement('defs');
    const gradient = createSvgElement('linearGradient', { id: 'portfolio-fill', x1: '0', y1: '0', x2: '0', y2: '1' });
    gradient.append(createSvgElement('stop', { offset: '0%', 'stop-color': '#6d46e5', 'stop-opacity': '0.24' }));
    gradient.append(createSvgElement('stop', { offset: '100%', 'stop-color': '#6d46e5', 'stop-opacity': '0.02' }));
    defs.append(gradient);
    svg.append(defs);

    const gridGroup = createSvgElement('g', { class: 'chart-grid' });
    const yTicks = 4;
    for (let i = 0; i <= yTicks; i += 1) {
      const value = (niceMax / yTicks) * i;
      const py = y(value);
      gridGroup.append(createSvgElement('line', {
        x1: padding.left,
        x2: width - padding.right,
        y1: py,
        y2: py,
        class: 'chart-grid-line'
      }));
      const label = createSvgElement('text', {
        x: padding.left - 10,
        y: py + 4,
        'text-anchor': 'end',
        class: 'chart-axis-label'
      });
      label.textContent = `CHF ${formatCompactCurrency(value)}`;
      gridGroup.append(label);
    }

    const xTicks = Math.min(5, maxYears);
    for (let i = 0; i <= xTicks; i += 1) {
      const years = (maxYears / xTicks) * i;
      const label = createSvgElement('text', {
        x: x(years),
        y: height - 12,
        'text-anchor': i === 0 ? 'start' : (i === xTicks ? 'end' : 'middle'),
        class: 'chart-axis-label'
      });
      label.textContent = `${Math.round(years)} an${Math.round(years) > 1 ? 's' : ''}`;
      gridGroup.append(label);
    }
    svg.append(gridGroup);

    function buildPath(key) {
      return series.map((point, index) => `${index === 0 ? 'M' : 'L'} ${x(point.elapsedYears).toFixed(2)} ${y(point[key]).toFixed(2)}`).join(' ');
    }

    const portfolioPath = buildPath('portfolioValue');
    const investedPath = buildPath('investedCapital');
    const areaPath = `${portfolioPath} L ${x(series.at(-1).elapsedYears).toFixed(2)} ${y(0).toFixed(2)} L ${x(0).toFixed(2)} ${y(0).toFixed(2)} Z`;

    svg.append(createSvgElement('path', { d: areaPath, class: 'chart-area' }));
    svg.append(createSvgElement('path', { d: investedPath, class: 'chart-line chart-line-invested' }));
    svg.append(createSvgElement('path', { d: portfolioPath, class: 'chart-line chart-line-portfolio' }));

    const last = series.at(-1);
    svg.append(createSvgElement('circle', {
      cx: x(last.elapsedYears),
      cy: y(last.portfolioValue),
      r: 5,
      class: 'chart-endpoint portfolio-endpoint'
    }));
    svg.append(createSvgElement('circle', {
      cx: x(last.elapsedYears),
      cy: y(last.investedCapital),
      r: 4,
      class: 'chart-endpoint invested-endpoint'
    }));
  }

  window.InvestmentChart = Object.freeze({ renderChart });
}());
