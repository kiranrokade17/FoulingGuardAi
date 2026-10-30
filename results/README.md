# Results

This folder contains screenshots and output images from the FoulingGuard AI project.

## Suggested structure

```
results/
├── dashboard/
├── hull-analysis/
├── density-calculation/
├── 3d-visualization/
├── crowdsourced-map/
└── reports/
```

## How to add your result images

1. Copy your screenshots/images into the matching subfolder above.
2. Use clear file names, for example:
   - `dashboard-overview.png`
   - `hull-analysis-species-detected.png`
   - `density-otsu-result.png`
   - `3d-model-view.png`
3. Keep images reasonably small (under ~5 MB each) so the repo stays light.
4. Commit and push:

```powershell
git add results
git commit -m "Add project result screenshots"
git push
```

## What to capture

| Feature | What to screenshot |
| --- | --- |
| Dashboard | Report counts, charts, recent reports |
| Hull Analysis | Uploaded image + detected species + density |
| Density Calculation | Otsu threshold result and severity |
| 3D Visualization | Species 3D model viewer |
| Crowdsourced Map | Hotspot markers on the map |
| Reports | Generated report page / PDF |
