require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

async function migratePasswords() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const usersCollection = mongoose.connection.collection("users");
    const users = await usersCollection.find({}).toArray();

    let migrated = 0;
    let alreadyHashed = 0;

    for (const user of users) {
      if (typeof user.password !== "string") {
        continue;
      }

      // Skip passwords that are already bcrypt-hashed
      if (/^\$2[aby]\$\d{2}\$/.test(user.password)) {
        alreadyHashed++;
        continue;
      }

      const hashedPassword = await bcrypt.hash(user.password, 12);

      await usersCollection.updateOne(
        { _id: user._id },
        { $set: { password: hashedPassword } }
      );

      migrated++;
    }

    console.log(`Passwords migrated: ${migrated}`);
    console.log(`Already hashed: ${alreadyHashed}`);
  } catch (error) {
    console.error("Migration failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

migratePasswords();