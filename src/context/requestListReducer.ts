// Tipos de acción
export const ADD_ITEM = 'ADD_ITEM';
export const REMOVE_ITEM = 'REMOVE_ITEM';
export const CLEAR_LIST = 'CLEAR_LIST';

export interface RequestListItem {
  id: string | number;
  name: string;
  slug?: string;
  sku?: string;
  price?: string | number | null;
  image?: string | null;
  // Puedes añadir más campos según tus necesidades
}

export interface RequestListState {
  items: RequestListItem[];
}

interface AddItemAction {
  type: typeof ADD_ITEM;
  payload: RequestListItem;
}

interface RemoveItemAction {
  type: typeof REMOVE_ITEM;
  payload: { id: string | number };
}

interface ClearListAction {
  type: typeof CLEAR_LIST;
}

export type ActionType = AddItemAction | RemoveItemAction | ClearListAction;

export const initialState: RequestListState = {
  items: [],
};

export function requestListReducer(
  state: RequestListState = initialState,
  action: ActionType
): RequestListState {
  switch (action.type) {
    case ADD_ITEM:
      // Evitar duplicados por id
      if (state.items.some(item => item.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id),
      };
    case CLEAR_LIST:
      return {
        ...state,
        items: [],
      };
    default:
      return state;
  }
}
