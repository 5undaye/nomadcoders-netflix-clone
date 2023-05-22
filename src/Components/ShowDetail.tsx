import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getImagePath } from '../utils';
import { useQuery } from 'react-query';
import { getShowCredits, getShowDetail } from '../api';
import {
  CreditsInterface,
  ShowDetailInterface,
  ShowsInterface,
} from '../interface';

import CloseIcon from '@mui/icons-material/Close';
import StarRateIcon from '@mui/icons-material/StarRate';
import Person from './Person';

interface ShowDetailPropsInterface {
  showId: number;
  sliderId?: string;
  showInfo: ShowsInterface;
  from?: string;
}

const Wrapper = styled(motion.div)`
  position: fixed;
  width: 40vw;
  height: 80vh;
  background-color: ${(props) => props.theme.black.dark};
  top: 10vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 0.75rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2);
  overflow-y: overlay;
  z-index: 99;
`;

const CloseBtn = styled.button`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 1rem;
  right: 1rem;
  background-color: rgba(0, 0, 0, 0.5);
  width: 2rem;
  height: 2rem;
  border-radius: 1rem;
  color: ${(props) => props.theme.white.light};
  border: none;
  cursor: pointer;
  z-index: 9;
`;

const CoverImage = styled.div<{ bgPath: string }>`
  width: 100%;
  aspect-ratio: 1.5;
  background: linear-gradient(
      #18181815,
      #181818af,
      ${(props) => props.theme.black.dark}
    ),
    url(${(props) => props.bgPath});
  background-size: cover;
  background-position: center;
`;

const DetailContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  position: relative;
  gap: 1rem;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 600;
`;

const SubTitle = styled.h3`
  width: 100%;
  font-size: 1.2rem;
  font-weight: 400;
  text-align: center;
  word-break: keep-all;
  margin-bottom: clamp(0.4rem, 1vw, 0.72rem);
  color: ${(props) => props.theme.white.dark};
`;

const Genres = styled.ul`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Genre = styled.li`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: ${(props) => props.theme.black.light};
  color: ${(props) => props.theme.white.dark};
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const DetailOverview = styled.p`
  width: 100%;
  height: 100%;
  font-size: 1rem;
  line-height: 1.5;
  overflow: hidden;
  color: ${(props) => props.theme.white.darker};
  margin-bottom: 1rem;
`;

const Rating = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  width: 100%;
`;

const Stars = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 2rem;

  & > :last-child {
    color: ${(props) => props.theme.red};
  }
`;

const CharacterInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  font-size: 1.2rem;
  gap: 1rem;
  color: ${(props) => props.theme.white.light};
`;

const CharacterSlide = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  width: 100%;
  overflow-x: auto;
  padding-bottom: 0.5rem;

  &::-webkit-scrollbar {
    width: 0.1rem;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.black.light};
    border-radius: 0.5rem;
    background-clip: padding-box;
    border: 0.3rem solid transparent;
  }
`;

function ShowDetail({
  showId,
  sliderId,
  showInfo,
  from,
}: ShowDetailPropsInterface) {
  const navigate = useNavigate();

  const { data: showDetail, isLoading: isShowDetailLoading } =
    useQuery<ShowDetailInterface>(['show-detail', showId], () =>
      getShowDetail(showId)
    );

  const { data: showCredits, isLoading: isShowCreditsLoading } =
    useQuery<CreditsInterface>(['show-credits', showId], () =>
      getShowCredits(showId)
    );

  const clickCloseBtn = () => {
    navigate('/show');
  };

  return (
    <Wrapper
      layoutId={'slider_' + sliderId + '_backdrop_' + showId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ y: window.innerHeight }}
      transition={{ type: 'tween', duration: 0.5 }}
    >
      <CloseBtn onClick={clickCloseBtn}>
        <CloseIcon />
      </CloseBtn>
      <CoverImage
        bgPath={getImagePath(
          showInfo
            ? showInfo.backdrop_path || showInfo.poster_path
            : showDetail
            ? showDetail.backdrop_path || showDetail.poster_path
            : ''
        )}
      />
      <DetailContainer>
        <Title>
          {showInfo ? showInfo.name : showDetail ? showDetail.name : ''}
        </Title>
        {!isShowDetailLoading && showDetail && (
          <>
            {showDetail.tagline && <SubTitle>{showDetail.tagline}</SubTitle>}
            <Genres>
              {showDetail.genres &&
                showDetail.genres.map((genre) => (
                  <Genre key={genre.id}>{genre.name}</Genre>
                ))}
            </Genres>
          </>
        )}

        {showDetail && showDetail.vote_count > 0 && (
          <RatingContainer>
            <Rating>
              <Stars>
                {showDetail?.vote_average.toFixed(1)}
                <StarRateIcon />
              </Stars>
              <span>관람객 평점</span>
            </Rating>
          </RatingContainer>
        )}
        <DetailOverview>
          {showInfo
            ? showInfo.overview
            : showDetail
            ? showDetail.overview.trim()
              ? showDetail.overview.trim()
              : '이 영화에는 소개 관련 정보가 등록되어 있지 않습니다.'
            : '이 영화에는 소개 관련 정보가 등록되어 있지 않습니다.'}
        </DetailOverview>

        {!isShowCreditsLoading && showCredits && (
          <>
            {showCredits.cast.slice(0, 15).length !== 0 && (
              <>
                <CharacterInfo>
                  <h3>주연 / 조연</h3>
                  <CharacterSlide>
                    {showCredits.cast.slice(0, 15).map((cast, index) => (
                      <Person
                        key={index}
                        id={cast.id}
                        name={cast.name}
                        role={cast.character}
                      />
                    ))}
                  </CharacterSlide>
                </CharacterInfo>
              </>
            )}
            {showCredits.crew.slice(0, 15).length !== 0 && (
              <>
                <CharacterInfo>
                  <h3>제작진</h3>
                  <CharacterSlide>
                    {showCredits.crew.slice(0, 15).map((crew, index) => (
                      <Person
                        key={index}
                        id={crew.id}
                        name={crew.name}
                        role={crew.known_for_department}
                      />
                    ))}
                  </CharacterSlide>
                </CharacterInfo>
              </>
            )}
          </>
        )}
      </DetailContainer>
    </Wrapper>
  );
}

export default ShowDetail;
