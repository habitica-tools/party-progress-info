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
    maxRetries = null;
    rateLimit = null;

    constructor() {
        this.maxRetries = 3;
        this.rateLimit = new RateLimit(null);
    }

    fetch(url, params) {
        return this.fetch_retry(url, params, this.maxRetries);
    }

    fetch_retry(url, params, retriesLeft) {
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