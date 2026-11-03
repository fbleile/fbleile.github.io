# Fabian Bleile Website: Style and Interaction Preferences

This document records the preferred direction for the website and its interactive notebooks.

## Reference points

- [Nicky Case — An Interactive Introduction to Attractor Landscapes](https://ncase.me/attractors/)
- [The Minerva Quest — Forex](https://jasenlo123.github.io/jasenlo123-The-Minerva-Quest---Forex/)

These references should guide the design language, not be copied literally.

## Overall direction

Create an academic website that is calm and credible at first glance, but becomes playful and exploratory when a visitor enters a notebook. The homepage should remain minimal and easy to scan. Individual notebooks can be more immersive, visual, and narrative-driven.

The core principle is **explain through interaction**: introduce one idea, let the visitor manipulate it, show the consequence immediately, and then add the next layer of explanation.

## Interactive component preferences

### Explorable explanations

- Combine short text with an interactive figure instead of placing all explanation before the figure.
- Use a clear progression: intuition → simple model → manipulation → observed behavior → mathematical interpretation.
- Prefer one strong interactive idea per section over a dashboard filled with controls.
- Make the effect of every control visible immediately.
- Let visitors discover behavior by changing parameters, adding/removing points, dragging objects, or switching processes.
- Use motion to show dynamics, but always provide pause, reset, and a way to inspect a state.

### Controls

- Use plain-language labels before mathematical notation.
- Keep controls close to the figure they affect.
- Use sliders for continuous parameters and buttons/selects for discrete choices.
- Show current values and short descriptions next to controls.
- Include a clearly visible reset button.
- Support mouse, touch, and keyboard input.
- Never make hover the only way to access important behavior.
- Keep the default state meaningful and visually understandable.

### Visual feedback

- Prefer smooth transitions and continuous motion where they explain a process.
- Use restrained animation rather than decorative motion.
- Highlight what changed after an interaction.
- Use consistent colors for concepts, particles, trajectories, distributions, and reference objects.
- Make uncertainty and variation visible rather than hiding everything behind a single number.
- Add small captions, annotations, or live summaries where they help interpretation.

## Visual preferences

### Editorial data-story feeling

- Use a strong title, short dek/intro, and clearly separated chapters or sections.
- Give important figures generous space and allow them to become the visual focus.
- Use large typographic moments for section openings and concise explanatory labels around visualizations.
- Combine prose, diagrams, tables, and interaction in a deliberate sequence.
- Use cards or framed modules when they help separate experiments, but avoid a generic app-dashboard appearance.

### Color and typography

- Keep the personal homepage restrained, minimal, and readable.
- Allow notebooks to use a richer palette with a dark or atmospheric visualization canvas and one or two accent colors.
- For simulations, use a near-black canvas, orange for moving particles, and purple for samples or empirical overlays.
- Prefer high contrast and accessible text sizes.
- Use a serious serif or editorial display face for titles with a clean sans-serif face for controls, labels, and metadata.
- Use color to encode meaning consistently, not merely for decoration.

### Composition

- Favor a centered reading column with occasional full-width or wide interactive figures.
- Use whitespace to create rhythm between explanation and experiment.
- Build visual hierarchy with scale, spacing, borders, and restrained backgrounds rather than many UI components.
- Make the first screen of each notebook immediately communicate what can be manipulated.
- Design mobile layouts deliberately: controls should wrap cleanly, figures should remain usable, and touch targets should be comfortable.

## Notebook-specific direction

For the stationary-diffusions notebook:

- Start with moving particles as the intuitive entry point.
- Let visitors switch between a reverting linear ODE, Brownian motion, and the combined stationary diffusion.
- Show the qualitative distinction between contraction, unconstrained diffusion, and a Gaussian stationary cloud.
- Later add parameter controls for drift strength, noise strength, initial conditions, and dimension/visualization choices.
- Later connect the particle view to stationary distributions, generators, Stein operators, and SKDS.
- Keep the simulation understandable before introducing formulas.

## Technical constraints

- Keep notebooks self-contained and executable as static files.
- Every notebook must work from a local HTTP server and from GitHub Pages.
- Avoid requiring a backend or a running development server for the published version.
- Keep the Markdown source as the main place for narrative content and notebook metadata.
- Use progressive enhancement: a meaningful initial view should exist before interaction starts.
- Preserve reduced-motion and touch support.
- Prefer small, dependency-light browser components when they are sufficient.

## Things to avoid

- Dense dashboards with many simultaneous controls.
- Long uninterrupted blocks of technical text before the first interaction.
- Hover-only interactions.
- Animations that cannot be paused or understood.
- Decorative gradients, shadows, or colors that compete with the data.
- Replacing the visitor’s orientation with unexplained visual cleverness.
