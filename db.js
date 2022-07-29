import sqlite3 from "sqlite3";

const db = new sqlite3.Database("db.sqlite");

db.serialize(() => {
  db.run(
    "CREATE table items (id INTEGER PRIMARY KEY, email TEXT, date DATE, time TIME)",
    (err) => {
      if (err) {
        console.log("already exists", err);
      }
    }
  );
});

export default db;
