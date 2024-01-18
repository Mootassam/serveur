export default (app) => {
  app.post(`/visa/add`, require('./create').default);
  app.put(`/visa/update`, require('./update').default);
  app.delete(`/visa/delete`, require('./destroy').default);
};
