(function () {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';

  function createSvgElement(tag, attrs) {
    var el = document.createElementNS(SVG_NS, tag);
    var keys = Object.keys(attrs || {});
    for (var i = 0; i < keys.length; i += 1) {
      el.setAttribute(keys[i], String(attrs[keys[i]]));
    }
    return el;
  }

  function clearSvg(svg) {
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
  }

  function formatCompactCurrency(value) {
    var absolute = Math.abs(value);
    if (absolute >= 1000000) {
      return (value / 1000000).toLocaleString('fr-CH', { maximumFractionDigits: 1 }) + ' M';
    }
    if (absolute >= 1000) {
      return (value / 1000).toLocaleString('fr-CH', { maximumFractionDigits: 1 }) + ' k';
    }
    return Math.round(value).toLocaleString('fr-CH');
  }

  function renderChart(svg, simulation) {
    if (!svg || !simulation || !simulation.series || simulation.series.length < 2) {
      return;
    }

    var width = 800;
    var height = 340;
    var padding = { top: 20, right: 24, bottom: 42, left: 64 };
    var innerWidth = width - padding.left - padding.right;
    var innerHeight = height - padding.top - padding.bottom;
    var series = simulation.series;
    var maxValue = 1;
    var i;

    for (i = 0; i < series.length; i += 1) {
      maxValue = Math.max(maxValue, series[i].portfolioValue, series[i].investedCapital);
    }

    var niceMax = maxValue * 1.08;
    var maxYears = Math.max(Number(simulation.params.durationYears) || 1, 1);

    function x(years) {
      return padding.left + (years / maxYears) * innerWidth;
    }

    function y(value) {
      return padding.top + innerHeight - (value / niceMax) * innerHeight;
    }

    clearSvg(svg);
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    var defs = createSvgElement('defs');
    var gradient = createSvgElement('linearGradient', {
      id: 'portfolio-fill',
      x1: '0',
      y1: '0',
      x2: '0',
      y2: '1'
    });
    gradient.appendChild(createSvgElement('stop', {
      offset: '0%',
      'stop-color': '#6d46e5',
      'stop-opacity': '0.24'
    }));
    gradient.appendChild(createSvgElement('stop', {
      offset: '100%',
      'stop-color': '#6d46e5',
      'stop-opacity': '0.02'
    }));
    defs.appendChild(gradient);
    svg.appendChild(defs);

    var gridGroup = createSvgElement('g', { class: 'chart-grid' });
    var yTicks = 4;
    for (i = 0; i <= yTicks; i += 1) {
      var value = (niceMax / yTicks) * i;
      var py = y(value);
      gridGroup.appendChild(createSvgElement('line', {
        x1: padding.left,
        x2: width - padding.right,
        y1: py,
        y2: py,
        class: 'chart-grid-line'
      }));

      var yLabel = createSvgElement('text', {
        x: padding.left - 10,
        y: py + 4,
        'text-anchor': 'end',
        class: 'chart-axis-label'
      });
      yLabel.textContent = 'CHF ' + formatCompactCurrency(value);
      gridGroup.appendChild(yLabel);
    }

    var xTicks = Math.min(5, Math.max(1, Math.round(maxYears)));
    for (i = 0; i <= xTicks; i += 1) {
      var years = (maxYears / xTicks) * i;
      var roundedYears = Math.round(years);
      var xLabel = createSvgElement('text', {
        x: x(years),
        y: height - 12,
        'text-anchor': i === 0 ? 'start' : (i === xTicks ? 'end' : 'middle'),
        class: 'chart-axis-label'
      });
      xLabel.textContent = roundedYears + ' an' + (roundedYears > 1 ? 's' : '');
      gridGroup.appendChild(xLabel);
    }
    svg.appendChild(gridGroup);

    function buildPath(key) {
      var parts = [];
      for (var j = 0; j < series.length; j += 1) {
        parts.push((j === 0 ? 'M ' : 'L ') + x(series[j].elapsedYears).toFixed(2) + ' ' + y(series[j][key]).toFixed(2));
      }
      return parts.join(' ');
    }

    var portfolioPath = buildPath('portfolioValue');
    var investedPath = buildPath('investedCapital');
    var last = series[series.length - 1];
    var areaPath = portfolioPath +
      ' L ' + x(last.elapsedYears).toFixed(2) + ' ' + y(0).toFixed(2) +
      ' L ' + x(0).toFixed(2) + ' ' + y(0).toFixed(2) + ' Z';

    svg.appendChild(createSvgElement('path', { d: areaPath, class: 'chart-area' }));
    svg.appendChild(createSvgElement('path', { d: investedPath, class: 'chart-line chart-line-invested' }));
    svg.appendChild(createSvgElement('path', { d: portfolioPath, class: 'chart-line chart-line-portfolio' }));

    svg.appendChild(createSvgElement('circle', {
      cx: x(last.elapsedYears),
      cy: y(last.portfolioValue),
      r: 5,
      class: 'chart-endpoint portfolio-endpoint'
    }));
    svg.appendChild(createSvgElement('circle', {
      cx: x(last.elapsedYears),
      cy: y(last.investedCapital),
      r: 4,
      class: 'chart-endpoint invested-endpoint'
    }));
  }

  window.InvestmentChart = Object.freeze({
    renderChart: renderChart
  });
}());
