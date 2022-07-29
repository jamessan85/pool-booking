import express from "express";
const app = express();
import { saveData, getData } from "./queries.js";
import runPuppet from "./puppeteer.js";
import nodemailer from "nodemailer";
import config from "./config.js";

// create nodemailer transporter gmail account
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  auth: { user: config.EMAIL_ADDRESS, pass: config.PASSCODE },
  secure: true,
  port: 465,
});

const sendMail = async ({ toEmail, date, time }) => {
  await transporter.sendMail({
    from: `"Hayton pool alert" < ${config.EMAIL_ADDRESS} >`, // sender address
    to: toEmail,
    subject: "Pool booking available", // Subject line
    html: `<b>Pool can now be booked at the date and time you requested, ${date} ${time} </b>`, // html body
  });
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", async (req, res, next) => {
  try {
    await saveData(req.body);
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

const ONE_DAY = 24 * 60 * 60 * 1000;

setInterval(() => {
  getData().then(async (data) => {
    try {
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        console.log("running row " + i);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const res = await runPuppet(row);
        if (res.includes(row.time)) {
          console.log(`send email ${row.email}`);
          await sendMail({
            toEmail: row.email,
            date: row.date,
            time: row.time,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
}, ONE_DAY);

app.use((err, req, res, next) => {
  console.log(err);
  res.render("error", { message: err.message });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
