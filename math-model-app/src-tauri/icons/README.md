# App icons

Tauri needs real binary icon files here (`.png`, `.ico`, `.icns`). They are not
committed because they are generated assets. Create them in one command from any
square PNG (1024×1024 recommended):

```bash
npm run tauri icon ./public/icon-source.png
```

This generates `32x32.png`, `128x128.png`, `128x128@2x.png`, `icon.ico`,
`icon.icns` and the Windows Store / Android / iOS icon sets referenced by
`tauri.conf.json`.

> `npm run tauri:dev` works without these icons; they are only required for
> `npm run tauri:build` (producing installers).
