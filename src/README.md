# Frontend structure

The application uses a feature-first structure. Route files should compose features; reusable implementation belongs in the folders below.

```text
src/
├─ app/                     Next.js routes, layouts, and global styles
├─ components/
│  ├─ auth/                 Authentication dialog, media, and auth helpers
│  ├─ gallery/              Gallery cards, masonry layouts, tiles, and actions
│  ├─ home/                 Homepage-only sections and banners
│  ├─ image-studio/         Image Studio feature, panels, controls, and data
│  ├─ layout/               Site-wide header, footer, top bar, and providers
│  └─ ui/                   Small reusable visual components
├─ data/
│  ├─ content/              Site copy grouped by navigation, hero, sections, footer
│  └─ *.ts                  Feature media/example datasets
├─ hooks/                   Shared React hooks
├─ store/                   Redux store, slices, and typed hooks
└─ types/                   Project-wide TypeScript declarations
```

Each component domain exposes an `index.ts` public entry point. Pages should prefer imports such as `@/components/layout` and `@/components/gallery`; feature internals may use local relative imports.
