import { Pause, Play, Square, StepForward } from 'lucide-react';
import PlaygroundButton from './PlaygroundButton/PlaygroundButton';
import './PlaygroundContainer.css';

function PlaygroundContainer() {
  return (
    <div className='playground-container'>
      <PlaygroundButton disabled={false}>
        <Play size={24} strokeWidth={3} color='#fff' />
      </PlaygroundButton>
      <PlaygroundButton disabled={false}>
        <StepForward size={24} strokeWidth={3} color='#fff' />
      </PlaygroundButton>
      <PlaygroundButton disabled={false}>
        <Pause size={24} strokeWidth={3} color='#fff' />
      </PlaygroundButton>
      <PlaygroundButton disabled={false}>
        <Square size={24} strokeWidth={3} color='#fff' />
      </PlaygroundButton>
    </div>
  );
}

export default PlaygroundContainer;
