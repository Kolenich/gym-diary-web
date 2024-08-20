import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';

import { type TAppDispatch, type TRootState } from './store.types';

export const useAppDispatch: () => TAppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<TRootState> = useSelector;
