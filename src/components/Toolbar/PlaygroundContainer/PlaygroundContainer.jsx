import './PlaygroundContainer.css';
import { memo } from 'react';
import { Pause, Play, Square, StepForward } from 'lucide-react';
import PlaygroundButton from './PlaygroundButton/PlaygroundButton';
import { useVisualization } from '../../../contexts/VisualizationContext';

const PlaygroundContainer = memo(function PlaygroundContainer() {
  const { play, stepForward, pause, reset, visualState } = useVisualization();

  return (
    <div className='playground-container'>
      <PlaygroundButton
        onClick={play}
        disabled={visualState === 'playing' || visualState === 'finished'}>
        <Play size={24} strokeWidth={3} color='#fff' />
      </PlaygroundButton>
      <PlaygroundButton
        onClick={stepForward}
        disabled={visualState === 'playing' || visualState === 'finished'}>
        <StepForward size={24} strokeWidth={3} color='#fff' />
      </PlaygroundButton>
      <PlaygroundButton onClick={pause} disabled={visualState !== 'playing'}>
        <Pause size={24} strokeWidth={3} color='#fff' />
      </PlaygroundButton>
      <PlaygroundButton onClick={reset} disabled={visualState === 'idle'}>
        <Square size={24} strokeWidth={3} color='#fff' />
      </PlaygroundButton>
    </div>
  );
});

export default PlaygroundContainer;
