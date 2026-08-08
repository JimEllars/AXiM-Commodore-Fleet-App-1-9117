# AXiM-Commodore-App-1-9117

Fleet dashboard built with React and Vite.

## Cloudflare Pages

The production site is deployed to the `axim-commodore-fleet-app-1-9117` Cloudflare Pages project.

```sh
npm run deploy:cloudflare
```

Use `npm run deploy:cloudflare:preview` to publish a preview deployment. The app uses the build-time variables in `.env`; `VITE_*` values are bundled into the browser, so do not store secrets in them.
