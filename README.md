# 🎃 TripOnTap Travels — Haunted Holidays Edition

A frontend travel & tour booking website reskinned with a polished Halloween theme, 
built entirely with vanilla HTML, CSS and JavaScript (no frameworks, no build step).

## ✨ Features

- **Dark / Light theme toggle** — persisted via `localStorage`, with a dedicated 
  "haunted parchment" light palette (not just an inverted dark mode)
- **Canvas particle system** — bats, ghosts and falling leaves drifting across 
  every page using `requestAnimationFrame`
- **Glowing cursor trail** — canvas-based, desktop-only (`pointer: fine` aware)
- **Procedural ambient audio** — a "Spooky Mode" toggle generates a layered drone 
  + random creak sounds using the Web Audio API (oscillators, no audio files)
- **Scroll-reveal animations** via `IntersectionObserver`
- **Destinations page**: live search, sort by budget/name, filter by destination 
  type (beach, mountains, nature, city, adventure, international) and budget tier, 
  with result counts and an empty-state message
- **Trip planning, booking & saved-trips flow** using `localStorage`
- Fully responsive layout, accessible color contrast, `prefers-reduced-motion` support

## 🛠️ Tech Stack

- HTML5
- CSS3 (custom properties / CSS variables for theming, no preprocessor)
- Vanilla JavaScript (ES6+, no dependencies)


## 🚀 Getting Started

No build tools required — just open `index.html` in a browser, or serve the 
folder with any static server:

```bash
npx serve .
```

## 📸 Preview
<img width="1908" height="889" alt="image" src="https://github.com/user-attachments/assets/d0d787bf-038a-4ab7-a307-3847ef910c56" />

