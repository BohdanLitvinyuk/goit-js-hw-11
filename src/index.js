// import axios from "axios";
// import SimpleLightbox from "simplelightbox";
// // Додатковий імпорт стилів
// import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const axios = require('axios').default;

const BASE_URL = `https://pixabay.com/api/`;

const API_KEY = `37825452-fa376d31b47a01c9c70144d21`;
let PAGE = 1;
let PER_PAGE = 40;
const form = document.querySelector(".search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn= document.querySelector(".load-more")

form.addEventListener('submit', onFormSubmit)
loadMoreBtn.addEventListener('click', onBtnClick);
loadMoreBtn.classList.add('is-hidden');

function onBtnClick() {
  PAGE+=1;
  axios.get(`${BASE_URL}?key=${API_KEY}&q=${form.searchQuery.value}&image_type=photo&orientation=horizontal&safesearch=true&page=${PAGE}&per_page=40`)
  .then(( {data} ) => {console.log(PAGE);
    if ( data.totalHits/40 <= PAGE  ){
      console.log("finish");
      console.log(data.totalHits/40 );
      loadMoreBtn.classList.add('is-hidden');
      Notify.failure("We're sorry, but you've reached the end of search results.");
    }
    loadMoreRenderedImageList(data.hits)})
    .catch(err => console.log(err));
 
 console.log(PAGE);
}

function onFormSubmit(event) {
    
    event.preventDefault();
   
     getElement(form.searchQuery.value);
  
     
}



async function getElement(searchEl) {

  gallery.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');
  await axios.get(`${BASE_URL}?key=${API_KEY}&q=${searchEl}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=1`)
    .then(({ data }) => {
      if (data.totalHits === 0 ) {
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        
      } else if (data.totalHits/40 <= PAGE){
        loadMoreBtn.classList.add('is-hidden');
        Notify.failure("We're sorry, but you've reached the end of search results.");
        // console.log(data);
        renderedImageList(data.hits);
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
      } else {
        console.log(data);
        renderedImageList(data.hits);
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
        loadMoreBtn.classList.remove('is-hidden');
       
      }
    });
    
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


 function loadMoreRenderedImageList(data) {
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