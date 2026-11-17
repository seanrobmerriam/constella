# Integration verification

Each integration the docs claim is backed by a fixture that builds and is
checked in a browser. `bun run test:integrations` builds the shared package
and every `@constella/fixture-*` workspace under `tests/fixtures/`, then runs
`tests/integrations/`. CI runs it in the "Browser tests" job.

## What every fixture renders

Every canonical example from `apps/shared/src/examples/`, each in a
`[data-example="<id>"]` wrapper, plus a theme toggle. The shared checks in
`tests/integrations/shared.ts`:

| Area       | Check                                                                          |
| ---------- | ------------------------------------------------------------------------------ |
| Loading    | Every example renders; no failed request, 4xx/5xx, page error or console error |
| Stylesheet | Button styles apply                                                            |
| Layout     | Grid lays out more than one column                                             |
| Forms      | Form sends with `fetch` and reaches `data-state="sent"`; range output updates  |
| Disclosure | Accordion keeps one item open                                                  |
| Navbar     | Menu toggles at 400px wide                                                     |
| Theme      | Toggle switches to dark; the choice survives a reload                          |
| Tabs       | Selecting a tab shows its panel                                                |
| Modal      | Opens from its trigger; Escape closes it and returns focus                     |

## Fixtures

| Fixture        | Path                            | Build                                                                                                                  | Served as                                                                                                       | Extra checks                                                                                                                                                                    |
| -------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Plain HTML     | `tests/fixtures/plain-html`     | `bun build.ts`: copies the dist files, pastes each `example.html` unchanged                                            | Static files                                                                                                    | The only scripts loaded are `behaviors/*.js`                                                                                                                                    |
| React          | `tests/fixtures/react`          | `vite build` in development mode, so `StrictMode` really mounts twice; renders every `Example.tsx` inside `StrictMode` | Static files (client-rendered SPA)                                                                              | Each effect ran twice, and afterwards one click opens the navbar and one arrow key moves one tab                                                                                |
| TanStack Start | `tests/fixtures/tanstack-start` | `vite build`; server-renders every `Example.tsx` and hydrates it                                                       | Production server: `bun serve.ts` on port 4341 (`dist/client` static, the rest through `dist/server/server.js`) | The server HTML links the stylesheet in `<head>` and has every example; styled with JavaScript off; no hydration warnings; a saved theme applies with the app's scripts blocked |
| SolidStart     | `tests/fixtures/solid-start`    | `bun convert.ts` (every `Example.tsx` to Solid, by the rules in the guide) then `vite build` with Nitro                | Production server: `node .output/server/index.mjs` on port 4342                                                 | The same server-rendering checks as TanStack Start; `bool:inert` leaves the attribute off when false; hiding a component inside `<Show>` runs its behavior's cleanup            |

Static fixtures (plain HTML, React) are served from a fake origin through Playwright's router
(`tests/integrations/serve-static.ts`), so every request is a real browser
request with its content type.

## Versions tested

Recorded during Phase 4a, on base commit `fa626c7`.

| Tool                 | Version       |
| -------------------- | ------------- |
| Bun                  | 1.4.4         |
| Vite                 | 8.3.6         |
| @vitejs/plugin-react | 6.3.0         |
| React, React DOM     | 19.3.1        |
| @playwright/test     | 1.65.0        |
| Chromium (local run) | 153.0.8010.12 |

Server-rendered fixtures run their production server, which Playwright starts
when `PW_INTEGRATIONS` is set.

CI installs Chromium with `playwright install chromium`, so its browser
version follows the Playwright release.

## Not covered yet

- Firefox and WebKit run in CI only (the "Other browsers" job): the agent
  container can't download them.
