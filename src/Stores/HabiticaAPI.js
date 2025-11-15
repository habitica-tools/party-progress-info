import { observable, action, computed } from "mobx";

const HABITICA_API_URL = 'https://habitica.com/api/v3/';
const XCLIENT_HEADER = 'd3c5312b-0e53-4cbc-b836-4c2a63e0ff06-HabiticaPartyProgressInfo';

class RateLimit {
  limit = null;
  remaining = null;
  reset = null;
  retryAfter = null;

  constructor(headers) {
    if (headers !== null) {
      this.update(headers);
    }
  }

  update(headers) {
    this.limit = Number(headers.get("X-RateLimit-Limit"));
    this.remaining = Number(headers.get("X-RateLimit-Remaining"));
    this.reset = headers.get("X-RateLimit-Reset");

    if (headers.has("Retry-After")) {
      this.retryAfter = Number(headers.get("Retry-After"));
    }
    else {
      this.retryAfter = null;
    }

    return this.retryAfter;
  }
}

class HabiticaAPI {
  static rateLimit = new RateLimit(null);

  maxRetries = 3;
  @observable accessor userId = null;
  @observable accessor apiToken = null;
  @observable accessor credentialsValid = true;

  apiTokenCheckSum = "";

  isValidToken(token) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(token);
  }

  @action async setCredentials(userId, apiToken) {
    this.userId = userId;
    this.apiToken = apiToken;

    // assume credentials are valid until proven otherwise
    this.credentialsValid = true;

    this.calculateApiTokenCheckSum();
  }

  @computed get hasCredentials() {
    return (
      this.isValidToken(this.userId)
      && this.isValidToken(this.apiToken)
    );
  }

  @computed get hasValidCredentials() {
    return this.hasCredentials && this.credentialsValid;
  }

  getContent() {
    return this.cachedFetch(HABITICA_API_URL + 'content', false, 30 * 60 * 1000);
  }

  getUser(userid) {
    return this.cachedFetch(HABITICA_API_URL + 'members/' + userid, true, 5 * 60 * 1000);
  }

  getPartyMembers() {
    return this.cachedFetch(HABITICA_API_URL + 'groups/party/members', true, null);
  }

  calculateApiTokenCheckSum() {
    let chk = 0x12345678;
    for (let i = 0; i < this.apiToken.length; i++) {
      chk += this.apiToken.charCodeAt(i);
      chk = (chk << 5) | (chk >>> 27);
    }
    this.apiTokenCheckSum = (chk & 0xFFFFFFFF).toString(16);
  }

  cacheKey(url, requiresCredentials) {
    if (requiresCredentials) return [url, this.userId, this.apiTokenCheckSum].join('|');
    return url;
  }

  cachedFetch(url, requiresCredentials = false, cacheDuration = null) {
    if (cacheDuration !== null) {
      let cachedItem = localStorage.getItem(this.cacheKey(url, requiresCredentials));
      if (cachedItem !== null) {
        let cachedData = JSON.parse(cachedItem);

        if ((Date.now() - cachedData.timestamp) < cacheDuration) {
          return Promise.resolve(cachedData.data);
        }
        else {
          localStorage.removeItem(url);
        }
      }
    }

    let promise = this.fetch(url, requiresCredentials)
      .then(res => res.json());

    if (cacheDuration === null) return promise;

    return promise.then(json => {
      localStorage.setItem(
        this.cacheKey(url, requiresCredentials),
        JSON.stringify({
          timestamp: Date.now(),
          duration: cacheDuration,
          data: json
        })
      );
      return json;
    });
  }

  fetch(url, requiresCredentials = false) {
    let headers = {
      'x-client': XCLIENT_HEADER
    }

    if (!requiresCredentials) {
      return HabiticaAPI.fetch_retry(url, { headers: headers });
    }

    if (this.credentialsValid) {
      headers['x-api-user'] = this.userId;
      headers['x-api-key'] = this.apiToken;

      return new Promise((resolve, reject) => {
        HabiticaAPI.fetch_retry(url, { headers: headers })
          .then(
            action(res => {
              this.credentialsValid = true;
              resolve(res);
            })
          )
          .catch(
            action(res => {
              if (typeof res.status !== 'undefined' && res.status === 401) {
                this.credentialsValid = false;
              }
              reject(res);
            })
          );
      });
    }
    else {
      // immediately reject if credentials are known to be invalid
      return Promise.reject(
        Response.json({
          success: false,
          error: "invalid_credentials",
          message: "There is no account that uses those credentials.",
        }, {
          bodyUsed: false,
          ok: false,
          status: 401,
          statusText: '',
          url: url
        })
      );
    }
  }

  static fetch_retry(url, params, retriesLeft) {
    return new Promise((resolve, reject) => {
      window.fetch(url, params)
        .then(res => {
          let retryAfter = this.rateLimit.update(res.headers);

          if (res.ok) {
            resolve(res);
          }
          else if (res.status === 429 && retriesLeft > 0 && retryAfter !== null) {
            let retryAfterMS = Math.ceil(retryAfter + 1) * 1000;

            setTimeout(() => {
              this.fetch_retry(url, params, retriesLeft - 1).then(resolve, reject);
            }, retryAfterMS);
          }
          else {
            reject(res);
          }
        })
        .catch(error => {
          throw error;
        });
    });
  }
}

export default HabiticaAPI;