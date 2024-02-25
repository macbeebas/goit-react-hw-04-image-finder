import React, { useState, useEffect } from 'react';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { ImageGallery } from './ImageGallery/ImageGallery.jsx';
import { Modal } from './Modal/Modal.jsx';
import { Searchbar } from './Searchbar/Searchbar.jsx';
import { Loader } from './Loader/Loader.jsx';
import { ButtonLoadMore } from './ButtonLoadMore/ButtonLoadMore.jsx';
import { getFromPixabay } from './api/pixabay.js';

import css from './App.module.css';

Notify.init({
  position: 'center-center',
});

export const App = () => {
  const [actualPage, setActualPage] = useState(1);
  const [pictures, setPictures] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalHits, setTotalHits] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [bigPictureUrl, setBigPictureUrl] = useState('');
  const [bigPictureTags, setBigPictureTags] = useState('');

  const handleSubmitForm = query => {
    window.scrollTo(0, 0);
    if (query.trim() === '') {
      Notify.warning("Search request shouldn't be empty");
      return;
    }
    setSearchQuery(query);
    setActualPage(1);
    setPictures([]);
  };

  useEffect(() => {
    if (searchQuery === '') return;

    setIsLoader(true);

    async function getData() {
      const response = await getFromPixabay(searchQuery, actualPage);
      if (response) {
        setPictures(p => [...p, ...response.pictures]);
        setTotalHits(response.totalHits);
        setIsLoader(false);
        setTotalPages(response.totalPages);
        if (response.pictures.length === 0) Notify.warning('No pictures found');

        if (response.pictures.length > 0 && actualPage === 1)
          Notify.success(
            `Found ${response.totalHits} pictures ${
              response.totalHits === 500 ? 'or more' : ''
            }`
          );
        if (actualPage === response.totalPages && response.totalPages > 1)
          Notify.info(`This is the last page`);
      }
    }
    getData();
    // }, []);
  }, [searchQuery, actualPage]);

  const toggleModalPict = () => {
    setIsModal(p => (p = !isModal));
  };

  const handleModalPict = e => {
    if (e.target.nodeName === 'IMG') {
      const openPict = e.target.getAttribute('data-modal');
      const openPictTags = e.target.getAttribute('data-tags');
      setBigPictureUrl(openPict);
      setBigPictureTags(openPictTags);
      toggleModalPict();
    }
  };

  const handleBtnLoadMore = () => {
    setActualPage(p => p + 1);
  };

  return (
    <div className={css.App}>
      <Searchbar onSubmit={handleSubmitForm} />

      {totalHits > 0 && (
        <ImageGallery pictures={pictures} onClick={handleModalPict} />
      )}
      {isLoader && <Loader />}

      {totalHits > 0 && actualPage < totalPages && (
        <ButtonLoadMore btnLoadMore={handleBtnLoadMore} />
      )}

      {isModal && (
        <Modal
          onClose={toggleModalPict}
          bigPictureUrl={bigPictureUrl}
          bigPictureTags={bigPictureTags}
        />
      )}
    </div>
  );
};
