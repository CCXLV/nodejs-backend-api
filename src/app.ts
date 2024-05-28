import 'dotenv/config';

import express from 'express';

import { authenticateToken, authenticateExpiredToken } from './api/validation/authenticate';
import Authentication from './api/authentication';


const app = express();

app.use(express.json());

app.post('/authorization', Authentication.authorization);
app.post('/registration', Authentication.registration);
app.post('/refresh_access_token', authenticateExpiredToken, Authentication.refreshAccessToken);
app.post('/user_authorization', authenticateToken, Authentication.userAuthorization);

export default app;