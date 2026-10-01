import express from 'express';
import { bootstrap } from './src/app.router.js';



const app = express();
const PORT = process.env.PORT || 3000;


bootstrap(app, express);


app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});