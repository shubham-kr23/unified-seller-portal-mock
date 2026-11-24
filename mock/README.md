# Presentation mock

This folder is a standalone HTML/CSS/JavaScript presentation mock of the Unified Seller portal. It does not call the Go backend and uses only populated in-browser demo data.

Dummy login:

- Email: `demo@unifiedseller.com`
- Password: `demo123`

Run locally from the repository root:

```bash
python3 -m http.server 4173 --directory mock
```

Then open [http://localhost:4173](http://localhost:4173).

The mock includes dashboard, orders, inventory, catalog, marketplace connections, automations, reports, CSV export, sync feedback, order acknowledgement, and a marketplace connection modal.
