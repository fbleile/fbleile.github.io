import React from 'react';

const h = React.createElement;
const WIDTH = 760;
const HEIGHT = 360;
const PAD = { top: 42, right: 28, bottom: 58, left: 42 };
const DOMAIN = [-3.5, 3.5];
const EPSILON = 1e-4;
const initialPoints = [-2.15, -1.45, -0.95, -0.35, 0.2, 0.75, 1.35, 2.05];

const square = (x) => x * x;
const w1 = (x) => Math.sqrt(1 + square(x));

// Scalar kernels mirrored from stadion/inference.py on the SKDS branch.
const kernels = {
  rbf: (x, y, bandwidth) => Math.exp(-square(x - y) / (2 * square(bandwidth))),
  tilted: (x, y, bandwidth) => Math.exp(-square(x - y) / (2 * square(bandwidth))) / (w1(x) * w1(y)),
  imq: (x, y) => {
    const wx = w1(x);
    const wy = w1(y);
    const wqX = Math.pow(1 + square(x), -1);
    const wqY = Math.pow(1 + square(y), -1);
    return wqX * (1 / (w1(x - y) * wx * wy) + (1 + x * y) / (wx * wy)) * wqY;
  },
};

const derivative = (fn, x, y, axis) => axis === 0
  ? (fn(x + EPSILON, y) - fn(x - EPSILON, y)) / (2 * EPSILON)
  : (fn(x, y + EPSILON) - fn(x, y - EPSILON)) / (2 * EPSILON);

// OU drift f(x)=-x and sigma(x)=sqrt(2), so 0.5*sigma^2=1.
const steinX = (x, y, kernel) => -x * kernel(x, y) + derivative(kernel, x, y, 0);
const skdsPair = (x, y, kernel) => {
  const appliedX = (a, b) => steinX(a, b, kernel);
  return -y * appliedX(x, y) + derivative(appliedX, x, y, 1);
};

const linearSkds = (points, kernel) => {
  const usable = points.length - (points.length % 2);
  if (usable < 2) return 0;
  let total = 0;
  for (let i = 0; i < usable; i += 2) total += skdsPair(points[i], points[i + 1], kernel);
  return total / (usable / 2);
};

class SkdsExplorer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { kernel: 'rbf', bandwidth: 0.9, points: initialPoints };
  }

  xScale(value) { return PAD.left + ((value - DOMAIN[0]) / (DOMAIN[1] - DOMAIN[0])) * (WIDTH - PAD.left - PAD.right); }
  valueAtX(pixel) { return DOMAIN[0] + ((pixel - PAD.left) / (WIDTH - PAD.left - PAD.right)) * (DOMAIN[1] - DOMAIN[0]); }
  kernelForState() { const { kernel, bandwidth } = this.state; return (x, y) => kernels[kernel](x, y, bandwidth); }

  addPoint = (event) => {
    if (event.target.tagName === 'circle') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const scale = rect.width / WIDTH;
    const x = this.valueAtX((event.clientX - rect.left) / scale);
    if (x < DOMAIN[0] || x > DOMAIN[1]) return;
    this.setState(({ points }) => ({ points: [...points, Number(x.toFixed(2))].sort((a, b) => a - b) }));
  };

  removePoint = (index) => this.setState(({ points }) => ({ points: points.filter((_, pointIndex) => pointIndex !== index) }));

  render() {
    const { kernel, bandwidth, points } = this.state;
    const kernelFunction = this.kernelForState();
    const score = linearSkds(points, kernelFunction);
    const baseline = HEIGHT - PAD.bottom - 44;
    const profile = Array.from({ length: 121 }, (_, index) => {
      const x = DOMAIN[0] + (index / 120) * (DOMAIN[1] - DOMAIN[0]);
      const y = baseline - kernels[kernel](x, 0, bandwidth) * 75;
      return `${index === 0 ? 'M' : 'L'}${this.xScale(x).toFixed(2)},${y.toFixed(2)}`;
    }).join(' ');
    const ticks = [-3, -2, -1, 0, 1, 2, 3];

    const select = h('select', { value: kernel, onChange: (event) => this.setState({ kernel: event.target.value }) },
      h('option', { value: 'rbf' }, 'RBF'),
      h('option', { value: 'tilted' }, 'Tilted RBF'),
      h('option', { value: 'imq' }, 'IMQ (q=2)')
    );
    const bandwidthInput = h('input', {
      type: 'range', min: '0.25', max: '2', step: '0.05', value: bandwidth,
      disabled: kernel === 'imq',
      onChange: (event) => this.setState({ bandwidth: Number(event.target.value) }),
    });
    const tickElements = ticks.map((tick) => h('g', { key: tick },
      h('line', { x1: this.xScale(tick), x2: this.xScale(tick), y1: baseline - 5, y2: baseline + 5, stroke: '#536268' }),
      h('text', { x: this.xScale(tick), y: baseline + 27, textAnchor: 'middle' }, tick)
    ));
    const pointElements = points.map((point, index) => h('circle', {
      key: `${point}-${index}`,
      cx: this.xScale(point), cy: baseline, r: 9, fill: '#176b63', stroke: '#fff', strokeWidth: 3,
      onClick: (event) => { event.stopPropagation(); this.removePoint(index); },
    }));

    return h('div', { className: 'skds-explorer' },
      h('div', { className: 'skds-controls' },
        h('label', null, 'Kernel', select),
        h('label', null, 'Bandwidth ', bandwidthInput, h('span', null, bandwidth.toFixed(2))),
        h('button', { type: 'button', onClick: () => this.setState({ points: initialPoints }) }, 'Reset points')
      ),
      h('div', { className: 'skds-score' },
        h('span', null, 'Linear SKDS estimate'),
        h('strong', null, score.toFixed(4)),
        h('small', null, `${points.length} points · click to add/remove`)
      ),
      h('svg', {
        className: 'skds-plot', viewBox: `0 0 ${WIDTH} ${HEIGHT}`, role: 'img',
        'aria-label': 'Interactive one-dimensional SKDS plot', onClick: this.addPoint,
      },
      h('rect', { x: PAD.left, y: PAD.top, width: WIDTH - PAD.left - PAD.right, height: baseline - PAD.top, fill: '#f6f8f7', rx: 10 }),
      h('path', { d: profile, fill: 'none', stroke: '#9ccac2', strokeWidth: 3, opacity: 0.9 }),
      h('line', { x1: PAD.left, x2: WIDTH - PAD.right, y1: baseline, y2: baseline, stroke: '#536268' }),
      ...tickElements,
      ...pointElements,
      h('text', { x: PAD.left, y: PAD.top - 14, className: 'skds-caption' }, 'kernel profile k(x, 0)'),
      h('text', { x: WIDTH - PAD.right, y: HEIGHT - 14, textAnchor: 'end', className: 'skds-caption' }, 'stationary OU sample space')
      )
    );
  }
}

export default SkdsExplorer;
