import './HelperContainer.css';
import { memo, useRef, useState } from 'react';
import { BookText, Settings2 } from 'lucide-react';
import { useSettings } from '../../../contexts/SettingsContext';
import HelperButton from './HelperButton/HelperButton';
import Modal from './Modal/Modal';

const HelperContainer = memo(function HelperContainer() {
  const { algorithmName, changeAlgorithm, changeDelay, delay } = useSettings();
  const [visibleModal, setVisibleModal] = useState(null);
  const modalRef = useRef(null);

  return (
    <div className='helper-container flex flex-col gap-4'>
      <HelperButton onOpen={() => setVisibleModal('settings')}>
        <Settings2 size={24} strokeWidth={3} color='#fff' />
      </HelperButton>
      <HelperButton onOpen={() => setVisibleModal('tutorial')}>
        <BookText size={24} strokeWidth={3} color='#fff' />
      </HelperButton>

      {visibleModal && (
        <Modal
          modalRef={modalRef}
          type={visibleModal}
          onClose={() => setVisibleModal(null)}>
          {visibleModal === 'settings' ? (
            <>
              <div id='setting-algorithm' className='modal-section input-group'>
                <label htmlFor='algorithm-select'>Algorithm</label>
                <select
                  id='algorithm-select'
                  value={algorithmName}
                  onChange={(e) => changeAlgorithm(e.target.value)}>
                  <option value='dfs'>Depth First Search</option>
                  <option value='bfs'>Breadth First Search</option>
                </select>
              </div>

              <div id='setting-delay' className='modal-section input-group'>
                <label htmlFor='delay-range'>Delay</label>
                <div id='delay-range-container'>
                  <input
                    id='delay-range'
                    type='range'
                    min='20'
                    max='100'
                    step='20'
                    value={delay}
                    onChange={(e) => changeDelay(Number(e.target.value))}
                  />
                  <span id='delay-range-value'>{delay}ms</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div id='tutorial-getting-started' className='modal-section'>
                <h3>Getting Started</h3>
                <p>
                  Welcome to Path Vision! This interactive tool helps you
                  visualize pathfinding algorithms.
                </p>
              </div>

              <div id='tutorial-how-to-use' className='modal-section'>
                <h3>How to Use</h3>
                <ul>
                  <li>Select an algorithm from the settings</li>
                  <li>Adjust the visualization delay</li>
                  <li>Click to start the pathfinding process</li>
                </ul>
              </div>

              <div id='tutorial-more-coming-soon' className='modal-section'>
                <h3>More Coming Soon</h3>
                <p>
                  Detailed tutorials and interactive guides will be added in
                  future updates.
                </p>
              </div>
            </>
          )}
        </Modal>
      )}
    </div>
  );
});

export default HelperContainer;
