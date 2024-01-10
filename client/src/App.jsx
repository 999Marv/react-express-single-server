import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [val, setVal] = useState('yo');

  useEffect(() => {
    //users
    fetch('/api/users')
      .then((r) => r.json())
      .then((todos) => {
        console.log(todos);
        setVal(todos[0].content);
      });

    //fetch count
    fetch('/api/count')
      .then((res) => res.json())
      .then((count) => {
        setCount(count.count);
      });
  }, []);

  async function formHandler(e) {
    e.preventDefault();

    const opts = {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(e.target))),
    };

    const loggedInUser = await fetch('/api/login', opts).then((r) => r.json());
    console.log(loggedInUser);

    e.target.reset();
  }

  async function currentUser() {
    const user = await fetch('/api/me', { credentials: 'include' }).then((r) =>
      r.json()
    );
    console.log(user);
  }

  async function logOut() {
    const res = await fetch('/api/logout', { credentials: 'include' });
    console.log(res);
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <p>{val}</p>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <form onSubmit={formHandler}>
          <label htmlFor="name">Name:</label>
          <input type="text" name="name" />
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" />

          <button>Log In</button>
        </form>

        <button id="log-out" onClick={logOut}>
          Log Out
        </button>
        <button id="current" onClick={currentUser}>
          Current User
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
