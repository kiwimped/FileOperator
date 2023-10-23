import React, { useState } from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [newitem, setNewitem] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const itemObj = { name: newitem, completed: false };
    setItems([...items, itemObj]);
    setNewitem('');
  };
  const markAsComplete = (index) => {
    const updateditems = [...items];
    updateditems[index].completed = !updateditems[index].completed;
    setItems(updateditems);
  };
  

  return (
    <div>
      <h1>Shopping List</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type an item"
          value={newitem}
          onChange={(e) => setNewitem(e.target.value)}
        />
        <button type="submit">Add item</button>
      </form>
      <ul>
  {items.map((itemObj, index) => (
    <li key={index}
        style={{ textDecoration: itemObj.completed ? 'line-through' : 'none' }}>
      {itemObj.name}
      <button onClick={() => markAsComplete(index)}>
        {itemObj.completed ? 'Undo' : 'Remove'}
      </button>
    </li>
  ))}
</ul>

    </div>
  );
}

export default App;
