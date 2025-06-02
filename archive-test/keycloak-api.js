import http from 'k6/http';
import { check } from 'k6';

function log(json) {
  console.error("DEBUG ==> " + JSON.stringify(json, null, 2));
}

export function resetPassword(access_token, hostname, userId) {
  const jsonOptions = {
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    }
  };

  let resetPasswordRequest = {
    "type": "password",
    "temporary": false,
    "value": "testpassword123"
  };
  let resetPasswordRequestBody = JSON.stringify(resetPasswordRequest);
  let resetPasswordResponse = http.put(`https://${hostname}/admin/realms/sample-app/users/${userId}/reset-password`, resetPasswordRequestBody, jsonOptions);
  const resetPasswordResponseBody = JSON.parse(resetPasswordResponse.body);
  return resetPasswordResponseBody;
}

export function addUser(access_token, createUserRequest, hostname) {
  const jsonOptions = {
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    }
  };

  let createUserRequestBody = JSON.stringify(createUserRequest);
  let createUserResponse = http.post(`https://${hostname}//admin/realms/sample-app/users`, createUserRequestBody, jsonOptions);
  return createUserResponse;
}

export function getUsers(access_token, hostname, queryString = "") {
  const options = {
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  };
  let usersResponse = http.get(`https://${hostname}/admin/realms/sample-app/users${queryString}`, options);
  const users = JSON.parse(usersResponse.body);
  return users;
}

export function authorize(hostname) {

  const payload = {
    "client_id": "client-pat",
    "grant_type": "client_credentials",
    "client_secret": "WJmCgangJQYEttl2fQOvjdniGIJbHvWq" //__ENV.CLIENT_SECRET
  };
  const options = {
    tags: {
      myTag: "authorize"
    }
  }
  let tokenResponse = http.post(`https://${hostname}/realms/sample-app/protocol/openid-connect/token`, payload, options);
  check(tokenResponse, { "status is 200": (res) => res.status === 200 });

  const access_token = JSON.parse(tokenResponse.body).access_token;
  return access_token;
}
