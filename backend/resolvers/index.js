import { mergeResolvers,} from "@graphql-tools/merge";

import userResolver from "./user.resolver.js";
import transactionsResolver from "./transaction.resolver.js";

const mergedResolvers = mergeResolvers([userResolver, transactionsResolver]);

export default mergedResolvers;