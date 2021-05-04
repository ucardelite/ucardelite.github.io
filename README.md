**How to launch the app?**

1. Create firebase app, realtime database and storage instances at firebase.com
2. Set security rules for realtime database in your firebase dashboard. These security rules are stored in react app root folder: databaseSecurityRules.json file. Just copy paste them.
3. Find your firebase configuration json object on copy paste it into react app src/firebaseConfig.json file.
4. Set environment variable REACT_APP_API_URL to the url where your netlify functions are deployed. If you have not deployed yet, you can use https://cards-service.netlify.app
5. npm install
6. npm run start
7. Create account. The first account gets admin role and can edit web assets such as metals, borders, discounts, etc.
8. Go to admin dashboard and set instagram access token. [Here is how to get yours](https://medium.com/the-innovation/embed-your-instagram-feed-in-2020-68cefb93c650)
