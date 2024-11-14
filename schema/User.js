const mongoose = require("mongoose");

// Create the User schema
const UserSchema = new mongoose.Schema({
    name: { type: String, required: false },
    email: { type: String, unique: true, required: false },
    emailVerified: { type: Date, required: false },
    image: { type: String, required: false },
    hashedPassword: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    favoriteIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Favorite" }],
});

// Add a virtual `id` property to make `_id` accessible as `id`
UserSchema.virtual("id").get(function () {
    return this._id.toString();
});

// Enable virtuals in JSON serialization
UserSchema.set("toJSON", { virtuals: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = User;
