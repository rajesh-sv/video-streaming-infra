const { NODE_ENV, JWT_PRIVATE_KEY, JWT_PUBLIC_KEY, PG_URI } = process.env;

const PORT = process.env.PORT || 80;

export { NODE_ENV, JWT_PRIVATE_KEY, JWT_PUBLIC_KEY, PG_URI, PORT };
