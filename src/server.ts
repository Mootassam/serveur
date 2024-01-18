require('dotenv').config();

import api from './api';

const PORT = process.env.PORT || 8080;

api.listen(PORT, '192.168.90.76', () => {
  console.log(`Listening on port ${PORT}`);
});
