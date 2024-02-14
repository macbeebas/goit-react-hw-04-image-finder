import React from 'react';
import PropTypes from 'prop-types';
import css from './ButtonLoadMore.module.css';

export const ButtonLoadMore = ({ btnLoadMore }) => {
  return (
    <button className={css.btn} type="button" onClick={btnLoadMore}>
      Load more
    </button>
  );
};

ButtonLoadMore.propTypes = {
  btnLoadMore: PropTypes.func,
};
