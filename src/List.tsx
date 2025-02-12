import * as React from 'react';
import styled from 'styled-components';
import { AiOutlineCheck } from 'react-icons/ai';
import { sortBy } from 'lodash';

type Story = {
  objectID: string;
  url: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
};

type Stories = Story[];

const StyledItem = styled.li`
  display: flex;
  align-items: center;
  padding-bottom: 5px;
`;

type StyledColumnProps = {
  width: string;
};

const StyledColumn = styled.span<StyledColumnProps>`
  /* padding: 0 5px; */
  white-space: nowrap;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: ${(props) => props.width};

  a {
    color: inherit;
  }
`;

const StyledHeader = styled.div`
  display: flex;
  font-weight: bold;
`;

type StyledHeaderColumnProps = {
  width: string;
};

const StyledHeaderColumn = styled.span<StyledHeaderColumnProps>`
  width: ${(props) => props.width};
  text-align: left;
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

const StyledSortButton = styled(StyledButton)<{ $isActive: boolean }>`
  background-color: ${(props) =>
    props.$isActive ? '#ff875c' : 'inherit'};
`;

interface ItemType {
  objectID: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
  url: string;
}

type SortFunction = (list: ItemType[]) => ItemType[];

const SORTS: Record<string, SortFunction> = {
  NONE: (list) => list,
  TITLE: (list) => sortBy(list, 'title'),
  AUTHOR: (list) => sortBy(list, 'author'),
  COMMENT: (list) => sortBy(list, 'num_comments').reverse(),
  POINT: (list) => sortBy(list, 'points').reverse(),
};

type ListProps = {
  list: Stories;
  onRemoveItem: (item: Story) => void;
};

const List: React.FC<ListProps> = ({ list, onRemoveItem }) => {
  const [sort, setSort] = React.useState('NONE');

  const handleSort = (sortKey: string) => {
    setSort(sortKey);
  };

  const sortFunction = SORTS[sort];
  const sortedList = sortFunction(list);

  return (
    <ul>
      <StyledHeader>
        <StyledHeaderColumn width="40%">
          <StyledSortButton
            $isActive={sort === 'TITLE'}
            onClick={() => handleSort('TITLE')}
          >
            Title
          </StyledSortButton>
        </StyledHeaderColumn>
        <StyledHeaderColumn width="30%">
          <StyledSortButton
            $isActive={sort === 'AUTHOR'}
            onClick={() => handleSort('AUTHOR')}
          >
            Author
          </StyledSortButton>
        </StyledHeaderColumn>
        <StyledHeaderColumn width="10%">
          <StyledSortButton
            $isActive={sort === 'COMMENTS'}
            onClick={() => handleSort('COMMENTS')}
          >
            Comments
          </StyledSortButton>
        </StyledHeaderColumn>
        <StyledHeaderColumn width="10%">
          <StyledSortButton
            $isActive={sort === 'POINTS'}
            onClick={() => handleSort('POINTS')}
          >
            Points
          </StyledSortButton>
        </StyledHeaderColumn>
        <StyledHeaderColumn width="10%">Actions</StyledHeaderColumn>
      </StyledHeader>

      {sortedList.map((item) => (
        <Item
          key={item.objectID}
          item={item}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </ul>
  );
};

type ItemProps = {
  item: Story;
  onRemoveItem: (item: Story) => void;
};

const Item: React.FC<ItemProps> = ({ item, onRemoveItem }) => (
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
        Dismiss{' '}
        <AiOutlineCheck height="18px" width="18px" color="green" />
      </StyledButtonSmall>
    </StyledColumn>
  </StyledItem>
);

export { List };
