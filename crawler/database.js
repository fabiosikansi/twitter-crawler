import {MongoClient} from 'mongodb';
import config from "../config";

class Database {
	constructor (db) {
		this.db = db;
	}

	save (object) {
		return (!this.db) ? new Promise((resolve,reject) => resolve(false)) : this.db.collection(config.db.collection).insertOne(object);
	}
}

var connect = () => new Promise ((resolve,reject) => {
	console.log("Connecting to " + config.db.url);
	MongoClient.connect(config.db.url).then(
		(db) => resolve(new Database(db)),
		(err,db) => {
			console.log(err);
			reject(new Database(false),err)
		}
	);
});

var close = (db) => {
	if(db){
        db.close();
    }
};

let db = {
    connect: connect,
    close: close
};

export default db;
