import {call, put} from 'redux-saga/effects';
import { AsyncActionCreator, PayloadAction } from 'typesafe-actions';

/* 유틸 함수의 재사용성을 높이기 위해 함수의 파라미터는 언제나 하나의 값을 사용하도록 하고, 
action.payload를 그대로 파라미터로 넣어주도록 설정한다.
만약, 여러가지 종류의 값을 파라미터로 넣어야 한다면 객체 형태로 만들어줘야 한다. */

type PromiseCreatorFunction<P,T> = 
| ((payload: P) => Promise<T>)
| (() => Promise<T>);

function isPayloadAction<P>(action: any):action is PayloadAction<string, any> {
    return action.payload !== undefined;
}

export default function createAsyncSaga<T1, P1, T2, P2, T3, P3>(
    AsyncActionCreator: AsyncActionCreator<[T1, P1], [T2, P2], [T3, P3]>,
    promiseCreator: PromiseCreatorFunction<P1, P2>
) {
    return function* saga(action: ReturnType<typeof AsyncActionCreator.request>) {
        try {
            const result: P2 = isPayloadAction(action)
            ? yield call(promiseCreator, action.payload)
            : yield call(promiseCreator);
            yield put(AsyncActionCreator.success(result));
        }catch(e:any) {
            yield put(AsyncActionCreator.failure(e));
        }
    }
}