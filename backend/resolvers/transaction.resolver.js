import User from "../models/user.model.js";
import Transaction from "../models/transaction.model.js"

const transactionsResolver = {
    Query: {
        transactions: async (_, __, context) => {
            try {
                if (!context.getUser()) throw new Error("Unauthorized")
                const userId = await context.getUser()._id;
                const transaction = await Transaction.find({userId})

                return transaction

            } catch (error) {
                console.log("Error getting transactions:", error);
                throw new Error("Error getting transaction")
            }
        },
        transaction:async (_,{transactionId},)=>{
            try {
                const transaction = await Transaction.findById(transactionId)
                return transaction;
            } catch (error) {
                console.log("Error getting transaction:", error);
                throw new Error("Error gettting transaction")
            }
        },
        // TODO => add categoryStatistics query
        categoryStatistics :async (_,__,context)=>{
            if(!context.getUser()) throw new Error("Unauthorized")

            const userId = context.getUser()._id;
            const transaction = await Transaction.find({userId});
            const categoryMap={}

            transaction.forEach((transaction)=>{
                if(!categoryMap[transaction.category]){
                    categoryMap[transaction.category] = 0;
                }
                categoryMap[transaction.category] += transaction.amount;
            });

            return Object.entries(categoryMap).map(([category, totalAmount]) => ({ category, totalAmount }));
        },
    },
    Mutation: {
        createTransaction: async (_,{input},context)=>{
            try {
                const newTransaction = new Transaction({
                    ...input,
                    userId:context.getUser()._id
                })
                await newTransaction.save();
                return newTransaction;
            } catch (error) {
                console.log("Error creating transaction:", err);
                throw new Error("Error creating transaction")
            }
        },
        updateTransaction:async (_,{input})=>{
           try {
            const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId,input,{new:true});
            return updatedTransaction
           } catch (error) {
            console.log("Error updating transaction")
            throw new Error("Error updating transaction");
           }
        },
        deleteTransaction:async (_,{transactionId})=>{
            try {
                const deletedTransaction = await Transaction.findByIdAndDelete(input.transactionId);
                return deletedTransaction;
            } catch (error) {
                console.log("Error deleting transaction:",error);
                throw  new Error("erorr deleting transaction");
            }
        }
    },
    // TODO => add transaction/user relationship
    Transaction: {
		user: async (parent) => {
			const userId = parent.userId;
			try {
				const user = await User.findById(userId);
				return user;
			} catch (err) {
				console.error("Error getting user:", err);
				throw new Error("Error getting user");
			}
		},
	},
}


export default transactionsResolver