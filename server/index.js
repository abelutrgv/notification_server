let express = require('express');
let path = require('path');

const PORT = 8080;
let static_dir = path.join(__dirname, 'static');

let app = express();
app.use(express.static(static_dir));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.set("view engine", "ejs");

let db = [];

function rightTime(entry) {

	let time = new Date();
	time.setHours(time.getHours() - 5);
	var [date, hour] = time.toISOString().split('T');
	hour = hour.substring(0, 5);
	console.log(date, hour);

	if (date === entry.date && hour === entry.time) {
		return true;
	} else {
		return false;
	}

};

app.get('/', (req, res) => {
	res.redirect('/form');

});

app.get('/form', (req, res) => {
	res.render('form', {status: "none"});
});

//TODO: fix time to match region
//and delete db entry once it is sent
app.post('/form', (req, res) => {
	const sh = req.body;
	if (	sh.user.length == 0 ||
		sh.time.length == 0 ||
		sh.date.length == 0 ||
		sh.desc.length == 0 ||
		sh.title.length == 0) 
	{
		console.log("Error: missing data");
		res.render('form', {status: "error"});
	} else {
		console.log("Success: entry added");
		res.render('form', {status: "new"});
		db.push(JSON.parse(JSON.stringify(req.body)));
	}
});
app.get('/notification', (req, res) => {
	
	let should_remove = null;

	for (let x of db) {
		//if notif is found matching username, return it and exit
		if (x.user === req.body.user) {
			if (rightTime(x)) {
				console.log(req.body.user,`connected!\nsending messages...`);
				should_remove = x.user;
				res.json({notification: true, data: x});
			}
		} 
	}
	if (should_remove != null) {
		db = db.filter(e => { return e.user != should_remove });
		return;
	}
	//only runs if no user was found
	res.json({notification: false});


});

app.listen(PORT, () => console.log("Server listening on port 8080"));
