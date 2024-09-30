import dbConnect from "@/db/Connect";
import UserModel from "@/models/UserModel";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();
        const dbUserName = username ? username.toLowerCase() : username;
        const emailExists = await UserModel.findOne({ email: email });
        if (emailExists) {
            return Response.json({ type: 'error', message: 'Email is already taken' });
        }
        const userNameExists = await UserModel.findOne({ username: dbUserName });
        if (userNameExists) {
            return Response.json({ type: 'error', message: 'Username is already taken' });
        }
        const encryptedPass = await bcrypt.hash(password, 10);
        const tokenExpiry = new Date();
        tokenExpiry.setHours(tokenExpiry.getHours() + 1)
        const newUser = new UserModel({ username, email, password: encryptedPass, tokenExpiredTill: tokenExpiry, messages: [] });
        await newUser.save();
        return Response.json({ type: 'success', message: 'User registered successfully !!' })
    } catch (error) {
        console.log('Error occured on registration :' + error);
        return Response.json({ type: 'error', message: 'Registration Failed' })
    }

}

