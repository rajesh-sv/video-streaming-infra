const { NODE_ENV, S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } =
  process.env;

const PORT = process.env.PORT || 80;

return {
  NODE_ENV,
  BUCKET,
  PORT,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
};
