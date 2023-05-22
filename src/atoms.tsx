import { atom } from 'recoil';
import { MoviesInterface, ShowsInterface } from './interface';

export const clickedSliderState = atom<string>({
  key: 'clickedSliderState',
  default: '',
});

export const clickedMovieState = atom<MoviesInterface | null>({
  key: 'clickedMovieState',
  default: null,
});

export const clickedShowState = atom<ShowsInterface | null>({
  key: 'clickedShowState',
  default: null,
});
