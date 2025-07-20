import React from 'react';
import '../../styles/Modal.scss';

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-labelledby="modal-title" aria-modal="true">
      <div className="modal-content">
        <button
          onClick={onClose}
          className="modal-close-button"
          aria-label="Close modal"
          type="button"
        >
          ×
        </button>
        <h2 id="modal-title" className="modal-title">{title}</h2>
        <div>{children}</div>
      </div>
    </div>
  );
};
export default Modal;