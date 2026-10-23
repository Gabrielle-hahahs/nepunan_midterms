# Tanza IT Equipment & Supply Management System

A responsive high-fidelity front-end prototype built with React, Vite, and Lucide icons.

## Run locally
1. Install Node.js (LTS).
2. Extract this project.
3. Open a terminal in the project folder.
4. Run `npm install`
5. Run `npm run dev`

## Deploy to Vercel
1. Upload/push the project folder to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Framework preset: **Vite**.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click **Deploy**.

## Prototype functionality
- Dashboard overview and alerts
- Equipment inventory with add/edit, search, and filters
- Borrowing records with borrower confirmation checkbox and return flow
- Repair reports with status updates
- Supply inventory with stock levels and low-stock indicator
- Reports page and print action
- Responsive sidebar for mobile screens

## Important limitations
This is a front-end prototype. Sample data and edits exist only in browser memory and reset on refresh. It does not include real authentication, database persistence, email/SMS, QR scanning, or legally binding digital signatures. Before real deployment for municipal use, connect a backend/database (for example Supabase) and implement secure authentication, role permissions, audit logs, backups, and a proper borrower acknowledgment workflow.
