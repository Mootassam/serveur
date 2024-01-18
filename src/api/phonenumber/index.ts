import { createRateLimiter } from '../apiRateLimiter';

export default (app) => {
  app.post(`/number/add`, require('./add').default);
  app.post(`/number/upload`, require('./upload').default);
  app.post(`/number/check`, require('./search').default);
};
