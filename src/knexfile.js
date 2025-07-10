export const production = {
  client: "mysql2",
  debug: false,
  useNullAsDefault: true,
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    charset: "utf8",
  },
  pool: {
    min: 2,
    max: 10,
  },
};

export const development = {
  client: "mysql2",
  debug: false,
  useNullAsDefault: true,
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    charset: "utf8",
  },
  pool: {
    min: 2,
    max: 10,
  },
};
