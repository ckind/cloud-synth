# Cloud Synth

A browser-based analog synth emulation and musical playground — craft sounds, sequence ideas, and play with an expressive virtual instrument in your browser.

View the live demo here: https://happy-smoke-0ac26ae10.3.azurestaticapps.net/#/

Features
- Responsive UI built with Vue and Vuetify
- Preset banks and categories with import/export support
- MIDI input support and a virtual piano interface
- Sequencer and customizable effects chain for creative sound design

Getting started

Prerequisites
- Node.js 14+ and npm

Install
```bash
npm install
```

Development (hot-reload)
```bash
npm run serve
```

Build for production
```bash
npm run build
```

Lint and fix
```bash
npm run lint
```

Usage
- Open the dev server address printed by `npm run serve` (usually http://localhost:8080)
- Connect a MIDI device to control the synth, or use the on-screen keyboard
- Browse presets via the preset dropdown, tweak parameters, and save your own

Contributing
- Bug reports and PRs welcome — please open an issue first to discuss larger changes.
- Follow project style by running `npm run lint` before committing.

Notes on Vue 3 migration
- This repo is being updated to Vue 3. If you encounter runtime errors, run a full type-check or dev server to surface compatibility issues.

License
- MIT

Acknowledgements
- Built with Vue, Vuetify, Typscript Web Audio APIs.

Contact
- For questions or help, open an issue in this repository.
