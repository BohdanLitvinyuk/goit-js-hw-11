// import axios from "axios";

import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const axios = require('axios').default;

const BASE_URL = `https://pixabay.com/api/`;

const API_KEY = `37825452-fa376d31b47a01c9c70144d21`;
let PAGE = 1;
const form = document.querySelector(".search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn= document.querySelector(".load-more")

form.addEventListener('submit', onFormSubmit)
loadMoreBtn.addEventListener('click', onBtnClick);


function onBtnClick() {

  axios.get(`${BASE_URL}?key=${API_KEY}&q=${form.searchQuery.value}&image_type=photo&orientation=horizontal&safesearch=true&page=${PAGE+=1}&per_page=40`)
  .then(({ data }) => {console.log(data);
    LoadMoreRenderedImageList(data.hits)})
    .catch(err => console.log(err));
 
 console.log(PAGE);
}

function onFormSubmit(event) {
    
    event.preventDefault();
   
     getElement(form.searchQuery.value);
  
    
}



async function getElement(searchEl) {

  gallery.innerHTML = '';
  
  await axios.get(`${BASE_URL}?key=${API_KEY}&q=${searchEl}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=1`)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        Notify.failure('Sorry, there are no images matching your search query. Please try again.')
      } else {
        console.log(data);
        renderedImageList(data.hits);
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
       
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


 function LoadMoreRenderedImageList(data) {
  const  markup =  data.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => 
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
  gallery.innerHTML += markup;
  
}