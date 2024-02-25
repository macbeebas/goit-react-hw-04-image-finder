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

  // const [state, setState] = useState({
  // actualPage: 1,
  // pictures: [],
  // isModal: false,
  // isLoader: false,
  // searchQuery: '',
  // totalHits: 0,
  // totalPages: 0,
  // bigPictureUrl: '',
  // bigPictureTags: '',
  // });

  // const {
  //   actualPage,
  //   pictures,
  //   isModal,
  //   isLoader,
  //   searchQuery,
  //   totalHits,
  //   totalPages,
  //   bigPictureUrl,
  //   bigPictureTags,
  // } = state;

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
      console.log('57. response', response);
      console.log('58. searchQuery:', searchQuery, 'actualPage:', actualPage);
      if (response) {
        console.log('60. response:', response);
        setPictures(p => [...p, ...response.pictures]);
        setTotalHits(response.totalHits);
        setIsLoader(false);
        setTotalPages(response.totalPages);
        console.log(
          '67. states after response (pictures, totalHits, isLoader, totalPages):',
          pictures,
          totalHits,
          isLoader,
          totalPages
        );
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

  // render() {

  return (
    <div className={css.App}>
      <Searchbar onSubmit={handleSubmitForm} />
      {console.log('113. after "Searchbar"')}
      {console.log(
        'STATE: actualPage:',
        actualPage,
        ', pictures:',
        pictures,
        ', isModal:',
        isModal,
        ', isLoader:',
        isLoader,
        ', searchQuery:',
        searchQuery,
        ', totalHits:',
        totalHits,
        ', totalPages:',
        totalPages,
        ', bigPictureUrl:',
        bigPictureUrl,
        ', bigPictureTags:',
        bigPictureTags
      )}
      {totalHits > 0 && (
        <>
          <ImageGallery pictures={pictures} onClick={handleModalPict} />
          {console.log('118. after "ImageGallery"')}
          {console.log(
            'STATE: actualPage:',
            actualPage,
            ', pictures:',
            pictures,
            ', isModal:',
            isModal,
            ', isLoader:',
            isLoader,
            ', searchQuery:',
            searchQuery,
            ', totalHits:',
            totalHits,
            ', totalPages:',
            totalPages,
            ', bigPictureUrl:',
            bigPictureUrl,
            ', bigPictureTags:',
            bigPictureTags
          )}
        </>
      )}
      {isLoader && (
        <>
          <Loader />
          {console.log('125. after "Loader"')}
          {console.log(
            'STATE: actualPage:',
            actualPage,
            ', pictures:',
            pictures,
            ', isModal:',
            isModal,
            ', isLoader:',
            isLoader,
            ', searchQuery:',
            searchQuery,
            ', totalHits:',
            totalHits,
            ', totalPages:',
            totalPages,
            ', bigPictureUrl:',
            bigPictureUrl,
            ', bigPictureTags:',
            bigPictureTags
          )}
        </>
      )}

      {totalHits > 0 && actualPage < totalPages && (
        <>
          <ButtonLoadMore btnLoadMore={handleBtnLoadMore} />
          {console.log('133. after "ButtonLoadMore"')}
          {console.log(
            'STATE: actualPage:',
            actualPage,
            ', pictures:',
            pictures,
            ', isModal:',
            isModal,
            ', isLoader:',
            isLoader,
            ', searchQuery:',
            searchQuery,
            ', totalHits:',
            totalHits,
            ', totalPages:',
            totalPages,
            ', bigPictureUrl:',
            bigPictureUrl,
            ', bigPictureTags:',
            bigPictureTags
          )}
        </>
      )}

      {isModal && (
        <>
          <Modal
            onClose={toggleModalPict}
            bigPictureUrl={bigPictureUrl}
            bigPictureTags={bigPictureTags}
          />
          {console.log('145. after "Modal"')}
          {console.log(
            'STATE: actualPage:',
            actualPage,
            ', pictures:',
            pictures,
            ', isModal:',
            isModal,
            ', isLoader:',
            isLoader,
            ', searchQuery:',
            searchQuery,
            ', totalHits:',
            totalHits,
            ', totalPages:',
            totalPages,
            ', bigPictureUrl:',
            bigPictureUrl,
            ', bigPictureTags:',
            bigPictureTags
          )}
        </>
      )}

      {console.log(
        'STATE: actualPage:',
        actualPage,
        ', pictures:',
        pictures,
        ', isModal:',
        isModal,
        ', isLoader:',
        isLoader,
        ', searchQuery:',
        searchQuery,
        ', totalHits:',
        totalHits,
        ', totalPages:',
        totalPages,
        ', bigPictureUrl:',
        bigPictureUrl,
        ', bigPictureTags:',
        bigPictureTags
      )}
    </div>
  );
};
