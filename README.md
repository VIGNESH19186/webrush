# LIFE//TRACE

A frontend-only hackathon project that turns fictional digital-life receipts into a discoverable story.

## Stack

- React
- Vite
- JavaScript
- CSS
- Local JSON data
- No backend / database / external API

## Run

```bash
npm install
npm run dev
```

Then open the local Vite URL.

## Build

```bash
npm run build
npm run preview
```

## Architecture

`src/data/receipts.json` is the replaceable mock dataset.

`src/utils/insights.js` contains the deterministic insight engine:
- `calculateStatistics`
- `findConnections`
- `calculateConnectionScore`
- `findPatterns`
- `generateChapters`
- `groupByDate`
- `groupByLocation`

The connection score is intentionally transparent rather than pretending to be AI:

- Same date +1
- Same location +2
- Within 60 minutes +2
- Shared keyword +2 each, capped
- Same event +3

The graph, overview statistics, chapters and discoveries are generated from the dataset.

## UX

- Desktop sidebar
- Mobile bottom navigation
- Search and category filtering
- Sorting
- Interactive SVG connection graph
- Receipt detail modal
- Pattern-derived discoveries
- Narrative chapters
- Location network map
- Replay mode
- Keyboard-friendly controls
- Escape-to-close modal
- Reduced-motion support

## Replacing the dataset

Keep the fields:

```js
{
  id,
  type,
  title,
  description,
  date,
  time,
  timestamp,
  location,
  keywords,
  metadata
}
```

Use these types:

`MUSIC`, `MOVIES`, `PLACE`, `PURCHASE`, `PHOTO`, `MESSAGE`, `SEARCH`, `EVENT`, `NOTE`.

No UI component needs to be rewritten when the mock JSON is replaced with the real hackathon dataset.
