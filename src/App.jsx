import * as React from 'react';

const title = 'React';

function App() {
  // You can do something here

  return (
    <div>
      <h1>Hello {title}</h1>

      <label htmlFor="search">Search: </label>
      <input id="search" type="text" />
    </div>
  );
}

export default App;
