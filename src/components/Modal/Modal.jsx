import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import css from './Modal.module.css';

export const Modal = ({ onClose, bigPictureUrl, bigPictureTags }) => {
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  });

  const handleKeyDown = e => {
    if (e.code === 'Escape') onClose();
  };

  const handleBackdropClick = e => {
    if (e.currentTarget === e.target) onClose();
  };

  return (
    <div className={css.modalOverlay} onClick={handleBackdropClick}>
      <div className={css.modalPicture}>
        <img
          src={bigPictureUrl}
          alt={bigPictureTags}
          className={css.showPicture}
        />
        <button
          type="button"
          className={css.btnClose}
          aria-label="Close button"
          onClick={onClose}
        >
          <span>x</span>
        </button>
        {/* <div className={css.tagsBox}>{tags}</div> */}
      </div>
    </div>
  );
};

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  bigPictureUrl: PropTypes.string.isRequired,
  bigPictureTags: PropTypes.string,
};
