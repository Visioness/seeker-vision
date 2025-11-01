import './App.css';
import { useState } from 'react';
import { SettingsProvider } from './contexts/SettingsContext';
import { VisualizationProvider } from './contexts/VisualizationContext';
import Toolbar from './components/Toolbar/Toolbar';
import Visualizer from './components/Visualizer/Visualizer';
import Legend from './components/Legend/Legend';

function App() {
  const [board, setBoard] = useState({
    state: null,
    dimensions: { rows: 0, cols: 0 },
  });
  console.log('App render');

  return (
    <div className='app grid grid-cols-[auto_1fr] grid-rows-[1fr_auto]'>
      <SettingsProvider>
        <VisualizationProvider board={board} setBoard={setBoard}>
          <Toolbar />
        </VisualizationProvider>
      </SettingsProvider>

      <Visualizer board={board} setBoard={setBoard} />

      <Legend />
    </div>
  );
}

export default App;
