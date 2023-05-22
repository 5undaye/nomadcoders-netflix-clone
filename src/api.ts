const API_KEY = 'd1a94d5df47ed7fb5dc2c16defe34faa';
const BASE_URL = 'https://api.themoviedb.org/3/';

export function getNowplayingMovies() {
  return fetch(
    `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=ko&page=1&region=kr`
  ).then((response) => response.json());
}

export function getPopularMovies() {
  return fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ko&page=1&region=kr`
  ).then((response) => response.json());
}

export function getTopRatedMovies() {
  return fetch(
    `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=ko&page=1&region=kr`
  ).then((response) => response.json());
}

export function getUpcomingMovies() {
  return fetch(
    `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=ko&page=1&region=kr`
  ).then((response) => response.json());
}

export function getMovieDetail(movieId: number) {
  return fetch(
    `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}

export function getMovieCredits(movieId: number) {
  return fetch(
    `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}

export function getOnTheAirShows() {
  return fetch(
    `${BASE_URL}/tv/on_the_air?api_key=${API_KEY}&language=ko&page=1&region=kr`
  ).then((response) => response.json());
}

export function getAiringTodayShows() {
  return fetch(
    `${BASE_URL}/tv/aring_today?api_key=${API_KEY}&language=ko&page=1`
  ).then((response) => response.json());
}

export function getPopularShows() {
  return fetch(
    `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=ko&page=1&region=kr`
  ).then((response) => response.json());
}

export function getTopRatedShows() {
  return fetch(
    `${BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=ko&page=1&region=kr`
  ).then((response) => response.json());
}

export function getShowDetail(showId: number) {
  return fetch(`${BASE_URL}/tv/${showId}?api_key=${API_KEY}&language=ko`).then(
    (response) => response.json()
  );
}

export function getShowCredits(showId: number) {
  return fetch(
    `${BASE_URL}/tv/${showId}/credits?api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}

export function getPersonImages(personId: number) {
  return fetch(`${BASE_URL}/person/${personId}/images?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getMovieSearchResults(keyword: string) {
  return fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&language=ko&query=${keyword}&page=1&include_adult=false`
  ).then((response) => response.json());
}

export function getShowSearchResults(keyword: string) {
  return fetch(
    `${BASE_URL}/search/tv?api_key=${API_KEY}&language=ko&query=${keyword}&page=1&include_adult=false`
  ).then((response) => response.json());
}
