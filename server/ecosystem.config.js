module.exports = {
  apps: [
    {
      name: "server",
      script: "/root/radio/server/dist/index.js",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
      },
      env_production: {
        NODE_ENV: "production",
        DATABASE_URL:
          "postgresql://postgres.lvquujcrydrprecyklwv:5QfUeqKukxH0UA0P@aws-0-us-east-1.pooler.supabase.com:5432/postgres",
        DIRECT_URL:
          "postgresql://postgres.lvquujcrydrprecyklwv:5QfUeqKukxH0UA0P@aws-0-us-east-1.pooler.supabase.com:5432/postgres",
        PASSWORD:
          "$2a$10$qnWDb2.HgxDIJqAhOGYHLOwkVBCx.8iQxMqB7Wbz6619vpzNCAauy",
        ACCESS_TOKEN_SECRET: "12345",
      },
    },
  ],
}
