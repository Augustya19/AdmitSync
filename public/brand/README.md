# AdmitSync brand assets

This folder contains web-ready SVG assets for the current AdmitSync identity.

## Brand palette

- Cream: `#E9D9CA`
- Blue: `#4D6080`
- Orange: `#F4721E`
- White: `#FFFFFF` (site/background default)

The identity uses a blue high-contrast serif wordmark, an orange terminal dot, and a matching AS monogram.

## Files

- `wordmark.svg` — primary horizontal logo, transparent background
- `monogram.svg` — standalone AS monogram, transparent background
- `app-icon-blue.svg` — blue app tile with white AS and orange dot
- `app-icon-orange.svg` — orange app tile with white AS and orange dot
- `app-icon-cream.svg` — cream app tile with blue AS and orange dot
- `favicon.svg` — compact blue favicon
- `social-avatar.svg` — circular blue social avatar
- `brand.css` — CSS color tokens and font stack

## Use in a website

Copy the SVG files into your project's `public/brand/` directory.

```html
<img src="/brand/wordmark.svg" alt="AdmitSync" class="brand-logo">
```

```css
.brand-logo {
  display: block;
  width: 220px;
  height: auto;
}
```

Set the favicon in the document head:

```html
<link rel="icon" type="image/svg+xml" href="/brand/favicon.svg">
```

Import the design tokens:

```css
@import url("/brand/brand.css");
```

## Notes for implementation

- SVGs have transparent backgrounds except for app icon/avatar variants.
- SVGs are scalable and can be loaded directly by browsers, React, Next.js, and other common web stacks.
- The wordmark, monogram and icons are vector outlines drawn from Bodoni Moda 700 (SIL Open Font License), so they look the same on every device with no font installed.
- The orange tile uses a blue dot; an orange dot disappears on the orange background.
- The app icon versions are intended as visual brand assets; use the blue version as the default app tile.
