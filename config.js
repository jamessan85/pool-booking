import dotenv from "dotenv";
const env = dotenv.config().parsed;
export default {
  EMAIL_ADDRESS: env.EMAIL_ADDRESS,
  PASSCODE: env.PASSCODE,
};
