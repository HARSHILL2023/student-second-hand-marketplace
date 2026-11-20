# Student Second-Hand Marketplace

A campus marketplace where students can sell, give away or exchange second-hand
items. Built with Next.js 15 (App Router), MongoDB and JWT cookie authentication.

Everyone sees only the listings that are still available. Each user can create
and manage their own listings, save favorites, and send or answer enquiries with
optional price offers.

## Tech stack

- Next.js 15 App Router, React 19, plain JavaScript
- MongoDB Atlas (or a local MongoDB) through Mongoose
- Route Handlers under `app/api` for all data changes
- `bcryptjs` password hashing and a signed JWT in an HTTP-only cookie
- Cloudinary for optional image uploads (not required)

## 1. Install

```bash
npm install
```

## 2. Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Required | What it is |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Long random string used to sign login tokens |
| `NEXT_PUBLIC_APP_URL` | No | Public URL, used for display only |
| `CLOUDINARY_CLOUD_NAME` | No | Enables photo uploads |
| `CLOUDINARY_API_KEY` | No | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | No | Cloudinary API secret |

Create a JWT secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

`.env`, `.env.local` and every other `.env.*` file are git-ignored. Only
`.env.example` is committed, and it contains placeholders only.

### Using MongoDB Atlas

1. Create a free cluster at https://www.mongodb.com/atlas.
2. In **Database Access**, add a database user (for example `marketplace-app`)
   with a strong password. Do not reuse your Atlas login.
3. In **Network Access**, allow the IP addresses that will connect:
   - For local development add your own IP.
   - For Vercel you usually have no fixed IP, so add `0.0.0.0/0` (allow from
     anywhere). This is acceptable for a small assignment project because the
     database user still needs the password.
4. In **Connect > Drivers**, copy the `mongodb+srv://...` string, put the
   database user's password into it, and add a database name, for example:

```text
mongodb+srv://marketplace-app:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/student-marketplace?retryWrites=true&w=majority
```

For local development you can also use a local server:

```text
mongodb://127.0.0.1:27017/student_marketplace_dev
```

## 3. Run locally

```bash
npm run dev
```

Open http://localhost:3000.

## 4. Demo data (optional)

`npm run seed` adds demo accounts and 12 listings to an **empty** database.
It refuses to run again when listings already exist, so it will not duplicate
anything.

```bash
npm run seed
```

Demo accounts (all use the password `password123`):

| Email | Name |
| --- | --- |
| `aarav@example.com` | Aarav Patel |
| `riya@example.com` | Riya Sharma |
| `kabir@example.com` | Kabir Singh |
| `demo@example.com` | Demo Student (owns the reserved and sold demo items) |

The seed script reads `.env.local` automatically. On a hosted environment, run
it locally against the same `MONGODB_URI` (or pass the variable in the shell).

## 5. Image uploads (optional)

Photos are uploaded to Cloudinary and only the URL is stored in MongoDB. Create a
free Cloudinary account, then copy the cloud name, API key and API secret into
`.env.local`:

```text
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Without these values the upload route answers with a clear "not configured"
message, the form shows that message, and the listing is saved with a category
icon instead of a photo. The app never pretends an upload worked.

## 6. API routes

All routes return JSON. Login state comes from an HTTP-only cookie, never from
the request body.

| Method | Route | Notes |
| --- | --- | --- |
| POST | `/api/auth/register` | Creates an account and logs in |
| POST | `/api/auth/login` | Checks email and password |
| POST | `/api/auth/logout` | Clears the cookie |
| GET | `/api/auth/me` | Current user or `null` |
| GET | `/api/listings` | Public listing search, filters and sorting |
| GET | `/api/listings?mine=1` | Your own listings, all statuses (login required) |
| POST | `/api/listings` | Create a listing (login required) |
| GET | `/api/listings/[id]` | Listing, seller, similar items |
| PATCH | `/api/listings/[id]` | Edit your listing / change status |
| DELETE | `/api/listings/[id]` | Delete your listing and its favorites/enquiries |
| GET | `/api/favorites` | Your saved listings |
| POST | `/api/favorites` | Save a listing (`{ listingId }`) |
| DELETE | `/api/favorites/[id]` | Remove a saved listing (`[id]` is the listing id) |
| GET | `/api/enquiries` | `{ received, sent }` for the current user |
| POST | `/api/enquiries` | Send an enquiry (`{ listingId, message, offerPrice }`) |
| PATCH | `/api/enquiries/[id]` | Seller accepts/rejects an enquiry |
| GET | `/api/users/[id]` | Public seller profile and listings |
| POST | `/api/upload` | Upload one image (login required, Cloudinary needed) |

Ownership is checked on the server: editing, deleting and answering enquiries are
only allowed for the user who owns the record. Passwords are hashed with bcrypt
and never returned. Public seller data is limited to name, phone and join date.

## 7. Old localStorage demo data

The first version of this project stored everything in the browser under the
`student-marketplace` key. That data is **not** imported automatically, because
it has no real user accounts and no ownership information.

- The old data is still in your browser's localStorage and is untouched.
- The new app reads and writes only MongoDB.
- To keep demo content, run `npm run seed`, or create the listings again from
  the "Sell an Item" page.
- To remove the old data, open the browser console and run
  `localStorage.removeItem("student-marketplace")`.

## 8. Deploy to Vercel

1. Push the project to GitHub and import it in Vercel.
2. Add these environment variables in **Project Settings > Environment
   Variables** for Production (and Preview if you use previews):
   - `MONGODB_URI` (the full Atlas connection string, including the database name)
   - `JWT_SECRET` (a fresh long random string; do not reuse a test one)
   - `NEXT_PUBLIC_APP_URL` (for example `https://your-app.vercel.app`)
   - Cloudinary variables only if you want photo uploads.
3. Make sure the Atlas cluster allows connections from Vercel (usually
   `0.0.0.0/0` in Network Access) and that the database user exists.
4. Deploy. The app uses `secure` cookies automatically when `NODE_ENV` is
   `production`, so log in over HTTPS.

Environment variables are only read on the server; no secret is sent to the
browser.

## Security notes

- Input is validated again in the API routes, not only in the forms.
- Every user-specific record is scoped with the user id from the JWT.
- Login and registration have a small in-memory rate limit. Serverless
  instances do not share memory, so it is best-effort, not a guarantee.
- Enquiries and favorites are removed when the related listing is deleted.
- Inactive listings are private to their owner.

## Useful commands

```bash
npm run dev     # development server
npm run build   # production build check
npm start       # run the production build
npm run seed    # add demo accounts and listings to an empty database
```
