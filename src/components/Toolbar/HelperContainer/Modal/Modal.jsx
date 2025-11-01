import './Modal.css';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { SquareX } from 'lucide-react';

function Modal({ modalRef, type, onClose, children }) {
  useEffect(() => {
    if (type) modalRef.current?.showModal();
    else modalRef.current?.close();
  }, [type]);

  const handleBackdropClick = (e) => {
    const rect = modalRef.current.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      onClose();
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    onClose();
  };

  return createPortal(
    <dialog
      ref={modalRef}
      className='modal'
      onClick={handleBackdropClick}
      onCancel={handleCancel}>
      <div className='modal-header'>
        <h2 className='modal-title'>{type}</h2>
        <p className='modal-description'>
          {type === 'settings'
            ? 'Adjust the settings to customize your pathfinding experience.'
            : 'Learn how to use Seeker Vision to visualize pathfinding algorithms.'}
        </p>
      </div>
      <hr />
      <div className='modal-content'>{children}</div>
      <button className='close-button' type='button' onClick={onClose}>
        <SquareX size={24} strokeWidth={2} color='crimson' />
      </button>
    </dialog>,
    document.body
  );
}

export default Modal;
