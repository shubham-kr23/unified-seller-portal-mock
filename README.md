# Unified Seller presentation

This public repository hosts the standalone Unified Seller presentation mock. The same `mock/` folder is maintained in the main private repository for development and product context.

The presentation uses only populated in-browser demo data and does not call the Go backend.

## Demo login

- Email: `demo@unifiedseller.com`
- Password: `demo123`

## Run locally

```bash
python3 -m http.server 4173 --directory mock
```

Then open [http://localhost:4173](http://localhost:4173).

## GitHub Pages

Every push to `main` deploys the `mock/` folder through GitHub Actions.

Open the live presentation at [shubham-kr23.github.io/unified-seller-portal-mock](https://shubham-kr23.github.io/unified-seller-portal-mock/).
