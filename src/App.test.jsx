// describe('something truthy and falsy', () => {
//   it('true to be true', () => {
//     expect(true).toBeTruthy();
//   });

//   it('false to be false', () => {
//     expect(false).toBeFalsy();
//   });
// });

import { describe, it, expect, vi } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';

import App, {
  storiesReducer,
  // Item,
  List,
  SearchForm,
  InputWithLabel,
} from './App';

// import List from './List';

import axios from 'axios';

const initialState = {
  data: [],
  isLoading: false,
  isError: false,
};

const storyOne = {
  title: 'React',
  url: 'https://reactjs.org/',
  author: 'Jordan Walke',
  num_comments: 3,
  points: 4,
  objectID: 0,
};

const storyTwo = {
  title: 'Redux',
  url: 'https://redux.js.org/',
  author: 'Dan Abramov, Andrew Clark',
  num_comments: 2,
  points: 5,
  objectID: 1,
};

const stories = [storyOne, storyTwo];

vi.mock('axios');

describe('storiesReducer', () => {
  it('fetches all stories', () => {
    const action = { type: 'STORIES_FETCH_INIT' };
    const newState = storiesReducer(initialState, action);

    expect(newState.isLoading).toBeTruthy();
    expect(newState.isError).toBeFalsy();
  });

  it('correctly updates application state', () => {
    const action = {
      type: 'STORIES_FETCH_SUCCESS',
      payload: stories,
    };
    const newState = storiesReducer(initialState, action);

    expect(newState.isLoading).toBeFalsy();
    expect(newState.isError).toBeFalsy();
    expect(newState.data).toHaveLength(stories.length);
    expect(newState.data).toEqual(stories);
  });

  it('handles failed API request', () => {
    const action = { type: 'STORIES_FETCH_FAILURE' };
    const newState = storiesReducer(initialState, action);

    expect(newState.isLoading).toBeFalsy();
    expect(newState.isError).toBeTruthy();
  });

  it('removes a story from all stories', () => {
    const action = { type: 'REMOVE_STORY', payload: storyOne };
    const state = { data: stories, isLoading: false, isError: false };

    const newState = storiesReducer(state, action);

    const expectedState = {
      data: [storyTwo],
      isLoading: false,
      isError: false,
    };

    expect(newState).toStrictEqual(expectedState);
  });
});

