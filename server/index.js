let express = require('express');
let path = require('path');

const PORT = 8080;
let static_dir = path.join(__dirname, 'static');

let app = express();
app.use(express.static(static_dir));
app.use(express.json());


let db = [
	{ 	title: 'test title',
		description: 'do you work',
		date: '2024-04-20',
		time: '00:07',
		address: '127.0.0.1:8080'
	}
];

app.get('/test', (req, res) => {
	
	if (req.body.user === "abel") {
		console.log(req.body, "connected!");
		
		res.json(db);
	
	} else {
		res.json(db);
	}

});

app.get('/time', (req, res) => {

	let time = new Date();
	var [date, hour] = time.toISOString().split('T');
	hour = hour.substring(0, 5);
	console.log(date, hour);

	if (date === db[0].date && hour === db[0].time) {
		console.log("correct time!!");
		res.send({notification: true, db});
	} else {
		res.send({notification: false});
	}
})

app.listen(PORT, () => console.log("Server listening on port 8080"));
