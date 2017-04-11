import { normalize } from "normalizr";
import { call, select, put } from "redux-saga/effects";
import { camelizeKeys } from "humps";
import fetch from "isomorphic-fetch";
import { createAction } from "redux-actions";

import { API_ROOT } from "techbikers/config";
import { getAuthToken } from "techbikers/auth/selectors";

// Create some request actions so we can dispatch the result of any request
// This allows other reducers/sagas to listen out for the response of requests
const REQUEST_SUCCESS = "REQUEST_SUCCESS";
const REQUEST_FAILURE = "REQUEST_FAILURE";
const request = {
  success: createAction(REQUEST_SUCCESS),
  failure: createAction(REQUEST_FAILURE)
};

/**
 * Resuable fetch subroutine for getting entities
 * @param {string} endpoint       - Api endpoint for the entity/entities
 * @param {Object} [fetchOptions] - Additional options to be used when performing the fetch
 * @param {Object} [schema]       - The schema used to normalize the json response
 */
export function* callApi(endpoint, fetchOptions = {}, schema) {
  // If the endpoint is a full url, just use that - else append the api
  const fullUrl = (endpoint.indexOf("http") === 0) ? endpoint : API_ROOT + endpoint;
  const token = yield select(getAuthToken);

  if (token) {
    fetchOptions.headers = {
      Authorization: `Bearer ${token}`,
      ...fetchOptions.headers
    };
  }

  try {
    // Call the API and get the response
    const res = yield call(fetch, fullUrl, fetchOptions);
    const json = yield res.json();

    if (!res.ok) {
      throw json;
    } else {
      // Make sure everything is camelcased (for consistency)
      const response = camelizeKeys(json);

      // Let's do two things
      // 1) Normalize the response and dispatch it (for an entity reducer etc.)
      const normalizedResponse = Object.assign({}, schema ? normalize(response, schema) : response);
      yield put(request.success(normalizedResponse));

      // Return the API response for any function that called the API to use
      return { response };
    }
  } catch (error) {
    // Dispatch the error then return it
    yield put(request.failure(error));
    return { error };
  }
}
