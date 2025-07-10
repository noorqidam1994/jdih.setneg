import { getDatabaseConnector } from './connection';
const connector = getDatabaseConnector();

export default (...args) => {
  return (fn) => async (req, res) => {
    req.db = connector();
    try {
      await fn(req, res);
    } finally {
      if (req.db && typeof req.db.destroy === 'function') {
        await req.db.destroy();
      }
    }
    return;
  };
};