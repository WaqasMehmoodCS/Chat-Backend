import mongoose from "mongoose";
export const conn = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`db connected`);
  } catch (error) {
    console.log(`db connection error ${error.message}`);
  }
};
export const disconnect = async () => {
  try {
    await mongoose.disconnect();
    console.log(`db disconnected`);
  } catch (error) {
    console.log(`db connection error ${error.message}`);
  }
};
