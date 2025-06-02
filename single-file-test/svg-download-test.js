import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 1,
  duration: '60s',
  insecureSkipTLSVerify: true
};

export default function () {
  const hostname = __ENV.BASE_URL || '3.79.196.112';
  let res = http.get(`https://${hostname}/resources/2rh13/login/keycloak.v2/img/keycloak-logo-text.svg`);
  check(res, { "status is 200": (res) => res.status === 200 });
  sleep(5);
}


