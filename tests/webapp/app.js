import express from 'express';
import mockApis from './mock-apis';
import path from 'path';

const app = express();
app.use(express.static(path.join(__dirname, '../../dist/dev/')));

app.get('/api/auth/me', (req, res) => mockApis.getAuthMe(req, res));
app.post('/api/auth/login', (req, res) => mockApis.postAuthLogin(req, res));
app.put('/api/users/:username', (req, res) => mockApis.putUsersUsername(req, res));

app.get('/api/users/:username/logs', (req, res) => mockApis.getUsersUsernameLogs(req, res));

app.get('/api/users/:username/profile', (req, res) => mockApis.getUsersUsernameProfile(req, res));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../../dist/dev/index.html')));

export default app;
