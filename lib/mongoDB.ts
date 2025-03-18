import mongoose from "mongoose"

export const connectToDB = async(): Promise<void> => {

    if (mongoose.connection.readyState === 1) {
        console.log("MongoDB is already connected");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL || "", {
            dbName: "Admin_Panel"
        })
        console.log("MongoDB is connected")
    } catch (error) {
        console.log(error)
    }
}