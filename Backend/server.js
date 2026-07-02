const { app, syncDatabase } = require('./app');

syncDatabase().catch((err) => {
    console.error('Error synchronizing database:', err);
});

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
});
