import React, {useState, useEffect} from 'react';
import {BrowserRouter, Switch, Route, Link} from 'react-router-dom';
import History from './History';
import Problem from './Problem';

function Game() {

  const [message, setMessage] = useState('');
  const [factors, setFactors] = useState({a:41, b:26});
  const [history, setHistory] = useState([]);

  const token = sessionStorage.getItem("jwt");
  
  useEffect( () => {
    fetchProblem();
    fetchHistory();
  }, [])

  const fetchProblem = () => {
    setMessage(''); 
    fetch('http://localhost:8080/multiplication/new', {
        headers: {'Authorization' : token}
    }
    )
    .then(response => response.json()) 
    .then(data => {
      setFactors({a:data.factorA, b:data.factorB});
    })
    .catch(err => console.log(err));
   }

   const postAttempt = (attempt) => {
    fetch ('http://localhost:8080/result', 
    {
      method: 'POST',
      headers: {
        'Authorization' : token,
        'Content-Type': 'application/json',
      }, 
      body: JSON.stringify({factorA:factors.a, factorB:factors.b, alias: '', attempt:attempt})
    })
    .then(response => response.json())
    .then(data => {
      if (data.correct) {
        setMessage('Correct.');
      } else {
        setMessage('Incorrect. Try again.');
      }
      fetchHistory();
    })
    .catch(err => console.error(err));
  }

  const fetchHistory = () => {
    fetch('http://localhost:8080/result' ,{
        headers: {'Authorization' : token}
    })
    .then(response => response.json())
    .then(data => setHistory(data))
    .catch(err => console.error(err));    
}


    return (
      <div className="App">
        <BrowserRouter>
        <Link to='/'>Play Game</Link>{' | '}<Link to='/history'>History</Link>
        <Switch>
          <Route exact path='/'>
            <Problem factors={factors} message={message} postAttempt={postAttempt} fetchProblem={fetchProblem} />
          </Route>
          <Route path='/history'>
            <History data={history}/>
          </Route>
        </Switch>
        </BrowserRouter>
      </div>
    )
}
export default Game;