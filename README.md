<<<<<<< HEAD
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
=======
Technology Used
Express , nodejs , mongoose , mongodb Atlas , React for Frontend

How is this live 
1. backend is hosted in Render as web service and communicates to frontend which is also hosted in render.
2. Verification email is sent via resend using a domain name (i used .com.np which i got for free) since SMTP ports are blocked for free tires in Render
    using OAUTH2 is better and login and registering this way is very annoying.
3. backend server which is inactive for more than 15 min goes down in Render to fix this problem i am pinging to my backend's /health Route from service called UPTIMEBOT
    which check if your site is up or not which is causing the site to be up 24/7.
4. I am cleaning expired OTP since, I have limited mongoDB atlas access so i am removing unnecessart things from my database which runs at start of server and every 30 mins.
5. 
>>>>>>> 7efc742377202af7f5fce08818c55d9b2aa0b062
