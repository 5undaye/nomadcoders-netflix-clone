import { useQuery } from 'react-query';
import {
  getNowplayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from '../api';
import styled from 'styled-components';
import { getImagePath } from '../utils';
import { motion } from 'framer-motion';
import { useMatch, useNavigate } from 'react-router-dom';
import MovieDetail from '../Components/MovieDetail';
import { useRecoilState } from 'recoil';
import { clickedMovieState, clickedSliderState } from '../atoms';
import {
  getMovieApiInterface,
  getNowPlayingMovieInterface,
} from '../interface';
import Slider from '../Components/Slider';

import InfoIcon from '@mui/icons-material/Info';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.black.darkest};
`;

const Loader = styled.span`
  font-size: 2rem;
  margin-top: 50vh;
`;

const Banner = styled(motion.div)<{ bgpath: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem;
  gap: 1.5rem;
  background-image: linear-gradient(
      rgba(0, 0, 0, 0.75),
      rgba(0, 0, 0, 0.25),
      rgba(0, 0, 0, 0.75),
      rgba(0, 0, 0, 1)
    ),
    url(${(props) => props.bgpath});
  background-size: cover;
  background-position: center;
`;

const Title = styled.h2`
  font-size: 4rem;
  font-weight: 100;
  width: 55vw;
`;

const OverView = styled.p`
  font-size: 1.25rem;
  line-height: 1.5;
  width: 40vw;
  word-break: keep-all;
  opacity: 0.85;
`;

const Button = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem;
  font-size: 1.25rem;
  font-weight: 400;
  width: fit-content;
  border-radius: 0.5rem;
  gap: 0.5rem;
  border: none;
  background-color: ${(props) => props.theme.white.darkest};
  color: ${(props) => props.theme.white.light};
  box-shadow: 0 0.15rem 0.3rem rgba(0, 0, 0, 0.15);
  transition: background-color 0.3s, color 0.3s;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const Sliders = styled.div`
  margin-top: 75vh;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15rem;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
`;

function Home() {
  const { data: nowPlayingData, isLoading: isNowPlayingLoading } =
    useQuery<getNowPlayingMovieInterface>(
      ['movies', 'nowPlaying'],
      getNowplayingMovies
    );

  const { data: popularData, isLoading: isPopularLoading } =
    useQuery<getMovieApiInterface>(['movies', 'popular'], getPopularMovies);

  const { data: topRatedData, isLoading: isTopRatedLoading } =
    useQuery<getMovieApiInterface>(['movies', 'topRated'], getTopRatedMovies);

  const { data: upcomingData, isLoading: isUpcomingLoading } =
    useQuery<getMovieApiInterface>(['movies', 'upcoming'], getUpcomingMovies);

  const [clickedSlider, setClickedSlider] = useRecoilState(clickedSliderState);
  const [clickedMovie, setClickedMovie] = useRecoilState(clickedMovieState);

  const navigate = useNavigate();

  const isMovieMatch = useMatch('/movie/:movieId');
  const movieId = isMovieMatch
    ? isMovieMatch.params.movieId
      ? parseInt(isMovieMatch.params.movieId)
      : 0
    : 0;

  const clickOverlay = () => {
    navigate('/');
  };

  const onBannerClick = () => {
    if (nowPlayingData) {
      setClickedSlider('banner');
      setClickedMovie(nowPlayingData.results[0]);
      navigate(`/movie/${nowPlayingData.results[0].id}`);
    }
  };

  return (
    <>
      <Wrapper>
        {isNowPlayingLoading ||
        isPopularLoading ||
        isTopRatedLoading ||
        isUpcomingLoading ? (
          <Loader>데이터를 가져오는 중...</Loader>
        ) : (
          <>
            <Banner
              bgpath={getImagePath(
                nowPlayingData?.results[0].backdrop_path ||
                  nowPlayingData?.results[0].poster_path ||
                  ''
              )}
            >
              <Title>{nowPlayingData?.results[0].title}</Title>
              <OverView>{nowPlayingData?.results[0].overview}</OverView>
              <Button onClick={onBannerClick}>
                상세 정보
                <InfoIcon />
              </Button>
            </Banner>
            <Sliders>
              <Slider
                title="지금 상영 중인 영화"
                sliderId="now-playing"
                contents={nowPlayingData ? nowPlayingData.results.slice(1) : []}
              />
              <Slider
                title="인기 있는 영화"
                sliderId="popular"
                contents={popularData ? popularData.results : []}
              />
              <Slider
                title="평가가 좋은 영화"
                sliderId="top-rated"
                contents={topRatedData ? topRatedData.results : []}
              />
              <Slider
                title="개봉 예정 영화"
                sliderId="upcoming"
                contents={upcomingData ? upcomingData.results : []}
              />
            </Sliders>
            {isMovieMatch && (
              <>
                <Overlay
                  onClick={clickOverlay}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <MovieDetail
                  movieId={movieId}
                  movieInfo={clickedMovie!}
                  sliderId={clickedSlider}
                />
              </>
            )}
          </>
        )}
      </Wrapper>
    </>
  );
}

export default Home;
