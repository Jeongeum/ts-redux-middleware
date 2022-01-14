import { combineReducers } from "redux";
import { all } from "redux-saga/effects";
import github, { githubSaga } from "./github";

const rootReducer = combineReducers({
    github
});

// 루트 리듀서 내보내기
export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;

// 루트 사가 만들어 내보내기
export function* rootSaga() {
    yield all([githubSaga()]);
}