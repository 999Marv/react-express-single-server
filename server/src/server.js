const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.json());
app.use(cookieParser());

const distDir = path.join(__dirname, '..', '..', 'dist');
const staticAssets = express.static(distDir);
app.use(staticAssets);

const users = [
  { id: 1, name: 'zo', password: 'abc' },
  { id: 2, name: 'maya', password: 'abc' },
];

app.get('/api/users', (req, res) => {
  res.send(users);
});

// after you add all your routes make sure to add this
// so that your frontend React router works and you still get the right 404s (both API and client routes)

app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Set up a route for handling GET requests to '/api/count'
app.get('/api/count', (req, res) => {
  // Retrieve the 'count' cookie from the request, convert it to a number,
  // and increment it by 1. If the cookie is not present, set count to 1.
  let count = Number(req.cookies.count) + 1 || 1;

  // Set the 'count' cookie in the response with the updated value
  res.cookie('count', count);

  // Increment the count variable (local variable) by 1
  count++;

  // Send a JSON response containing the updated count value
  res.send({ count });
});

//login
app.post('/api/login', (req, res) => {
  const { name, password } = req.body;

  // this is standing in for checking the database and using a real password hash
  const user = users.find(
    (user) => user.name === name && user.password === password
  );

  if (user) {
    // in this example we are setting a cookie with the user id
    // and a maxAge of 10 seconds, which means the cookie will delete itself in 10 seconds
    // This is just for show, you for sure would want a longer lifespan in a real app
    res.cookie('userId', user.id, { maxAge: 1000 * 5 });
    // We're only saving the data we need to the cookie, which is the user id
    // because if we have that, we can always just look up the user in the DB

    res.send({ user });
  } else {
    res.status(401).send({ message: 'User not found' });
  }
});

// This is just showing us the current user by reading the cookie!
app.get('/api/me', (req, res) => {
  const user = users.find((user) => user.id === Number(req.cookies.userId));

  user
    ? res.send({ user })
    : res.status(404).send({ message: 'User not found' });
});

// If we know we're logged in by the existence of the cookie, then logging out
// is as simple as deleting it!
app.get('/api/logout', (req, res) => {
  res.clearCookie('userId');
  res.sendStatus(204);
});

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Up! http://localhost:${port}`));
