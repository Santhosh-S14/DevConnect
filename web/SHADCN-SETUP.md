# shadcn/ui setup (JSX React project)

## Steps performed

1. **Path alias** – In `vite.config.js`, added `resolve.alias` so `@` points to `./src`.

2. **jsconfig.json** – Created with `baseUrl: "."` and `paths: { "@/*": ["./src/*"] }` for `@/` imports.

3. **components.json** – Created shadcn config with **`"tsx": false`** so the CLI generates `.jsx` components. Set style, tailwind CSS path, base color (zinc), and path aliases.

4. **Theme CSS** – In `src/index.css`, added shadcn CSS variables in `:root` and `.dark` (Zinc/OKLCH), and `@theme inline` so Tailwind v4 exposes them (e.g. `bg-primary`, `text-foreground`).

5. **Utils** – Added `src/lib/utils.js` with the `cn()` helper (clsx + tailwind-merge).

6. **Button component** – Added `src/components/ui/button.jsx` (JSX, no TypeScript) with variants and sizes.

7. **Dependencies** – In `package.json`, added: `@radix-ui/react-slot`, `class-variance-authority`, `clsx`, `tailwind-merge`.

8. **App** – Updated `App.jsx` to import and use `Button` from `@/components/ui/button`.

## Add more components

```bash
npx shadcn@latest add <component-name>
```

Components will be added as `.jsx` because `tsx: false` is set in `components.json`.
