# ccj-backend

## Dashboard API setup

Admin routes verify Firebase ID tokens for the `ccj-web` project. An authenticated Firebase user must either have the Firebase custom claim `admin: true` or their email must be included in the Worker `ADMIN_EMAILS` comma-separated variable. Configure the allowlist in Cloudflare before using the admin dashboard; access is denied by default when neither is configured.

The dashboard's **Firebase Users** screen lists Firebase Authentication accounts. Configure Worker secrets `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` from a service account in the `ccj-web` Google Cloud project and grant it Firebase Authentication user-management permissions needed to list, create, retrieve, and update accounts. Keep the private key only in Wrangler secrets. User provisioning runs through the Firebase Admin SDK in this Worker and writes application access records to D1 without storing passwords. A retry safely completes the D1 write if Firebase account creation succeeded but the database was temporarily unavailable. Application access is checked against both the signed Firebase ID token and an active D1 record for password and Google sign-in. Admin APIs additionally require the configured admin claim/email allowlist and an active D1 record.

The Users screen displays application access state and allows admins to grant or revoke it. Existing Firebase accounts without an application record are denied at sign-in until an admin grants access. Firebase accounts created by the admin form are registered in both systems. Employee assignment remains separate and links by Firebase UID.

After deploying code that adds a migration, apply it once to the remote D1 database:

```powershell
npm run d1:migrate:dashboard
npm run d1:migrate:firebase-employees
npm run d1:migrate:careers
npm run d1:migrate:application-users
npm run d1:migrate:section-permissions
npm run deploy
```

Section permissions are stored on each application user as read/write grants for Products, Orders, Tickets, Users, Employees, Leads, and Resources. Write grants include read access. Admins always have full access; standard users receive no section grants until an admin configures them in the Users screen.

The migration is additive and creates the user, employee, and attendance tables while adding the dashboard fields used by existing products, contacts, tickets, and orders.

The careers migration creates the openings table and seeds the existing roles. Admins can manage openings under **Resources → Careers**; active openings are read by the public Careers page.