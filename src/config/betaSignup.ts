const PROJECT = "skiflo-dev";

/** POST target for `betaSignup` (emulator in dev, Cloud Functions in production). */
export const BETA_SIGNUP_URL = import.meta.env.DEV
  ? `http://127.0.0.1:5001/${PROJECT}/us-central1/betaSignup`
  : `https://us-central1-${PROJECT}.cloudfunctions.net/betaSignup`;
