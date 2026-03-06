# NoteX 📝

A full-stack note-taking application with secure user authentication via OTP email verification.

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Backend | Node.js, Express |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Email Service | Resend (custom domain) |
| Hosting | Render (Frontend + Backend) |

## 🏗️ Architecture

```
[React Frontend] ──── HTTPS ────> [Express Backend] ──── Mongoose ────> [MongoDB Atlas]
   (Render)                           (Render)
                                          │
                                       Resend
                                    (OTP Emails)
```

## 🚀 Deployment

Both the frontend and backend are hosted on **Render** as separate web services and communicate over HTTPS.

### 🔐 Email Verification (OTP)

Email verification is handled via **[Resend](https://resend.com)** using a custom `.com.np` domain.

> **Why not SMTP/OAuth2?**  
> Render's free tier blocks standard SMTP ports. Using Resend with a custom domain is a reliable workaround that avoids the complexity of OAuth2 setup.

### ⚡ Keeping the Server Alive (Free Tier)

Render spins down free-tier web services after **15 minutes of inactivity**. To prevent this:

- A `/health` route is exposed on the backend
- **[UptimeRobot](https://uptimerobot.com)** pings this route at regular intervals, keeping the server alive 24/7

### 🧹 OTP Cleanup Job

MongoDB Atlas has storage limits on the free tier. To keep the database lean:

- Expired OTP records are automatically deleted on **server startup**
- A cleanup job runs **every 30 minutes** using `setInterval`

```js
// Runs at startup and every 30 minutes
await cleanupExpiredOTP();
setInterval(cleanupExpiredOTP, 30 * 60 * 1000);
```

## 🌐 Environment Variables

```env
PORT=
MONGO_URI=
RESEND_API_KEY=
CLIENT_URL=
```

## 📦 Getting Started

```bash
# Install dependencies
npm install

# Run the backend
npm start
```
