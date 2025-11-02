import express from 'express';

const app = express();
app.get('/', (_req, res) => {
  res.json({ ok: true, message: 'Hello, GitHub Actions!' });
});

const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Server listening on :${port}`));
}

export default app;
// test pipeline trigger
