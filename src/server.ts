import app from './app/app';

const PORT = 3000;

app.listen(PORT, () => {
	console.log('Express server listening on port ' + PORT);
});

module.exports = app;
