import { createApp, BUILD_ID } from './app.js';
const port = Number(process.env.PORT || 3001);
createApp().listen(port, () => console.log(`api on http://localhost:${port} (build ${BUILD_ID})`));
