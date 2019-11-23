import React, { createContext, useContext } from 'react';
import { useLocalStore, useAsObservableSource } from 'mobx-react-lite';
import { createPostsStore, Store } from './store';
import { assertDefined } from '../../tools';
import { ServicesContext } from '../../services';

const PostsStoreContext = createContext<Store | null>(null);

export const usePostsStore = () => {
  const store = useContext(PostsStoreContext);
  assertDefined(store, "Posts store must be created before usage");
  return store;
}

export const PostsStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  debugger;
  const services = useContext(ServicesContext)!;
  const source = useAsObservableSource({ services });
  const store = useLocalStore<Store>(createPostsStore, source);
  return <PostsStoreContext.Provider value={store}>{children}</PostsStoreContext.Provider>
}