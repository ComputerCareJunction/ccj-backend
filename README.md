# ccj-backend

## Dashboard API setup

Admin routes verify Firebase ID tokens for the `ccj-web` project. An authenticated Firebase user must either have the Firebase custom claim `admin: true` or their email must be included in the Worker `ADMIN_EMAILS` comma-separated variable. Configure the allowlist in Cloudflare before using the admin dashboard; access is denied by default when neither is configured.

The dashboard's **Firebase Users** screen lists Firebase Authentication accounts through the Identity Toolkit Admin API. Configure Worker secrets `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` from a service account in the `ccj-web` Google Cloud project. Grant that service account the `firebaseauth.users.get` permission (Firebase Authentication Viewer is sufficient); keep the private key only in Wrangler secrets. If users are already assigned as employees by email, the screen recognizes that existing association. Toggling employee assignment links by Firebase UID and creates or reactivates the D1 employee record.

After deploying code that adds a migration, apply it once to the remote D1 database:

```powershell
npm run d1:migrate:dashboard
npm run d1:migrate:firebase-employees
npm run d1:migrate:careers
npm run deploy
```

The migration is additive and creates the user, employee, and attendance tables while adding the dashboard fields used by existing products, contacts, tickets, and orders.

The careers migration creates the openings table and seeds the existing roles. Admins can manage openings under **Resources → Careers**; active openings are read by the public Careers page.