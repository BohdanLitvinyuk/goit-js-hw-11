
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const axios = require('axios').default;

const lightbox = new SimpleLightbox('.gallery .gallery_item');

const BASE_URL = `https://pixabay.com/api/`;

const API_KEY = `37825452-fa376d31b47a01c9c70144d21`;
let PAGE = 1;
let PER_PAGE = 40;
const form = document.querySelector(".search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn= document.querySelector(".load-more")

loadMoreBtn.classList.add('is-hidden');

form.addEventListener('submit', onFormSubmit)
loadMoreBtn.addEventListener('click', onBtnClick);

 


async function onBtnClick() {
  PAGE+=1;
  await axios.get(`${BASE_URL}?key=${API_KEY}&q=${form.searchQuery.value}&image_type=photo&orientation=horizontal&safesearch=true&page=${PAGE}&per_page=40`)
  .then(( {data} ) => {
    if ( data.totalHits/40 <= PAGE  )
    {
      loadMoreBtn.classList.add('is-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
    loadMoreRenderedImageList(data.hits)
    
  })
    .catch(err => console.log(err))
 
}

function onFormSubmit(event) {
    event.preventDefault();
     getElement(form.searchQuery.value);  
}



async function getElement(searchEl) {
  gallery.innerHTML = '';
  // loadMoreBtn.classList.add('is-hidden');
  await axios.get(`${BASE_URL}?key=${API_KEY}&q=${searchEl}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=1`)
    .then(({ data }) => {
      
      if (data.totalHits === 0 || searchEl === '') {
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        
      } else if (data.totalHits/40 <= PAGE){
        
        loadMoreBtn.classList.add('is-hidden');
        renderedImageList(data.hits);
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
        Notify.info("We're sorry, but you've reached the end of search results.");
        
        
      } else {
        renderedImageList(data.hits);
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
        loadMoreBtn.classList.remove('is-hidden');
       
      }
    });
    
}



async function renderedImageList(data) {
    const  markup =  await data.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => 
        `
        <div class="photo-card">
      <a class="gallery_item" href="${largeImageURL}">  
  <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
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
</div>
`).join('');
    gallery.innerHTML = markup;
    lightbox.refresh();
}


 function loadMoreRenderedImageList(data) {
  const  markup =  data.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => 
      ` <div class="photo-card">
      <a class="gallery_item" href="${largeImageURL}">
<img src="${webformatURL}" alt="${tags}" loading="lazy" /> </a>
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
</div>
`).join('');
  gallery.innerHTML += markup;
  lightbox.refresh();
}
