const injectSession = (req, res, sessions) => {
  req.session = sessions.get(req.cookies.sessionId);
}

class Sessions {
  #sessions;

  constructor() {
    this.#sessions = {};
  }

  create(sessionData) {
    const time = new Date();
    sessionData.date = time;
    sessionData.sessionId = time.getTime();
    this.#sessions[time.getTime()] = sessionData;

    return time.getTime();
  }

  delete(sessionId) {
    delete this.#sessions[sessionId];
  }

  get(sessionId) {
    return this.#sessions[sessionId];
  }
}

module.exports = { Sessions, injectSession };
