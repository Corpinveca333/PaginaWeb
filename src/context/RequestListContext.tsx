'use client';
import React, { createContext, useReducer, useContext, ReactNode, Dispatch } from 'react';
import {
  requestListReducer,
  initialState,
  RequestListItem,
  RequestListState,
  ActionType,
} from './requestListReducer';

export interface RequestListContextProps {
  state: RequestListState;
  dispatch: Dispatch<ActionType>;
}

export const RequestListContext = createContext<RequestListContextProps | undefined>(undefined);

export const RequestListProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(requestListReducer, initialState);
  return (
    <RequestListContext.Provider value={{ state, dispatch }}>
      {children}
    </RequestListContext.Provider>
  );
};

export function useRequestList() {
  const context = useContext(RequestListContext);
  if (context === undefined) {
    throw new Error('useRequestList debe usarse dentro de un RequestListProvider');
  }
  return context;
}

export type { RequestListItem, RequestListState };
