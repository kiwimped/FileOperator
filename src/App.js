import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
const app = "APP";
function App() {
  const [item, setItem] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [list, setList] = useState(
  
  <ul>
    
    {item.map((item, index) => (
      
      <li className='List'
        key={index}>{item}</li>
        
    ))}

  </ul>);

  const submission = (e) => {
    e.preventDefault();
    setItem([...item, newItem]);
    setNewItem('');
  }
  function itemText() {
    setList(<ul>
      
      {item.map((item, index) => (
        <li className='List-visible'
          key={index}>{item}</li>
      ))}
  
    </ul>)
  }
  return (
    <div className="App">
      <h1>Shopping List</h1>
      <form onSubmit={submission}>
        <input
          type="text"
          placeholder='Add item to list'
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        ></input>
        
        <button type='submit'>Submit to list</button>
        {item}
        <h2>List:</h2>
      
      </form>
      {list}
      <button className='List-visible'
          onClick={itemText}>Done Shopping</button>

    </div>

  );
}

export default App;
