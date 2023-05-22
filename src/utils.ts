import { MoviesInterface, ShowsInterface } from './interface';

export function getImagePath(imageId: string, format?: string) {
  return `https://image.tmdb.org/t/p/${format ? format : 'original'}${imageId}`;
}

export function isMovie(
  data: MoviesInterface | ShowsInterface
): data is MoviesInterface {
  return (data as MoviesInterface).title !== undefined;
}
