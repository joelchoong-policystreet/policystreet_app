# Design tokens

CSS custom properties are generated from `policystreet.tokens.json` into `_generated-tokens.scss` at build time (`npm run tokens:build`).

## Usage in component SCSS

Prefer tokens over hard-coded hex where a match exists:

| Token | Typical use |
|-------|-------------|
| `--ps-primary` | Primary buttons, links, active tabs |
| `--Font-Black` | Body/heading text |
| `--Accents-Blue-Grey` | Floating labels, muted field chrome |
| `--Accents-Alice-Blue-2` | Quote/policy card backgrounds |
| `--ps-glow-drop` | Header/footer shadows |
| `--ps-glow-card` | Elevated card shadow |
| `--Brand-White` / `--Background-White` | Surfaces |
| `--ps-text-heading` / `--Brand-PS-Dark-Blue` | Navy headings |

Example:

```scss
.my-card {
  background: var(--Accents-Alice-Blue-2, #ebf6ff);
  color: var(--Font-Black, #141414);
  box-shadow: var(--ps-glow-drop);
}
```

Always keep a hex fallback inside `var()` for safety during token refactors.

## Adding tokens

1. Edit `src/design-tokens/policystreet.tokens.json`
2. Run `npm run tokens:build`
3. Use the new `--*` name in SCSS

Do not edit `_generated-tokens.scss` directly.
