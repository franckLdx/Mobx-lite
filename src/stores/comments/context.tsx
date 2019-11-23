import React, { createContext, useContext } from 'react';
import { Store, createStore } from './store';
import { useLocalStore, useAsObservableSource } from 'mobx-react-lite';
import { assertDefined } from '../../tools';
import { ServicesContext } from '../../services';

const CommentsStoreContext = createContext<Store | null>(null);

export const useCommentsStore = () => {
  const store = useContext(CommentsStoreContext);
  assertDefined(store, "Comments store must be created before usage");
  return store;
}

export const CommentsStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const services = useContext(ServicesContext);
  const source = useAsObservableSource({ services });
  const store = useLocalStore<Store>(createStore, source);
  return <CommentsStoreContext.Provider value={store}>{children}</CommentsStoreContext.Provider>
}