import * as React from 'react';
import styled from 'styled-components';
import { AiOutlineCheck } from 'react-icons/ai';

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

const StyledColumn = styled.span`
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

const StyledHeaderColumn = styled.span`
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

type ListProps = {
  list: Stories;
  onRemoveItem: (item: Story) => void;
};

const List: React.FC<ListProps> = ({ list, onRemoveItem }) => (
  <ul>
    <StyledHeader>
      <StyledHeaderColumn width='40%'>Title</StyledHeaderColumn>
      <StyledHeaderColumn width='30%'>Author</StyledHeaderColumn>
      <StyledHeaderColumn width='10%'>Comments</StyledHeaderColumn>
      <StyledHeaderColumn width='10%'>Points</StyledHeaderColumn>
      <StyledHeaderColumn width='10%'>Actions</StyledHeaderColumn>
    </StyledHeader>

    {list.map((item) => (
      <Item
        key={item.objectID}
        item={item}
        onRemoveItem={onRemoveItem}
      />
    ))}
  </ul>
);

type ItemProps = {
  item: Story;
  onRemoveItem: (item: Story) => void;
};

const Item: React.FC<ItemProps> = ({ item, onRemoveItem }) => (
  <StyledItem>
    <StyledColumn width='40%'>
      <a href={item.url}>{item.title}</a>
    </StyledColumn>
    <StyledColumn width='30%'>
      {item.author}
    </StyledColumn>
    <StyledColumn width='10%'>
      {item.num_comments}
    </StyledColumn>
    <StyledColumn width='10%'>
      {item.points}
    </StyledColumn>
    <StyledColumn width='10%'>
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
