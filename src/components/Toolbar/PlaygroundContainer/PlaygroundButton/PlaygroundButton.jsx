import './PlaygroundButton.css';

function PlaygroundButton({ children, disabled, onClick }) {
  return (
    <div className='button-wrapper'>
      <button
        type='button'
        className='playground-button flex justify-center items-center'
        disabled={disabled}
        onClick={onClick}>
        {children}
      </button>
    </div>
  );
}

export default PlaygroundButton;
