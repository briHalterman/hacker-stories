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

type ListProps = {
  list: Stories;
  onRemoveItem: (item: Story) => void;
};

const List: React.FC<ListProps> = ({ list, onRemoveItem }) => (
  <ul>
    <div style={{ display: 'flex', fontWeight: 'bold' }}>
      <span style={{ width: '40%' }}>Title</span>
      <span style={{ width: '30%' }}>Author</span>
      <span style={{ width: '10%' }}>Comments</span>
      <span style={{ width: '10%' }}>Points</span>
      <span style={{ width: '10%' }}>Actions</span>
    </div>

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

// const Item = ({ item, onRemoveItem }: ItemProps) => (
const Item: React.FC<ItemProps> = ({ item, onRemoveItem }) => (
  <StyledItem style={{ display: 'flex' }}>
    <StyledColumn style={{ width: '40%' }}>
      <a href={item.url}>{item.title}</a>
    </StyledColumn>
    <StyledColumn style={{ width: '30%' }}>
      {item.author}
    </StyledColumn>
    <StyledColumn style={{ width: '10%' }}>
      {item.num_comments}
    </StyledColumn>
    <StyledColumn style={{ width: '10%' }}>
      {item.points}
    </StyledColumn>
    <StyledColumn style={{ width: '10%' }}>
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
