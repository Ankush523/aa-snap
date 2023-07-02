import { ethers } from "ethers";
import { Presets } from "userop";

const entryPointAddress = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';
const factoryAddress = '0x9406Cc6185a346906296840746125a0E44976454';
const rpcUrl ='https://api.stackup.sh/v1/node/30f261fef450031ac169889e4fc638d4526de1808ae25bd0c6d4609a323d671c';
const paymasterUrl = "https://api.stackup.sh/v1/paymaster/30f261fef450031ac169889e4fc638d4526de1808ae25bd0c6d4609a323d671c"

const paymaster = {
    rpcUrl: paymasterUrl,
    context: { "type": "payg" }
}

const paymasterMiddleware = Presets.Middleware.verifyingPaymaster(
    paymaster.rpcUrl,
    paymaster.context
)

export const getSmartAccount = async() => {
    const pvt_key = await snap.request({
        method: 'snap_getEntropy',
        params: {
          version: 1,
          salt: 'foo', 
        },
      });
    
    const simpleAccount = await Presets.Builder.SimpleAccount.init(
        new ethers.Wallet(pvt_key),
        rpcUrl,
        {paymasterMiddleware},
    )

    const address = simpleAccount.getSender();
    console.log('SimpleAccount Address : ',address);
    return simpleAccount;
}