describe('SearchForm', () => {
  const searchFormProps = {
    searchTerm: 'React',
    onSearchInput: vi.fn(),
    onSearchSubmit: vi.fn(),
  };

  it('renders the input field with its value', () => {
    render(<SearchForm {...searchFormProps} />);

    // screen.debug();
    expect(screen.getByDisplayValue('React')).toBeInTheDocument();
  });

  it('renders the correct label', () => {
    render(<SearchForm {...searchFormProps} />);

    expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
  });

  it('calls onSearchInput on input field change', () => {
    render(<SearchForm {...searchFormProps} />);

    const inputElement = screen.getByDisplayValue('React');

    fireEvent.change(inputElement, {
      target: { value: 'Redux' },
    });

    expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1);

    expect(searchFormProps.onSearchInput).toHaveBeenCalledWith(
      expect.any(Object)
    );
  });

  it('calls onSearchSubmit on button submit click', () => {
    render(<SearchForm {...searchFormProps} />);

    fireEvent.submit(screen.getByRole('button'));

    expect(searchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1);
    expect(searchFormProps.onSearchSubmit).toHaveBeenCalledWith(
      expect.any(Object)
    );
  });

  it('renders snapshot', () => {
    const { container } = render(<SearchForm {...searchFormProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('List', () => {
  const handleRemoveItem = vi.fn();

  it('renders the correct number of items', () => {
    render(<List list={stories} onRemoveItem={handleRemoveItem} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(
      stories.length
    );
  });

  it("renders all of an item's properties", () => {
    render(
      <List list={[storyOne]} onRemoveItem={handleRemoveItem} />
    );

    expect(screen.getByText('Jordan Walke')).toBeInTheDocument();
    expect(screen.getByText('React')).toHaveAttribute(
      'href',
      'https://reactjs.org/'
    );
  });

  it('renders a clickable dismiss button', () => {
    render(
      <List list={[storyOne]} onRemoveItem={handleRemoveItem} />
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onRemove when the button is clicked', () => {
    render(<List list={stories} onRemoveItem={handleRemoveItem} />);

    const removeButtons = screen.getAllByRole('button');

    fireEvent.click(removeButtons[0]);

    expect(handleRemoveItem).toHaveBeenCalledTimes(1);
    expect(handleRemoveItem).toHaveBeenCalledWith(storyOne);
  });

  it('renders snapshot', () => {
    const { container } = render(
      <List list={stories} onRemoveItem={() => {}} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('InputWithLabel', () => {
  const handleChange = vi.fn();
  const labelText = 'Search';

  it('renders the label correctly', () => {
    render(
      <InputWithLabel
        id="search"
        value="React"
        onInputChange={handleChange}
      >
        {labelText}
      </InputWithLabel>
    );

    expect(screen.getByLabelText(labelText)).toBeInTheDocument();
  });

  it('renders the input field with the correct value', () => {
    render(
      <InputWithLabel
        id="search"
        value="React"
        onInputChange={handleChange}
      >
        {labelText}
      </InputWithLabel>
    );

    expect(screen.getByDisplayValue('React')).toBeInTheDocument();
  });

  it('calls onInputChange when text is entered', () => {
    render(
      <InputWithLabel
        id="search"
        value=""
        onInputChange={handleChange}
      >
        {labelText}
      </InputWithLabel>
    );

    const input = screen.getByLabelText(labelText);
    fireEvent.change(input, { target: { value: 'Redux' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('renders snapshot', () => {
    const { container } = render(
      <InputWithLabel
        id="search"
        value="React"
        onInputChange={() => {}}
      >
        Search
      </InputWithLabel>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('App', () => {
  it('succeeds fetching data', async () => {
    const promise = Promise.resolve({
      data: {
        hits: stories,
      },
    });

    axios.get.mockImplementationOnce(() => promise);

    render(<App />);

    expect(screen.queryByText(/Loading/)).toBeInTheDocument();

    await waitFor(async () => await promise);

    expect(screen.queryByText(/Loading/)).toBeNull();

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Redux')).toBeInTheDocument();
    expect(screen.getAllByText('Dismiss').length).toBe(2);
  });

  it('fails fetching data', async () => {
    const promise = Promise.reject();

    axios.get.mockImplementationOnce(() => promise);

    render(<App />);

    expect(screen.getByText(/Loading/)).toBeInTheDocument();

    try {
      await waitFor(async () => await promise);
    } catch (error) {
      expect(screen.queryByText(/Loading/)).toBeNull();
      expect(screen.queryByText(/went wrong/)).toBeInTheDocument();
    }
  });

  it('removes a story', async () => {
    const promise = Promise.resolve({
      data: {
        hits: stories,
      },
    });

    axios.get.mockImplementationOnce(() => promise);

    render(<App />);

    await waitFor(async () => await promise);

    expect(screen.getAllByText('Dismiss').length).toBe(2);
    expect(screen.getByText('Jordan Walke')).toBeInTheDocument();

    fireEvent.click(screen.getAllByText('Dismiss')[0]);

    expect(screen.getAllByText('Dismiss').length).toBe(1);
    expect(screen.queryByText('Jordan Walke')).toBeNull();
  });

  it('searches for specific stories', async () => {
    const reactPromise = Promise.resolve({
      data: {
        hits: stories,
      },
    });

    const anotherStory = {
      title: 'JavaScript',
      url: 'https://en.wikipedia.org/wiki/JavaScript',
      author: 'Brendan Eich',
      num_comments: 15,
      points: 10,
      objectID: 3,
    };

    const javascriptPromise = Promise.resolve({
      data: {
        hits: [anotherStory],
      },
    });

    axios.get.mockImplementation((url) => {
      if (url.includes('React')) {
        return reactPromise;
      }

      if (url.includes('JavaScript')) {
        return javascriptPromise;
      }

      throw Error();
    });

    // Initial Render

    render(<App />);

    // First Data Fetching

    await waitFor(async () => await reactPromise);

    expect(screen.queryByDisplayValue('React')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('JavaScript')).toBeNull();

    expect(screen.queryByText('Jordan Walke')).toBeInTheDocument();
    expect(
      screen.queryByText('Dan Abramov, Andrew Clark')
    ).toBeInTheDocument();
    expect(screen.queryByText('Brendan Eich')).toBeNull();

    // User Interaction -> Search

    fireEvent.change(screen.queryByDisplayValue('React'), {
      target: {
        value: 'JavaScript',
      },
    });

    expect(screen.queryByDisplayValue('React')).toBeNull();
    expect(
      screen.queryByDisplayValue('JavaScript')
    ).toBeInTheDocument();

    fireEvent.submit(screen.queryByText('Submit'));

    // Second Data Fetching

    await waitFor(async () => await javascriptPromise);

    expect(screen.queryByText('Jordan Walke')).toBeNull();
    expect(
      screen.queryByText('Dan Abromov, Andrew Clark')
    ).toBeNull();
    expect(screen.queryByText('Brendan Eich')).toBeInTheDocument();
  });

  it('renders snapshot', async () => {
    const promise = Promise.resolve({
      data: {
        hits: stories,
      },
    });

    axios.get.mockImplementationOnce(() => promise);

    const { container } = render(<App />);

    await waitFor(async () => await promise);

    expect(container.firstChild).toMatchSnapshot();
  });
});
