# Video Studio

- `VideoStudio.tsx`: viewport, active tab, history and authentication.
- `create/`: Create Video composer, inputs, settings and guidance.
- `motion-control/`: Motion Control entry point sharing the composer.
- `edit/`: tool selection and tutorial content.
- `edit/edit-video/`, `edit/extend-video/`: editing forms.
- `edit/reframe/`, `edit/upscale/`, `edit/remove-background/`, `edit/sdr-to-hdr/`, `edit/fps-boost/`, `edit/depth-map/`: individual tools and their settings.
- `edit/draw/`: draw-to-edit dialog.
- `edit/shared/`: video input state, picker tabs, model picker and form icons.
- `shared/`: common buttons, toggles, toast, media picker, icons and help.
- `assets/`: preset catalog, asset selection, preview, crop and download UI.
- `models/`: model and preset browsing.

Keep tool-specific state and UI together. Extract shared components only when their behavior and appearance are shared. Compatibility entry points preserve existing imports; new code should import from the owning folder directly.

Run `npm run check:structure` to enforce the 500-line source-file limit. Run `npx tsc --noEmit` after moving modules.
