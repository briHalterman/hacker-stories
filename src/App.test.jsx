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
  Item,
  List,
  SearchForm,
  InputWithLabel,
} from './App';

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

  describe('Item', () => {
    it('renders all properties', () => {
      render(<Item item={storyOne} />);

      expect(screen.getByText('Jordan Walke')).toBeInTheDocument();
      expect(screen.getByText('React')).toHaveAttribute(
        'href',
        'https://reactjs.org/'
      );
    });

    it('renders a clickable dismiss button', () => {
      render(<Item item={storyOne} />);

      // screen.getByRole('');

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('clicking the dismiss button calls the callback handler', () => {
      const handleRemoveItem = vi.fn();

      render(
        <Item item={storyOne} onRemoveItem={handleRemoveItem} />
      );

      fireEvent.click(screen.getByRole('button'));

      expect(handleRemoveItem).toHaveBeenCalledTimes(1);
      expect(handleRemoveItem).toHaveBeenCalledWith(storyOne);
    });
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
});

describe('List', () => {
  const handleRemoveItem = vi.fn();

  it('renders the correct number of items', () => {
    render(<List list={stories} onRemoveItem={handleRemoveItem} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(
      stories.length
    );
  });

  it('calls onRemove when the button is clicked', () => {
    render(<List list={stories} onRemoveItem={handleRemoveItem} />);

    const removeButtons = screen.getAllByRole('button');

    fireEvent.click(removeButtons[0]);

    expect(handleRemoveItem).toHaveBeenCalledTimes(1);
    expect(handleRemoveItem).toHaveBeenCalledWith(stories[0]);
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
});
