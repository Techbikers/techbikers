import { takeEvery, call, fork, put } from "redux-saga/effects";
import { Schema, arrayOf } from "normalizr";

import { callApi } from "techbikers/utils/api";
import { FundraiserSchema } from "techbikers/fundraisers/sagas";
import * as actions from "techbikers/users/actions";
import {
  createTextNotification,
  createErrorNotification
} from "techbikers/notifications/actions";

export const UserSchema = new Schema("user");

UserSchema.define({
  fundraisers: arrayOf(FundraiserSchema)
});

/**
 * Fetch a single user by their ID
 * @param {number} payload - User ID
 */
export function* fetchUserById({ payload }) {
  return yield call(callApi, `/riders/${payload}`, {}, UserSchema);
}

/**
 * Fetch all users by the ride they are riders on
 * @param {number} payload - Ride ID
 */
export function* fetchUsersByRide({ payload }) {
  return yield call(callApi, `/rides/${payload}/riders`, {}, arrayOf(UserSchema));
}

/**
 * Update the user record
 * @param {Object} payload - Updated user object
 */
export function* updateUser({ payload }) {
  const fetchOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  };
  const result = yield call(callApi, `/riders/${payload.id}`, fetchOptions, UserSchema);
  if (!result.error) {
    yield put(createTextNotification("Profile updated"));
  } else {
    yield put(createErrorNotification("Error updating profile"));
  }
}

export default function* root() {
  yield [
    fork(takeEvery, actions.FETCH_USER_BY_ID, fetchUserById),
    fork(takeEvery, actions.FETCH_USERS_BY_RIDE, fetchUsersByRide),
    fork(takeEvery, actions.UPDATE_USER, updateUser)
  ];
}
