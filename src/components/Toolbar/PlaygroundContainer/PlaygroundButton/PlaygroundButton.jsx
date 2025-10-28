import './PlaygroundButton.css';

function PlaygroundButton({ children, disabled }) {
  return (
    <div className='button-wrapper'>
      <button
        className='playground-button flex justify-center items-center'
        type='button'
        disabled={disabled}>
        {children}
      </button>
    </div>
  );
}

export default PlaygroundButton;
