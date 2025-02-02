// import clsx from 'clsx';
import * as React from 'react';
import axios from 'axios';
import styled, { createGlobalStyle } from 'styled-components';
// import styles from './App.module.css';

// import { ReactComponent as Check } from './check.svg';

// import CheckIcon from './check.svg?react';
// import HackerIcon from './hacker.svg?react';

import { FaHackerNews } from 'react-icons/fa';
import { AiOutlineCheck } from 'react-icons/ai';

const REMOVE_STORY = 'REMOVE_STORY';
const STORIES_FETCH_INIT = 'STORIES_FETCH_INIT';
const STORIES_FETCH_SUCCESS = 'STORIES_FETCH_SUCCESS';
const STORIES_FETCH_FAILURE = 'STORIES_FETCH_FAILURE';

const storiesReducer = (state, action) => {
  switch (action.type) {
    case STORIES_FETCH_INIT:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case STORIES_FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case STORIES_FETCH_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case REMOVE_STORY:
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

const useStorageState = (key, initialState) => {
  const isMounted = React.useRef(false);

  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      console.log('A');
      localStorage.setItem(key, value)
    }
  }, [value, key]);

  return [value, setValue];
};

// API_ENDPOINT used to fetch popular tech stories for a certain query
const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubantu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

const StyledContainer = styled.div`
  height: 100vw;
  padding: 20px;

  background: #83a4d4;
  background: linear-gradient(to left, #b6fbff, #83a4d4);

  color: #171212;
`;

const StyledHeadlinePrimary = styled.h1`
  font-size: 48px;
  font-weight: 300;
  letter-spacing: 2px;
`;

const StyledItem = styled.li`
  display: flex;
  align-items: center;
  padding-bottom: 5px;
`;

const StyledColumn = styled.span`
  padding: 0 5px;
  white-space: nowrap;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  a {
    color: inherit;
  }

  width: ${(props) => props.width};
`;

const StyledButton = styled.button`
  background: transparent;
  border: 1px solid #171212;
  padding: 5px;
  cursor: pointer;

  transition: all 0.1s ease-in;

  &:hover {
    background: #171212;
    color: #ffffff;
  }
`;

const StyledButtonSmall = styled(StyledButton)`
  padding: 5px;
`;

const StyledButtonLarge = styled(StyledButton)`
  padding: 10px;
`;

const StyledSearchForm = styled.form`
  padding: 10px 0 20px 0;
  display: flex;
  align-items: baseline;
`;

const StyledLabel = styled.label`
  border-top: 1px solid #171212;
  border-left: 1px solid #171212;
  padding-left: 5px;
  font-size: 24px;
`;

const StyledInput = styled.input`
  border: none;
  border-botttom: 1px solid #171212;
  background-color: transparent;

  font-size: 24px;
`;

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState(
    'search',
    'React'
  );

  const [url, setUrl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`
  );

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );

  // Move all data fetching logic from the side-effect into arrow function expression
  const handleFetchStories = React.useCallback(async () => {
    // wrap function into React's useCallback hook
    //  if `searchTerm is not present do nothing

    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    try {
      const result = await axios.get(url);

      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits, // Send returned result (different data structure) as payload to component's state reducer
      });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [url]);

  React.useEffect(() => {
    console.log('How many times do I log?');
    handleFetchStories(); // Invoke handleFetchStories function in useEffect Hook
  }, [handleFetchStories]);

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: REMOVE_STORY,
      payload: item,
    });
  };

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);

    event.preventDefault();
  };

  return (
    <>
      <GlobalStyle />

      <StyledContainer>
        <StyledHeadlinePrimary>
          <FaHackerNews size="50" />
          My Hacker Stories
        </StyledHeadlinePrimary>

        <SearchForm
          searchTerm={searchTerm}
          onSearchInput={handleSearchInput}
          onSearchSubmit={handleSearchSubmit}
          // className="button_large"
        />

        {/* <hr /> */}

        {stories.isError && <p>Something went wrong ...</p>}

        {stories.isLoading ? (
          <p>Loading ...</p>
        ) : (
          <List
            list={stories.data}
            onRemoveItem={handleRemoveStory}
          />
        )}
      </StyledContainer>
    </>
  );
};

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
  className,
}) => (
  <StyledSearchForm onSubmit={onSearchSubmit}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused
      onInputChange={onSearchInput}
    >
      <strong>Search:</strong>
    </InputWithLabel>

    <StyledButtonLarge
      type="submit"
      disabled={!searchTerm}
      // className={clsx(styles.button, styles.buttonLarge)}
      // className={clsx(styles.button, {
      //   [styles.buttonLarge]: isLarge,
      // })}
    >
      Submit
    </StyledButtonLarge>
  </StyledSearchForm>
);

const InputWithLabel = ({
  id,
  value,
  type = 'text',
  onInputChange,
  isFocused,
  children,
}) => {
  // Create a ref with React's useRef Hook
  const inputRef = React.useRef();

  // Opt into React's lifecycle with React's useEffect Hook
  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      // Execute its focus programmatically as a side-effect, but only if isFocusedis set and the current property is existent
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <StyledLabel htmlFor={id}>{children}</StyledLabel>
      &nbsp;
      {/* Pass ref to element's JSX-reserved ref attribute */}
      <StyledInput
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        // autoFocus={isFocused}
        onChange={onInputChange}
        // className={styles.input}
      />
    </>
  );
};

// note that `autoFocus` is a shorthand for `autoFocus={true}`
// every attribute that is set to `true` can use this shorthand

const List = ({ list, onRemoveItem }) => (
  <ul>
    {list.map((item) => (
      <Item
        key={item.objectID}
        item={item}
        onRemoveItem={onRemoveItem}
      />
    ))}
  </ul>
);

const Item = ({ item, onRemoveItem }) => (
  <StyledItem>
    <StyledColumn width="40%">
      <a href={item.url}>{item.title}</a>
    </StyledColumn>
    <StyledColumn width="30%">{item.author}</StyledColumn>
    <StyledColumn width="10%">{item.num_comments}</StyledColumn>
    <StyledColumn width="10%">{item.points}</StyledColumn>
    <StyledColumn width="10%">
      <StyledButtonSmall
        type="button"
        onClick={() => onRemoveItem(item)}
        // className={`${styles.button} ${styles.buttonSmall}`}
      >
        <AiOutlineCheck height="18px" width="18px" color="green" />
      </StyledButtonSmall>
    </StyledColumn>
  </StyledItem>
);

export default App;
