import {users} from "../dummyData/data.js"
import Transaction from "../models/transaction.model.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
const userResolver ={
    Query:{
        authUser:async(_,__,context)=>{
            try {
                const user = await context.getUser()
                return user;
            } catch (error) {
                console.log("Error in authUser", err);
                throw new Error("Internal server error")
            }
        },
        user:async (_,{userId})=>{
          try {
              const user = await User.findById(userId);
              return user;
          } catch (error) {
            console.log("Error is user query:", error)
            throw new Error(err.message || "Error getting user");
          }
        }
    },
    Mutation:{
        signUp:async(_,{input},context)=>{
            try {
                const {username,name,password,gender} = input;
                if(!username || !name || !password || gender){
                    throw new Error("All fields are required")
                }

                const existingUser = await User.findOne({username})

                if(existingUser){
                    throw new Error("User already exists")
                }

                const salt = bcrypt.genSalt(10);
                const hashedPassword = bcrypt.hash(password,salt);

                const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
                const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

                const newUser = new User({
                    username,
                    name,
                    password:hashedPassword,
                    gender,
                    profilePicture:gender === "male" ? boyProfilePic : girlProfilePic
                })


                await newUser.save();
                await context.login(newUser)
                return newUser;
            } catch (error) {
                console.log("error in signup: ", err)
                throw new Error(err.message || "Interval server error")
            }
        },
        login:async(_,{input},context)=>{
            try {
                const {username,password} = input;
                const {user} = await context.authenticate("graphql-local",{username,password})

                await context.login(user)
                return user;

            } catch (error) {
                console.log("Error in login: ", error)
                throw new Error(err.message || "interval server error")
            }
        },
        logout: async(_,__,context)=>{
            try {
                await context.logout()
                context.req.session.destroy((err)=>{
                    if(err) throw err;
                })

                context.res.clearCookie("connect.sid");
                return {message:"logged out successfully"} 
            } catch (error) {
                console.log("Error in login: ", error)
                throw new Error(err.message || "interval server error")
            }
        }
    },
    // TODO => ADD User/transaction relation
    User: {
		transactions: async (parent) => {
			try {
				const transactions = await Transaction.find({ userId: parent._id });
				return transactions;
			} catch (err) {
				console.log("Error in user.transactions resolver: ", err);
				throw new Error(err.message || "Internal server error");
			}
		},
	},
}

export default userResolver;