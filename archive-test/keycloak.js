import faker from 'https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js';
import { getUsers, authorize } from './keycloak-api.js';
import { group, sleep } from 'k6';

export const options = {
  vus: 1,
  duration: '1m',
  insecureSkipTLSVerify: true
};

export default function () {

  const hostname = __ENV.BASE_URL || '3.79.196.112';
  let access_token;
  group('authorize', function () {
    access_token = authorize(hostname);
  })
  group('getusers', function () {
    getUsers(access_token, hostname);
  })
  sleep(10)
  // let username = `testuser-C-${__ITER}`
  // let createUserRequest = {
  //   "username": username,
  //   "email": `${username}@example.com`,
  //   "enabled": true,
  //   "firstName": faker.name.firstName(),
  //   "lastName": faker.name.lastName(),
  // };

  // addUser(access_token, createUserRequest, hostname);
  // const users = getUsers(access_token, hostname, `?username=${username}`)

  // let userId = users[0].id
  // console.log(`Zmieniam hasło dla ${username} o id ${userId}`);
  // resetPassword(access_token, hostname, userId);

}

// export function handleSummary(data) {
//   const med_latency = data.metrics.iteration_duration.values.med;
//   const latency_message = `The median latency was ${med_latency}\n`;

//   return {
//     stdout: JSON.stringify(data, null, 2),
//     'summary.json': JSON.stringify(data, null, 2),
//   };
// }

