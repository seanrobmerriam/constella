# Accessibility pass (Phase 5b)

Requirement R-12. Run with `bun run test:a11y` after
`bun run --cwd apps/shared build`. CI runs it in the "Browser tests" job.

## Method

`tests/a11y/axe.spec.ts` loads each documented example alone, inside
a Section and container, with the built `constella.css` and the example's
behaviors started as its own script would start them. Then:

| Check         | Tool and rule set                                                                                            | States                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| axe           | axe-core 4.14.1 via @axe-core/playwright 4.14.0; tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` | Resting state, behaviors running; themes light, dark, brand |
| Reflow        | `scrollWidth - clientWidth <= 0` at a 320×640 viewport                                                       | Light                                                       |
| Focus visible | Tab through every stop (up to 40); each needs an outline or box-shadow                                       | Light                                                       |

That makes 90 axe runs, 30 reflow runs and 30 focus runs. Environment:
Chromium 153 (Playwright 1.65.0) on Linux, recorded during Phase 5b.

Keyboard behavior and focus management for interactive components are
covered by their own specs in `tests/components/` (tabs, dropdown, modal,
navbar, accordion, details, slider, marquee, form, skip).

## Findings

13 of the 90 axe runs failed on the first pass. All are fixed.

| Finding                               | Where                                                                                  | Measured    | Fix                                                                                                                                                                                          |
| ------------------------------------- | -------------------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Secondary text below 4.5:1            | Navbar links, footer links, unselected tabs (light, brand); select text (light, brand) | 3.71–4.18:1 | `--text-2` raised from 60% to 70% of `--text`: 4.85:1 or more on every theme background. Navbar, tabs, rich-text markers and dropdown hover used their own 60% mix; they now use `--text-2`. |
| Touch targets under 24px (WCAG 2.5.8) | Slider markers, all themes                                                             | 12×12px     | Marker buttons are 24×24px, with the 12px dot drawn by `::before`.                                                                                                                           |

Contrast was computed for 60–80% mixes on every theme background before
choosing 70%. The lowest at 70% is brand text on the brand's
`--background-2` (4.85:1).

No reflow or focus-visible failures. The first reflow run flagged the bleed
Slider, but that came from the test page lacking a `.container`. A bleed slider
assumes one, and real pages provide it, so the harness now does too.

The baseline fixture (`tests/fixtures/baseline.json`) was regenerated
deliberately: the only changed value is the select's text color alpha, 0.6 → 0.7.

## Limits

- No screen-reader testing (VoiceOver, NVDA, JAWS, TalkBack).
- Chromium only.
- Forced colors / Windows High Contrast not checked.
- Text spacing (1.4.12) and 200% text-only zoom not tested separately.
- axe can't judge everything: meaningful link text, heading order in real
  content, and whether a pattern suits the task still need a person.
