// import axios from "axios";

import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const axios = require('axios').default;
// const axios = require('axios/dist/browser/axios.cjs');

const BASE_URL = `https://pixabay.com/api/`;

const API_KEY = `37825452-fa376d31b47a01c9c70144d21`;

const form = document.querySelector(".search-form");
const gallery = document.querySelector(".gallery");

form.addEventListener('submit', onFormSubmit)

function onFormSubmit(event) {
    
    event.preventDefault();
    const searchEl = form.searchQuery.value
     getElement(searchEl);
    form.reset();
   
    
}



async function getElement(searchEl) {

  gallery.innerHTML = '';
  
  await axios.get(`${BASE_URL}?key=${API_KEY}&q=${searchEl}&image_type=photo&orientation=horizontal&safesearch=true`)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        Notify.failure('Sorry, there are no images matching your search query. Please try again.')
      } else {
        renderedImageList(data.hits);
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
        console.log(data)
      }
    })
}



async function renderedImageList(data) {
    const  markup =  await data.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => 
        `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b> ${likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${downloads}
    </p>
  </div>
</div>`).join('');
    gallery.innerHTML = markup;
    
}