import mongoose from "mongoose";

const connectDatabase = async () => {
  const mongoDbUrl = process.env.MONGO_DB_URL;
  mongoose.Promise = global.Promise;

  mongoose
    .connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to the database");
    })
    .catch((err) => {
      console.log(
        `Could not connect to the database. Exiting now ... \n${err}`
      );
    });
};
export default { connectDatabase };
