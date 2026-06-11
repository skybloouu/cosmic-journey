# ✦ Cosmic Journey

A quiet, contemplative web experience that traces how far light travels through the cosmos after a loved one has passed.

In Indian tradition, a **Chita** (चिता) is the sacred funeral pyre — the fire that releases the soul from its earthly form. The warmth of those flames becomes photons racing outward at the speed of light, unbound by gravity or distance. *Cosmic Journey* imagines that light still traveling — past the Moon, the Sun, the edge of the solar system, and on toward the nearest stars.

[**Live demo →**](https://skybloouu.github.io/cosmic-journey/)

---

## What it does

Enter a name and the date of passing, and the app calculates:

- **Distance traveled** — how far that light has gone, in km, AU, or light-years
- **Current region** — where the light would be now, with a short cosmic fact
- **Journey timeline** — notable milestones passed (Earth → Moon → Sun → Heliopause → Proxima Centauri → …)
- **Logarithmic scale** — a visual map of progress across vast distances
- **Wikipedia archives** — tap any milestone to learn more about that place in space

The experience is designed to feel meditative: starfield backgrounds, warp-speed transitions, ambient cosmic audio, and quotes from spiritual and philosophical traditions.

---

## Screenshots

| Landing | Journey view |
|---------|--------------|
| Enter a name and date of passing | Track light across the cosmos in real time |

---

## Tech stack

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Framer Motion](https://www.framer.com/motion/) for transitions and animations
- [react-datepicker](https://reactdatepicker.com/) for date input
- Web Audio API for ambient soundscapes
- Wikipedia REST API for celestial body summaries

All astronomical distances are computed from the speed of light (299,792.458 km/s) and elapsed time since the selected date.

---

## Local development

**Requirements:** Node.js 20+

```bash
git clone https://github.com/skybloouu/cosmic-journey.git
cd cosmic-journey
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Other commands

```bash
npm run build    # production build → dist/
npm run preview  # preview the production build locally
npm run lint     # run ESLint
```

---

## Deployment

The site is deployed automatically to **GitHub Pages** on every push to `main` via [GitHub Actions](.github/workflows/deploy.yml).

To deploy elsewhere, build with `npm run build` and serve the `dist/` folder. If hosting under a subpath, set the `base` option in `vite.config.js` to match your URL path.

---

## Project structure

```
src/
├── App.jsx                  # Main app shell and view switching
├── astroCalc.js             # Light-speed distance & milestone calculations
├── audio.js                 # Ambient cosmic drone (Web Audio API)
├── quotes.js                # Spiritual & philosophical quotes
└── components/
    ├── ChitaForm.jsx        # Landing form — name & date of passing
    ├── JourneyView.jsx      # Journey dashboard & timeline
    └── CosmicBackground.jsx # Animated starfield
```

---

## License

MIT — use freely, with care and respect for the subject matter.
