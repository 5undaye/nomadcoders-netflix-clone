import { useQuery } from 'react-query';
import {
  getAiringTodayShows,
  getOnTheAirShows,
  getPopularShows,
  getTopRatedShows,
} from '../api';
import styled from 'styled-components';
import { getImagePath } from '../utils';
import { motion } from 'framer-motion';
import { useMatch, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { clickedShowState, clickedSliderState } from '../atoms';
import { getShowApiInterface } from '../interface';
import Slider from '../Components/Slider';

import InfoIcon from '@mui/icons-material/Info';
import ShowDetail from '../Components/ShowDetail';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.black.darkest};
`;

const Loader = styled.span`
  font-size: 1.5rem;
  width: 100%;
  height: 100%;
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

function Tv() {
  const { data: onTheAirData, isLoading: isOnTheAirLoading } =
    useQuery<getShowApiInterface>(['shows', 'onTheAir'], getOnTheAirShows);

  const { data: airingTodayData, isLoading: isAiringTodayLoading } =
    useQuery<getShowApiInterface>(
      ['shows', 'airingToday'],
      getAiringTodayShows
    );

  const { data: topRatedData, isLoading: isTopRatedLoading } =
    useQuery<getShowApiInterface>(['shows', 'topRated'], getTopRatedShows);

  const { data: popularData, isLoading: isPopularLoading } =
    useQuery<getShowApiInterface>(['shows', 'popular'], getPopularShows);

  const [clickedSlider, setClickedSlider] = useRecoilState(clickedSliderState);
  const [clickedShow, setClickedShow] = useRecoilState(clickedShowState);

  const navigate = useNavigate();

  const isTvMatch = useMatch('/show/:showId');
  const movieId = isTvMatch
    ? isTvMatch.params.showId
      ? parseInt(isTvMatch.params.showId)
      : 0
    : 0;

  const clickOverlay = () => {
    navigate('/show');
  };

  const onBannerClick = () => {
    if (onTheAirData) {
      setClickedSlider('banner');
      setClickedShow(onTheAirData.results[0]);
      navigate(`/show/${onTheAirData.results[0].id}`);
    }
  };

  return (
    <>
      <Wrapper>
        {isOnTheAirLoading ||
        isAiringTodayLoading ||
        isTopRatedLoading ||
        isPopularLoading ? (
          <Loader>로딩 중 입니다..</Loader>
        ) : (
          <>
            <Banner
              bgpath={getImagePath(
                onTheAirData?.results[0].backdrop_path ||
                  onTheAirData?.results[0].poster_path ||
                  ''
              )}
            >
              <Title>{onTheAirData?.results[0].name}</Title>
              <OverView>{onTheAirData?.results[0].overview}</OverView>
              <Button onClick={onBannerClick}>
                상세 정보
                <InfoIcon />
              </Button>
            </Banner>
            <Sliders>
              <Slider
                title="지금 방영 중인 TV 프로그램"
                sliderId="on-the-air"
                contents={onTheAirData ? onTheAirData.results.slice(1) : []}
              />
              {/* <Slider
                title="지금 뜨고 있는 TV 프로그램"
                sliderId="airing-today"
                contents={airingTodayData ? airingTodayData.results : []}
              /> */}
              <Slider
                title="평가가 좋은 TV 프로그램"
                sliderId="top-rated"
                contents={topRatedData ? topRatedData.results : []}
              />
              <Slider
                title="인기 있는 TV 프로그램"
                sliderId="popular"
                contents={popularData ? popularData.results : []}
              />
            </Sliders>
            {isTvMatch && (
              <>
                <Overlay
                  onClick={clickOverlay}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <ShowDetail
                  showId={movieId}
                  showInfo={clickedShow!}
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

export default Tv;
