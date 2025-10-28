import './App.css';
import { useState } from 'react';
import Toolbar from './components/Toolbar/Toolbar';
import Board from './components/Board/Board';
import Legend from './components/Legend/Legend';

function App() {
  const [algorithm, setAlgorithm] = useState('DFS');
  const [delay, setDelay] = useState(100);

  console.log('App render');
  return (
    <div className='app grid grid-cols-[auto_1fr] grid-rows-[1fr_auto]'>
      <Toolbar
        onAlgorithmChange={setAlgorithm}
        onDelayChange={setDelay}
        delay={delay}
      />

      <Board />

      <Legend />
    </div>
  );
}

export default App;
