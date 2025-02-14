// import clsx from 'clsx';
import * as React from 'react';
import axios from 'axios';
import styled, { createGlobalStyle } from 'styled-components';
// import styles from './App.module.css';
import { List } from './List';
import { InputWithLabel } from './InputWithLabel';
import { SearchForm } from './SearchForm';

import { FaHackerNews } from 'react-icons/fa';
// import { AiOutlineCheck } from 'react-icons/ai';

type Story = {
  objectID: string;
  url: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
};

type Stories = Story[];

type StoriesState = {
  data: Stories;
  isLoading: boolean;
  isError: boolean;
};

type StoriesFetchInitAction = {
  type: 'STORIES_FETCH_INIT';
};

type StoriesFetchSuccessAction = {
  type: 'STORIES_FETCH_SUCCESS';
  payload: Stories;
};

type StoriesFetchFailureAction = {
  type: 'STORIES_FETCH_FAILURE';
};

type StoriesRemoveAction = {
  type: 'REMOVE_STORY';
  payload: Story;
};

type StoriesAction =
  | StoriesFetchInitAction
  | StoriesFetchSuccessAction
  | StoriesFetchFailureAction
  | StoriesRemoveAction;

const REMOVE_STORY = 'REMOVE_STORY';
const STORIES_FETCH_INIT = 'STORIES_FETCH_INIT';
const STORIES_FETCH_SUCCESS = 'STORIES_FETCH_SUCCESS';
const STORIES_FETCH_FAILURE = 'STORIES_FETCH_FAILURE';

const storiesReducer = (
  state: StoriesState,
  action: StoriesAction
) => {
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

const useStorageState = (
  key: string,
  initialState: string
): [string, (newValue: string) => void] => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

// API_ENDPOINT used to fetch popular tech stories for a certain query
const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const extractSearchTerm = (url: string) =>
  url.replace(API_ENDPOINT, '');

const getLastSearches = (urls: string[]): string[] =>
  urls
    .reduce((result, url, index) => {
      const searchTerm = extractSearchTerm(url);

      if (index === 0) {
        return result.concat(searchTerm);
      }

      const previousSearchTerm = result[result.length - 1];

      if (searchTerm === previousSearchTerm) {
        return result;
      } else {
        return result.concat(searchTerm);
      }
    }, [] as string[])
    .slice(-6)
    .slice(0, -1);

const getUrl = (searchTerm: string): string =>
  searchTerm ? `${API_ENDPOINT}${searchTerm}` : '';

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

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState(
    'search',
    'React'
  );

  const intitialUrls: string[] = getUrl(searchTerm)
    ? [getUrl(searchTerm)]
    : [];

  // important: still wraps the returned value in []
  const [urls, setUrls] = React.useState<string[]>(() =>
    getUrl(searchTerm) ? [getUrl(searchTerm)] : ([] as string[])
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
      const lastUrl = urls[urls.length - 1];
      const result = await axios.get(lastUrl);

      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits, // Send returned result (different data structure) as payload to component's state reducer
      });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [urls]);

  React.useEffect(() => {
    handleFetchStories(); // Invoke handleFetchStories function in useEffect Hook
  }, [handleFetchStories]);

  const handleRemoveStory = (item: Story) => {
    dispatchStories({
      type: REMOVE_STORY,
      payload: item,
    });
  };

  const handleSearchInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = (searchTerm: string) => {
    const url = getUrl(searchTerm);
    setUrls(urls.concat(url));
  };

  const handleSearchSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    handleSearch(searchTerm);

    event.preventDefault();
  };

  const handleLastSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    handleSearch(searchTerm);
  };

  const lastSearches = getLastSearches(urls);

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

        <LastSearches
          lastSearches={lastSearches}
          onLastSearch={handleLastSearch}
        />

        <hr />

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

type LastSearchesProps = {
  lastSearches: string[];
  onLastSearch: (searchTerm: string) => void;
};

const LastSearches: React.FC<LastSearchesProps> = ({
  lastSearches,
  onLastSearch,
}) => (
  <>
    {lastSearches.map((searchTerm, index) => (
      <button
        key={searchTerm + index}
        type="button"
        onClick={() => onLastSearch(searchTerm)}
      >
        {searchTerm}
      </button>
    ))}
  </>
);

export default App;

export { storiesReducer, SearchForm, InputWithLabel, List };
