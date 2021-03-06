import React from 'react';
import { withRouter } from 'react-router';
import { observer } from 'mobx-react-lite';
import { CardItem, CardsItemGroup } from '../../utils/CardItem';
import { Post } from '../../../types';
import { usePostsStore } from '../../../stores';

const RawListItem: React.FC = observer(() => {
  const postsStore = usePostsStore();
  return (
    <CardsItemGroup>
      {postsStore.posts.map(getItem)}
    </CardsItemGroup>
  );
})

const getItem = (post: Post) =>
  <CardItem
    key={post.id}
    header={post.title}
    description={post.body}
    url={`${post.id}`}
  />

export const ListItem = withRouter(RawListItem);