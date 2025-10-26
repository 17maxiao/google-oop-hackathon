import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch hello message from backend
    fetch('http://localhost:5001/api/hello')
      .then(response => response.json())
      .then(data => {
        setMessage(data.message);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching hello message:', error);
        setLoading(false);
      });

    // Fetch data items from backend
    fetch('http://localhost:5001/api/data')
      .then(response => response.json())
      .then(data => {
        setItems(data.items);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleTestPost = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/echo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: 'Hello from React!' }),
      });
      const data = await response.json();
      alert(`Backend received: ${JSON.stringify(data.received)}`);
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React + Python Backend</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <p>{message}</p>

            <div style={{ marginTop: '2rem' }}>
              <h2>Items from Backend:</h2>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {items.map(item => (
                  <li key={item.id} style={{ margin: '1rem 0' }}>
                    <strong>{item.name}</strong>: {item.description}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleTestPost}
              style={{
                marginTop: '2rem',
                padding: '0.5rem 1rem',
                fontSize: '1rem',
                cursor: 'pointer',
                backgroundColor: '#61dafb',
                border: 'none',
                borderRadius: '4px'
              }}
            >
              Test POST Request
            </button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
