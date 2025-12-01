/* eslint-disable max-classes-per-file */
/* eslint-disable no-bitwise */
/* eslint n/no-unsupported-features/node-builtins: ['error', {'ignores': ['localStorage']}] */

import { action, computed, observable } from 'mobx';

const HABITICA_API_URL = 'https://habitica.com/api/v3/';
const XCLIENT_HEADER = 'b477462a-5bb5-4040-9505-f0b049b4f0bb-HabiticaPartyProgressInfo';

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
    this.limit = Number(headers.get('X-RateLimit-Limit'));
    this.remaining = Number(headers.get('X-RateLimit-Remaining'));
    this.reset = headers.get('X-RateLimit-Reset');

    if (headers.has('Retry-After')) {
      this.retryAfter = Number(headers.get('Retry-After'));
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

  apiTokenCheckSum = '';

  // eslint-disable-next-line class-methods-use-this
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
    for (let i = 0; i < this.apiToken.length; i += 1) {
      chk += this.apiToken.charCodeAt(i);
      chk = (chk << 5) | (chk >>> 27);
    }
    this.apiTokenCheckSum = (chk & 0xFFFFFFFF).toString(16);
  }

  cacheKey(url, requiresCredentials) {
    if (requiresCredentials) return [url, this.userId, this.apiTokenCheckSum].join('|');
    return url;
  }

  static deleteOldCacheEntries() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      keys.push(localStorage.key(i));
    }

    const now = Date.now();
    let entries = keys.map((key) => ({ key: key, item: localStorage.getItem(key) }));
    entries = entries
      .map(({ key, item }) => {
        const data = JSON.parse(item);
        const age = now - data.timestamp;

        if (data !== null && (data.duration === undefined || age >= data.duration)) {
          localStorage.removeItem(key);
          return { key: key, age: null };
        }

        const { size } = new Blob([item]);
        // keep non-credentialed cache entries first
        const priority = key.indexOf('|') === -1 ? 1 : 0;
        return {
          key, age, size, priority,
        };
      })
      .filter((entry) => entry.age !== null)
      .sort((a, b) => b.age - a.age)
      .sort((a, b) => a.priority - b.priority);

    const totalSize = entries.reduce((prev, entry) => prev + entry.size, 0);
    let sizeReduction = 0;
    entries.every((entry) => {
      // stop when under 4MB
      if (totalSize - sizeReduction <= 4 * 1024 * 1024) return false;

      localStorage.removeItem(entry.key);
      sizeReduction += entry.size;
      return true;
    });
  }

  cachedFetch(url, requiresCredentials = false, cacheDuration = null) {
    if (cacheDuration !== null) {
      const cachedItem = localStorage.getItem(this.cacheKey(url, requiresCredentials));
      if (cachedItem !== null) {
        const cachedData = JSON.parse(cachedItem);

        if ((Date.now() - cachedData.timestamp) < cacheDuration) {
          return Promise.resolve(cachedData.data);
        }
        else {
          localStorage.removeItem(url);
        }
      }
    }

    const promise = this.fetch(url, requiresCredentials)
      .then((res) => res.json());

    if (cacheDuration === null) return promise;

    return promise.then((json) => {
      try {
        localStorage.setItem(
          this.cacheKey(url, requiresCredentials),
          JSON.stringify({
            timestamp: Date.now(),
            duration: cacheDuration,
            data: json,
          }),
        );
      }
      catch (e) {
        if (e instanceof QuotaExceededError) HabiticaAPI.deleteOldCacheEntries();
      }
      return json;
    });
  }

  fetch(url, requiresCredentials = false) {
    const headers = {
      'x-client': XCLIENT_HEADER,
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
            action((res) => {
              this.credentialsValid = true;
              resolve(res);
            }),
          )
          .catch(
            action((res) => {
              if (typeof res.status !== 'undefined' && res.status === 401) {
                this.credentialsValid = false;
              }
              reject(res);
            }),
          );
      });
    }
    else {
      // immediately reject if credentials are known to be invalid
      return Promise.reject(
        Response.json({
          success: false,
          error: 'invalid_credentials',
          message: 'There is no account that uses those credentials.',
        }, {
          bodyUsed: false,
          ok: false,
          status: 401,
          statusText: '',
          url: url,
        }),
      );
    }
  }

  static fetch_retry(url, params, retriesLeft) {
    return new Promise((resolve, reject) => {
      window.fetch(url, params)
        .then((res) => {
          const retryAfter = this.rateLimit.update(res.headers);

          if (res.ok) {
            resolve(res);
          }
          else if (res.status === 429 && retriesLeft > 0 && retryAfter !== null) {
            const retryAfterMS = Math.ceil(retryAfter + 1) * 1000;

            setTimeout(() => {
              this.fetch_retry(url, params, retriesLeft - 1).then(resolve, reject);
            }, retryAfterMS);
          }
          else {
            reject(res);
          }
        })
        .catch((error) => {
          throw error;
        });
    });
  }
}

export default HabiticaAPI;
