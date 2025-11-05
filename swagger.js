const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Course Project API",
    version: "1.0.0",
    description: "Auth, Users, Inventories, Items"
  },
  servers: [{ url: process.env.BACKEND_URL}],
  paths: {
    "/api/auth/register": {
      post: {
        summary: "Register",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password", "username"],
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                  username: { type: "string" }
                }
              }
            }
          }
        },
        responses: { "201": { description: "Created" } }
      }
    },
    "/api/auth/login": {
      post: {
        summary: "Login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string" },
                  password: { type: "string" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "OK" } }
      }
    },
    "/api/inventories": {
      get: { summary: "Search inventories", responses: { "200": { description: "OK" } } },
      post: { summary: "Create inventory", responses: { "201": { description: "Created" } } }
    },
    "/api/items": {
      post: { summary: "Create item", responses: { "201": { description: "Created" } } }
    }
  }
};

export default swaggerSpec;
