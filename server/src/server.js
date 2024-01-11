const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const bcrypt = require('bcrypt');

app.use(express.json());
app.use(cookieParser());

const distDir = path.join(__dirname, '..', '..', 'dist');
const staticAssets = express.static(distDir);
app.use(staticAssets);

const makeId = (
  (id = 1) =>
  () =>
    id++
)();

const users = [
  {
    id: makeId(),
    name: 'zo',
    password: '$2b$10$gZGM1.eXXx5mRkZf3ynA4eM73h3XwS0J3gVDb4Vw62TrN157aLcpi',
  },
  {
    id: makeId(),
    name: 'maya',
    password: '$2b$10$gZGM1.eXXx5mRkZf3ynA4eM73h3XwS0J3gVDb4Vw62TrN157aLcpi',
  },
  {
    id: makeId(),
    name: 'marvin',
    password: '$2b$10$aH9yDwxGjP4Gsi4I6LLz4.g5se9tRU2d48/s9MoYXts7L9PnIBxia',
  },
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

// old login code
// app.post('/api/login', async (req, res) => {
//   const { name, password } = req.body;

//   //bcrypt prac
//   const hash = await bcrypt.hash(password, 10);
//   const match = await bcrypt.compare(password, hash);

//   console.log(match);

//   // this is standing in for checking the database and using a real password hash
//   const user = users.find(
//     (user) => user.name === name && user.password === password
//   );

//   if (user) {
//     // in this example we are setting a cookie with the user id
//     // and a maxAge of 10 seconds, which means the cookie will delete itself in 10 seconds
//     // This is just for show, you for sure would want a longer lifespan in a real app
//     res.cookie('userId', user.id, { maxAge: 1000 * 5 });
//     // We're only saving the data we need to the cookie, which is the user id
//     // because if we have that, we can always just look up the user in the DB

//     res.send({ user });
//   } else {
//     res.status(401).send({ message: 'User not found' });
//   }
// });

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

//----------------------------------------------------------------------------------------

//create users
app.post('/api/users', async (req, res) => {
  const { name, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = { id: makeId(), name, password: hashedPassword };
  users.push(user);

  res.cookie('userId', user.id, { maxAge: 1000 * 60 * 60 * 24 * 7 });

  console.log(users);

  res.status(201).send(user);
});

const isValidPassword = async (password, hash) => {
  try {
    return bcrypt.compare(password, hash);
  } catch (err) {
    return console.error(err.message);
  }
};

//new login with encryption
app.post('/api/login', async (req, res) => {
  const { name, password } = req.body;

  let user;
  for (const currentUser of users) {
    const match = await isValidPassword(password, currentUser.password);
    if (currentUser.name === name && match) {
      user = currentUser;
      break; // Exit the loop once a match is found
    }
  }

  console.log(user);

  if (user) {
    res.cookie('userId', user.id, { maxAge: 1000 * 5 });
    res.send({ user });
  } else {
    res.status(401).send({ message: 'User not found' });
  }
});

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Up! http://localhost:${port}`));
