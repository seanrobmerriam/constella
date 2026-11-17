# Expansion increment 2: Avatar, Breadcrumbs, Pagination

Requirement R-14 and Phase 7 of the [completion plan](../completion-plan.md).
The owner picked these three from the candidate catalog in
[`components.md`](../components.md) on 2026-11-17.

Each one goes through the component procedure in `AGENTS.md`: a stylesheet
with its header, an Astro component, an HTML and TSX example, a manifest entry,
a docs page, tests and a changelog line. Each gets one commit, in this order.
None of them needs a behavior module.

## Audit: what already exists

| Candidate   | Closest existing thing                                                     | Decision                                                                    |
| ----------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Avatar      | `Img`: any image, with no fixed size, crop or fallback.                    | New. Uses `Img` for the picture and adds a fixed size, a crop and initials. |
| Breadcrumbs | Navbar marks the current page with `aria-current="page"`. It has no trail. | New. Uses the same `aria-current` convention and the `SiteLink` contract.   |
| Pagination  | Nothing. The Slider's markers move between slides, not between pages.      | New. It renders links only, and the site decides the URLs.                  |

## 7c-1: Avatar

```html
<!-- A photo: the alt is the person's name -->
<span class="avatar">
  <img src="/ada.jpg" alt="Ada Lovelace" width="44" height="44" />
</span>

<!-- No photo: initials, named for screen readers -->
<span class="avatar" role="img" aria-label="Grace Hopper">GH</span>

<!-- Next to the name it shows: decorative -->
<span class="avatar small" aria-hidden="true">GH</span> Grace Hopper

<!-- A group -->
<div class="avatar_group" role="group" aria-label="Project members">
  <span class="avatar">…</span>
  <span class="avatar">…</span>
  <span class="avatar" role="img" aria-label="3 more">+3</span>
</div>
```

- **Sizes:** `small` 2rem, medium (the default) 2.75rem and `large` 4rem.
- **Shapes:** round by default; `square` uses `--radius-small`.
- **Image:** fills the circle and is cropped to it (`object-fit: cover`).
  Behind it is a `--background-3` disc, so the space isn't empty while the
  image loads.
- **Initials:** shown in `--text` on `--background-3`, in the text font,
  sized to fit the avatar.
- **Group:** avatars overlap, and each has a ring in the page's background
  color so they stay apart. The group needs a label.
- **Accessibility:** the avatar's name is its image's `alt`, or its
  `aria-label` when it shows initials. An avatar next to the visible name
  is decorative: use `alt=""` or `aria-hidden="true"`.
- **Astro:** `item/Avatar.astro` takes `name`, `src`, `size`, `shape`,
  `decorative` and `initials`. Initials come from the name unless you set
  them. `item/AvatarGroup.astro` takes a `label`.

## 7c-2: Breadcrumbs

```html
<nav class="breadcrumbs" aria-label="Breadcrumb">
  <ol class="breadcrumbs_list">
    <li class="breadcrumbs_item">
      <a class="breadcrumbs_link" href="/">Home</a>
    </li>
    <li class="breadcrumbs_item">
      <a class="breadcrumbs_link" href="/docs/">Docs</a>
    </li>
    <li class="breadcrumbs_item">
      <a class="breadcrumbs_link" href="/docs/install/" aria-current="page"
        >Install</a
      >
    </li>
  </ol>
</nav>
```

- This follows the WAI-ARIA breadcrumb pattern: a `nav` landmark labelled
  "Breadcrumb", an ordered list, and `aria-current="page"` on the last item.
- **Separators** are drawn in CSS: a small chevron made from borders, with no
  text. Screen readers don't read separators, and the CSS `content` alt-text
  syntax isn't supported by every browser Constella supports.
- **Colors:** earlier items use `--text-2` and are underlined on hover. The
  current item uses `--text`.
- **Narrow screens:** the list wraps. There's no collapse menu in this
  increment.
- **Astro:** `global/Breadcrumbs.astro` takes `items: SiteLink[]` (from
  `contracts/navigation.ts`) and a `label`. The last item is the current page.

## 7c-3: Pagination

```html
<nav class="pagination" aria-label="Pagination">
  <ul class="pagination_list">
    <li>
      <a class="pagination_link pagination_step" href="?page=2" rel="prev">
        <svg class="icon small pagination_icon" aria-hidden="true">…</svg>
        <span>Previous</span>
      </a>
    </li>
    <li>
      <a class="pagination_link" href="?page=1"
        ><span class="sr-only">Page </span>1</a
      >
    </li>
    <li><span class="pagination_gap" aria-hidden="true">…</span></li>
    <li>
      <a class="pagination_link" href="?page=3" aria-current="page">
        <span class="sr-only">Page </span>3
      </a>
    </li>
    …
  </ul>
</nav>
```

- **Links, not buttons:** every page has its own URL. Script-driven paging
  is out of scope.
- **The current page** has `aria-current="page"`, and is filled with `--text`
  behind `--background` text in every theme.
- **At the ends,** Previous on the first page and Next on the last are
  `<a role="link" aria-disabled="true">` with no `href`. They stay in place,
  so the layout doesn't jump, but they can't be focused or followed.
- **Targets** are at least 2.75rem square.
- **Page window:** the first page, the last page, and the current page with
  one page on each side. A gap that would hide only one page shows that page
  instead.
- **Narrow screens:** the list wraps and stays centred.
- **Astro:** `global/Pagination.astro` takes `current`, `total`,
  `href(page)` (default `?page=N`), `siblings`, `label`, `previousLabel` and
  `nextLabel`. It works with Astro's `paginate()`.

## Order

1. Avatar
2. Breadcrumbs
3. Pagination

Breadcrumbs and Pagination share a regression page,
`navigation-regression.astro`. Avatar joins Badge on
`feedback-regression.astro`.
