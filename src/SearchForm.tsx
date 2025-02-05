import * as React from 'react';
import styled from 'styled-components';
import { InputWithLabel } from './InputWithLabel';

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

const StyledButtonLarge = styled(StyledButton)`
  padding: 10px;
`;

const StyledSearchForm = styled.form`
  padding: 10px 0 20px 0;
  display: flex;
  align-items: baseline;
`;

type SearchFormProps = {
  searchTerm: string;
  onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

const SearchForm: React.FC<SearchFormProps> = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
  // className,
}) => (
  <StyledSearchForm onSubmit={onSearchSubmit}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused
      onInputChange={onSearchInput}
    >
      {/* <strong>Search:</strong> */}
      Search:
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

export { SearchForm };