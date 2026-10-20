import { app } from './app.js';
import { env } from './config/env.js';

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 [Backend] Servidor rodando com sucesso em http://localhost:${PORT}`);
  console.log(`📡 [API Health Check]: http://localhost:${PORT}/api/health`);
});
