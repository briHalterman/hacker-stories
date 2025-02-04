// describe('something truthy and falsy', () => {
//   it('true to be true', () => {
//     expect(true).toBeTruthy();
//   });

//   it('false to be false', () => {
//     expect(false).toBeFalsy();
//   });
// });

import { describe, it, expect } from 'vitest';

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
  })

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
