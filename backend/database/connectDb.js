import mongoose from "mongoose";
export const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("CONNECTED TO DB");
  } catch (error) {
    console.log("Couldnt connect to db");
    console.log(error);
    process.exit(1);
  }
};
