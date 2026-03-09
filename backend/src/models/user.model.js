import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: [true, "Please enter your full name"],
			trim: true,
		},
		username: {
			type: String,
			required: [true, "Please enter a username"],
			unique: true,
			index: true,
			trim: true,
		},
		email: {
			type: String,
			required: [true, "Please enter your email"],
			unique: true,
			trim: true,
			index: true,
			match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/, "Please enter a valid email"],
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
			trim: true,
			required: true,
		},
		isVerified: {
			type: Boolean,
			default: false,
			select: false,
		},
		isBanned: {
			type: Boolean,
			default: false,
			select: false,
		},
		password: {
			type: String,
			required: [true, "Please enter a password"],
			minlength: [6, "Password must be at least 6 characters long"],
			maxlength: [12, "Password cannot exceed 12 characters"],
			select: false,
			match: [
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
				"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
			],
			trim: true,
		},
	},
	{
		timestamps: true,
	},
);

userSchema.pre("save", async function () {
	if (!this.isModified("password")) {
		return;
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
};

const UserModel = mongoose.model("users", userSchema);
export default UserModel;
