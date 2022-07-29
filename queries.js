import db from "./db.js";
import { isAfter, parseISO } from "date-fns";

const saveData = (data) => {
  return new Promise((resolve, reject) => {
    if (!isAfter(parseISO(data.date), new Date())) {
      reject(new Error("Invalid date"));
    }
    db.run(
      "INSERT INTO items (email, date, time) VALUES (?, ?, ?)",
      [data.email, data.date, data.time.padStart(2, "0") + ":00"],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

const getData = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM items", (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

export { saveData, getData };
