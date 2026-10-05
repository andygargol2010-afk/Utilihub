# HouseModeler3D restore

A failed large-file push temporarily replaced `src/components/general/HouseModeler3D.tsx`.

## Restore the modeler (run locally)

```bash
git fetch origin
git checkout 9e7cfe5f989adf28455adb0fb164c6d2e7c6e3ef -- src/components/general/HouseModeler3D.tsx
git commit -m "restore: HouseModeler3D.tsx from last good commit"
```

Or in GitHub: browse that commit, open the file, and restore.

## Lock + layers

After restore, apply `docs/house-modeler-lock-layers.patch` or ask Grok to re-apply the feature on the restored file.
