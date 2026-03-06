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
