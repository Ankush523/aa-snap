// import { ethers } from "ethers";
// import { Client, Presets } from "userop";
// import { getSmartAccount } from "./getSmartAccount";

// const rpcUrl ='https://api.stackup.sh/v1/node/30f261fef450031ac169889e4fc638d4526de1808ae25bd0c6d4609a323d671c';
// const paymasterUrl = "https://api.stackup.sh/v1/paymaster/30f261fef450031ac169889e4fc638d4526de1808ae25bd0c6d4609a323d671c"

// const paymaster = {
//     rpcUrl: paymasterUrl,
//     context: {}
// }

// const paymasterMiddleware = Presets.Middleware.verifyingPaymaster(
//     paymaster.rpcUrl,
//     paymaster.context
// )

// export const sendAATxwithPaymaster = async(target : any,value : any,data :any) =>{
//     const aa = await getSmartAccount();
//     const client = await Client.init(rpcUrl);
//     const sendUserOp = await client.sendUserOperation(
//         aa.execute(target,value,data),
//         { onBuild: (op) => console.log("Signed UserOperation:", op) }
//     );
//     return sendUserOp;
// } 