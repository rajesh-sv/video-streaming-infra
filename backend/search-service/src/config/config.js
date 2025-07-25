const {
  NODE_ENV,
  JWT_PUBLIC_KEY,
  PG_URI,
  ELASTICSEARCH_NODE,
  ELASTICSEARCH_INDEX,
} = process.env;

const PORT = process.env.PORT || 80;

export {
  NODE_ENV,
  JWT_PUBLIC_KEY,
  PG_URI,
  ELASTICSEARCH_NODE,
  ELASTICSEARCH_INDEX,
  PORT,
};
