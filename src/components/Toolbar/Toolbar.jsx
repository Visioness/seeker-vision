import './Toolbar.css';
import PlaygroundContainer from './PlaygroundContainer/PlaygroundContainer';
import HelperContainer from './HelperContainer/HelperContainer';

function Toolbar({ onAlgorithmChange, onDelayChange, delay }) {
  console.log('Toolbar render');
  return (
    <div className='toolbar row-span-2 flex flex-col justify-between items-center px-4 py-6'>
      <PlaygroundContainer />
      <HelperContainer
        onAlgorithmChange={onAlgorithmChange}
        onDelayChange={onDelayChange}
        delay={delay}
      />
    </div>
  );
}

export default Toolbar;
