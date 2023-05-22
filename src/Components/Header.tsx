import styled, { css } from 'styled-components';
import {
  motion,
  useAnimation,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion';
import { Link, useMatch, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface SearchFormInterface {
  keyword: string;
}

const Navigation = styled(motion.nav)`
  display: flex;
  width: 100%;
  height: 5rem;
  justify-content: space-between;
  color: ${(props) => props.theme.white.light};
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
  font-size: 0.9rem;

  & > *:first-child {
    margin-left: 3rem;
  }
  & > *:last-child {
    margin-right: 3rem;
  }
`;

const Column = styled.div`
  display: flex;
  gap: 3rem;
  align-items: center;
`;

const Logo = styled(motion.svg)`
  width: 6rem;
  fill: ${(props) => props.theme.red};
`;

const Item = styled.li<{ isActive?: boolean }>`
  display: flex;
  justify-content: center;
  flex-direction: column;
  color: ${(props) =>
    props.isActive ? props.theme.white.darker : props.theme.white.darkest};
  transition: color 0.3s ease-in-out;

  ${(props) =>
    !props.isActive
      ? css`
          &:hover {
            color: ${(props) => props.theme.white.dark};
          }
        `
      : css`
          pointer-events: none;
        `}
`;

const Items = styled.ul`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const Search = styled.form`
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
`;

const Input = styled(motion.input)`
  transform-origin: right center;
  position: absolute;
  right: 3rem;
  padding: 0.5rem 1rem;
  padding-left: 2.5rem;
  z-index: -1;
  color: white;
  font-size: 1rem;
  background-color: transparent;
  border: 1px solid ${(props) => props.theme.white.light};
`;

const MotionSearchIcon = motion(SearchIcon);

const navVariants = {
  top: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  scroll: {
    backgroundColor: 'rgba(0, 0, 0, 1)',
  },
};

function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const homeMatch = useMatch('/');
  const tvMatch = useMatch('/show');
  const inputAnimation = useAnimation();
  const navAnimation = useAnimation();
  const { scrollY } = useScroll();

  const toggleSearch = () => {
    if (isSearchOpen) {
      inputAnimation.start({
        scaleX: 0,
      });
    } else {
      inputAnimation.start({ scaleX: 1 });
      setFocus('keyword');
    }
    setIsSearchOpen((prev) => !prev);
  };

  const { register, handleSubmit, setFocus } = useForm<SearchFormInterface>();
  const onValid = (data: SearchFormInterface) => {
    navigate(`/search?keyword=${data.keyword}`);
    toggleSearch();
  };

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (scrollY.get() > 80) {
      navAnimation.start('scroll');
    } else {
      navAnimation.start('top');
    }
  });

  return (
    <Navigation variants={navVariants} animate={navAnimation} initial={'top'}>
      <Column>
        <Link to="/">
          <Logo xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 276.742">
            <motion.path
              d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z"
              fill="#d81f26"
            />
          </Logo>
        </Link>
        <Items>
          <Item isActive={Boolean(homeMatch)}>
            {Boolean(homeMatch) ? <span>홈</span> : <Link to="/">홈</Link>}
          </Item>

          <Item isActive={Boolean(tvMatch)}>
            {Boolean(tvMatch) ? (
              <span>TV 프로그램</span>
            ) : (
              <Link to="/show">TV 프로그램</Link>
            )}
          </Item>
        </Items>
      </Column>
      <Column>
        <Search onSubmit={handleSubmit(onValid)}>
          <MotionSearchIcon
            onClick={toggleSearch}
            animate={{ x: isSearchOpen ? -235 : 0 }}
            transition={{ type: 'linear' }}
          />
          <Input
            {...register('keyword', { required: true, minLength: 2 })}
            placeholder="제목, 사람, 장르"
            animate={inputAnimation}
            initial={{ scaleX: 0 }}
            transition={{ type: 'linear' }}
          />
        </Search>
      </Column>
    </Navigation>
  );
}

export default Header;
