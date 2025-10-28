import './HelperButton.css';

function HelperButton({ onOpen, children }) {
  return (
    <button
      className='helper-button flex justify-center items-center p-2 bg-neutral-800 hover:bg-neutral-700 border-2 border-neutral-600 rounded-full'
      type='button'
      onClick={onOpen}>
      {children}
    </button>
  );
}

export default HelperButton;
