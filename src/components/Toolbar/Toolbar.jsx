import './Toolbar.css';
import { memo } from 'react';
import PlaygroundContainer from './PlaygroundContainer/PlaygroundContainer';
import HelperContainer from './HelperContainer/HelperContainer';

const Toolbar = memo(function Toolbar() {
  return (
    <div className='toolbar row-span-2 flex flex-col justify-between items-center px-4 py-6'>
      <PlaygroundContainer />
      <HelperContainer />
    </div>
  );
});

export default Toolbar;
