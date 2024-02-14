import React, { Component } from 'react';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { ImageGallery } from './ImageGallery/ImageGallery.jsx';
import { Modal } from './Modal/Modal.jsx';
import { Searchbar } from './Searchbar/Searchbar.jsx';
import { Loader } from './Loader/Loader.jsx';
import { ButtonLoadMore } from './ButtonLoadMore/ButtonLoadMore.jsx';
import { GetFromApi } from './GetFromApi/GetFromApi.jsx';

import css from './App.module.css';

Notify.init({
  position: 'center-center',
});

export class App extends Component {
  state = {
    actualPage: 1,
    pictures: [],
    isModal: false,
    isLoader: false,
    searchQuery: '',
    totalHits: 0,
    totalPages: 0,
    bigPictureUrl: '',
    bigPictureTags: '',
  };

  handleSubmitForm = query => {
    window.scrollTo(0, 0);
    if (query.trim() === '') {
      Notify.warning("Search request shouldn't be empty");
      return;
    }
    this.setState({ searchQuery: query, actualPage: 1, pictures: [] });
  };

  async componentDidUpdate(_, prevState) {
    if (
      prevState.searchQuery !== this.state.searchQuery ||
      prevState.actualPage !== this.state.actualPage
    ) {
      this.setState({ isLoader: true });
      const response = await GetFromApi(
        this.state.searchQuery,
        this.state.actualPage
      );
      if (response) {
        this.setState(prevState => ({
          pictures: [...prevState.pictures, ...response.pictures],
          totalHits: response.totalHits,
          isLoader: false,
          totalPages: response.totalPages,
        }));

        if (response.pictures.length === 0) Notify.warning('No pictures found');

        if (response.pictures.length > 0 && this.state.actualPage === 1)
          Notify.success(
            `Found ${response.totalHits} pictures ${
              response.totalHits === 500 ? 'or more' : ''
            }`
          );
        if (
          this.state.actualPage === response.totalPages &&
          response.totalPages > 1
        )
          Notify.info(`This is the last page`);
      }
    }
  }

  toggleModalPict = () => {
    this.setState(({ isModal }) => ({
      isModal: !isModal,
    }));
  };

  handleModalPict = e => {
    if (e.target.nodeName === 'IMG') {
      const openPict = e.target.getAttribute('data-modal');
      const openPictTags = e.target.getAttribute('data-tags');
      this.setState({
        bigPictureUrl: openPict,
        bigPictureTags: openPictTags,
      });
      this.toggleModalPict();
    }
  };

  handleBtnLoadMore = () => {
    this.setState(prevState => {
      return { actualPage: prevState.actualPage + 1 };
    });
  };

  render() {
    const {
      actualPage,
      pictures,
      isModal,
      isLoader,
      totalHits,
      totalPages,
      bigPictureUrl,
      bigPictureTags,
    } = this.state;

    return (
      <div className={css.App}>
        <Searchbar onSubmit={this.handleSubmitForm} />
        {totalHits > 0 && (
          <ImageGallery pictures={pictures} onClick={this.handleModalPict} />
        )}
        {isLoader && <Loader />}
        {totalHits > 0 && actualPage < totalPages && (
          <ButtonLoadMore btnLoadMore={this.handleBtnLoadMore} />
        )}

        {isModal && (
          <Modal
            onClose={this.toggleModalPict}
            bigPictureUrl={bigPictureUrl}
            bigPictureTags={bigPictureTags}
          />
        )}
      </div>
    );
  }
}
