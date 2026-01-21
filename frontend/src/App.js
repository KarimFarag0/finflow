import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from 'react';

function App() {
  //useState creates a state variable
  //message = current value 
  //setMessage = function to update the value
  //Loading... = starting value
  const [message, setMessage] = useState('Loading...');

  //useEfect runs code when the component loads
  //this is where we call the backend 
  useEffect(() => {
    //fetch() makes an HTTP request to the backend 
    // 'http://localhost:3001/api/health' = the backend URL we created
    fetch('http://localhost:3001/api/health')
    //.then(res => res.json()) = wait for response, convert to JSON
    .then(res => res.json())
    //.then (data => setMessage(data.status)) = update message with the response
    .then(data => setMessage(data.status))
    //.catch(err => ...) = if something goes wrong, show the error
    .catch(err => setMessage('Error:' + err.message));
  }, []); // [] = runs this ONCE when component loads

  //Return the HTML that shows on screen
  return (
    <div style={{padding: '20px', fontSize: '18px'}}>
      <h1>FinFlow</h1>
      <p>Backend says: {message}</p>
    </div>
  );
}

export default App;
