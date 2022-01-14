import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { ActionType, AsyncActionCreator, getType } from "typesafe-actions";

export type AsyncState<T, E = any> = {
    loading: boolean;
    data: T | null;
    error: E | null;
};

export const asyncState = {
    initial: <T,E = any>(initialData?: T): AsyncState<T,E> => ({
    loading: false,
    data: initialData || null,
    error: null
}),
load: <T,E = any>(data?:T): AsyncState<T,E> => ({
    loading: true,
    data: data || null,
    error: null
}),
success: <T,E = any>(data: T): AsyncState<T,E> => ({
    loading: false,
    data,
    error: null
}),
error: <T,E = any>(error: E): AsyncState<T,E> => ({
    loading: false,
    data: null,
    error: error
})
};

type AnyAsyncActionCreator = AsyncActionCreator<any, any, any>;
// 이 부분을 추가!
export function transformToArray<AC extends AnyAsyncActionCreator>(asyncActionCreator: AC) {
    const {request, success, failure} = asyncActionCreator;
    return [request, success, failure];
}
export function createAsyncReducer<S, AC extends AnyAsyncActionCreator, K extends keyof S>(
    asyncActionCreator: AC,
     key: K
     ) {
         return (state: S, action: AnyAction) => {
             const [request, success, failure] = transformToArray(asyncActionCreator).map(getType); // 여기도 수정
             switch (action.type) {
                 case request:
                     return {
                         ...state,
                         [key]: asyncState.load()
                     };
                     case success:
                     return {
                         ...state,
                         [key]: asyncState.success(action.payload)
                     };
                     case failure:
                     return {
                         ...state,
                         [key]: asyncState.error(action.payload)
                     };
                     default:
                     return state;
             }
         };
}