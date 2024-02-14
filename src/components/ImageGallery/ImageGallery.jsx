import React from 'react';
import { nanoid } from 'nanoid';
import { ImageGalleryItem } from '../ImageGalleryItem/ImageGalleryItem.jsx';
import PropTypes from 'prop-types';
import css from './ImageGallery.module.css';

export const ImageGallery = ({ isImagesLoaded, onClick, pictures }) => {
  return (
    <ul className={css.galleryList}>
      {isImagesLoaded && <p>loaded...</p>}
      {pictures?.map(({ id, webformatURL, largeImageURL, tags }) => (
        <ImageGalleryItem
          id={id}
          webformatURL={webformatURL}
          largeImageURL={largeImageURL}
          tags={tags}
          onClick={onClick}
          key={nanoid()}
        />
      ))}
    </ul>
  );
};

ImageGallery.propTypes = {
  pictures: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      webformatURL: PropTypes.string.isRequired,
      largeImageURL: PropTypes.string.isRequired,
      tags: PropTypes.string,
    })
  ),
  onClick: PropTypes.func.isRequired,
};
