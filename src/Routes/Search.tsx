import { AnimatePresence, motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  MoviesInterface,
  ShowsInterface,
  getMovieApiInterface,
  getShowApiInterface,
} from '../interface';
import { getMovieSearchResults, getShowSearchResults } from '../api';
import { getImagePath, isMovie } from '../utils';
import { useRecoilState } from 'recoil';
import { clickedMovieState, clickedShowState } from '../atoms';
import ShowDetail from '../Components/ShowDetail';
import MovieDetail from '../Components/MovieDetail';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 8rem;
  gap: 5rem;
`;

const Loader = styled.span`
  font-size: 2rem;
  margin-top: 40vh;
`;

const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;

  & > h1 {
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

const Results = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
  gap: 3rem;
  align-items: flex-start;
`;

const Result = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  cursor: pointer;

  & > img,
  & > div {
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 0.75rem;
    background-color: ${(props) => props.theme.black.darkest};
    object-fit: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform 0.3s, box-shadow 0.3s;
  }

  & > h2 {
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
    width: 100%;
    line-height: 1.5rem;
    overflow: hidden;
    color: ${(props) => props.theme.white.dark};
    transition: transform 0.3s, color 0.3s;
  }

  &:hover > img,
  &:hover > div {
    transform: scale(1.2);
  }

  &:hover > h2 {
    transform: translateY(-6.5rem) scale(1.2);
    color: ${(props) => props.theme.white.light};
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100vh;
  z-index: 9;
  background-color: rgba(0, 0, 0, 0.7);
`;

const Line = styled.hr`
  width: 100%;
  border-color: ${(props) => props.theme.white.darkest};
`;

function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get('keyword') || '';
  const type = new URLSearchParams(location.search).get('type') || '';
  const id = new URLSearchParams(location.search).get('id') || '';

  const [clickedMovie, setClickedMovie] = useRecoilState(clickedMovieState);
  const [clickedShow, setClickedShow] = useRecoilState(clickedShowState);

  const onContentClick = (content: MoviesInterface | ShowsInterface) => {
    if (isMovie(content)) {
      setClickedMovie(content);
      navigate(`/search?keyword=${keyword}&type=movie&id=${content.id}`);
    } else {
      setClickedShow(content);
      navigate(`/search?keyword=${keyword}&type=show&id=${content.id}`);
    }
  };

  const onOverlayClick = () => {
    navigate(`/search?keyword=${keyword}`);
  };

  const { data: movieSearch, isLoading: isMovieSearchLoading } =
    useQuery<getMovieApiInterface>(['movie-search', keyword], () =>
      getMovieSearchResults(keyword!)
    );

  const { data: showSearch, isLoading: isShowSearchLoading } =
    useQuery<getShowApiInterface>(['show-search', keyword], () =>
      getShowSearchResults(keyword!)
    );

  return (
    <Wrapper>
      {!keyword ? (
        <Loader>검색어를 입력하여 다시 검색해주세요.</Loader>
      ) : (
        <>
          <AnimatePresence>
            <Container>
              {isMovieSearchLoading || !movieSearch ? (
                <Loader>검색 중 입니다.</Loader>
              ) : movieSearch?.results.length === 0 ? (
                <Loader>검색 결과가 없습니다.</Loader>
              ) : (
                <>
                  <h1>{keyword}에 대한 영화 검색 결과</h1>
                  <Results>
                    {movieSearch?.results.map((movie) => (
                      <Result
                        onClick={() => onContentClick(movie)}
                        layoutId={'slider_search-movie_backdrop_' + movie.id}
                      >
                        {movie.backdrop_path || movie.poster_path ? (
                          <img
                            src={getImagePath(
                              movie.backdrop_path || movie.poster_path || ''
                            )}
                            alt={`${movie.title} 장면 이미지`}
                          />
                        ) : (
                          <div>이미지 없음</div>
                        )}
                        <h2 key={movie.id}>{movie.title}</h2>
                      </Result>
                    ))}
                  </Results>
                </>
              )}
            </Container>
            <Line />
            <Container>
              {isShowSearchLoading || !showSearch ? (
                <Loader>검색 중 입니다.</Loader>
              ) : showSearch.results.length === 0 ? (
                <Loader>
                  <Loader>검색 결과가 없습니다.</Loader>
                </Loader>
              ) : (
                <>
                  <h1>{keyword}에 대한 TV 프로그램 검색 결과</h1>
                  <Results>
                    {showSearch.results.map((show) => (
                      <Result
                        onClick={() => onContentClick(show)}
                        layoutId={'slider_search-show_backdrop_' + show.id}
                      >
                        {show.backdrop_path || show.poster_path ? (
                          <img
                            src={getImagePath(
                              show.backdrop_path || show.poster_path
                            )}
                            alt={`${show.name} 장면 이미지`}
                          />
                        ) : (
                          <div>이미지 없음</div>
                        )}
                        <h2 key={show.id}>{show.name}</h2>
                      </Result>
                    ))}
                  </Results>
                </>
              )}
            </Container>
          </AnimatePresence>
          <AnimatePresence>
            {type === 'movie' && id && (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <MovieDetail
                  sliderId={'search-movie'}
                  movieId={+id}
                  movieInfo={clickedMovie!}
                  from={`/search?keyword=${keyword}`}
                />
              </>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {type === 'show' && id && (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <ShowDetail
                  sliderId={'search-show'}
                  showId={+id}
                  showInfo={clickedShow!}
                  from={`search?keyword=${keyword}`}
                />
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Search;
