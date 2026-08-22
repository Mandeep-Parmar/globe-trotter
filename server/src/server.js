import app from "./app.js";
import { config } from "./config/env.js";

const PORT = config.PORT;

const server = app.listen(PORT, () => {
  console.log(`🚀 GlobeTrotter Backend Server running in modular architecture on http://localhost:${PORT}`);
});

export default server;
