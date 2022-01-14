import { createReducer } from "typesafe-actions";
import { GithubState, GithubAction } from "./types";
import { GET_USER_PROFILE, GET_USER_PROFILE_SUCCESS, GET_USER_PROFILE_ERROR } from "./actions";
import { asyncState, createAsyncReducer, transformToArray } from "../../lib/reducerUtils";
import { getUserProfileAsync } from "./actions";

const initialState: GithubState = {
    userProfile: asyncState.initial()
};

const github = createReducer<GithubState, GithubAction>(initialState)
.handleAction(
    transformToArray(getUserProfileAsync),
    createAsyncReducer(getUserProfileAsync, 'userProfile')
);

export default github;