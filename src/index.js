import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from "axios";
const axios = require('axios').default;

const BASE_URL = `https://pixabay.com/api/`;

const API_KEY = `37825452-fa376d31b47a01c9c70144d21`;

const form = document.querySelector(".search-form");
const gallery = document.querySelector(".gallery");

form.addEventListener('submit', onFormSubmit)
// document.addEventListener("scroll", update)
function onFormSubmit(event) {
    
    event.preventDefault();
    const searchEl = form.searchQuery.value
     getElement(searchEl);
    form.reset();
   
    
}

function update() {
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});  
}

async function getElement(searchEl) {
    gallery.innerHTML = '';
    await axios.get(`${BASE_URL}?key=${API_KEY}&q=${searchEl}&image_type=photo&orientation=horizontal&safesearch=true`)
        .then(({ data }) =>{ if (data.total === 0) {
          Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        } Notify.success(`Hooray! We found ${data.total} images.`);renderedImageList(data.hits)}  ).catch(error => console.log(error)) };



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