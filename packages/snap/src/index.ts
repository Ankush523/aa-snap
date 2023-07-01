import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { heading, panel, text } from '@metamask/snaps-ui';
import { getSmartAccount } from './getSmartAccount';
import { Client, Presets } from "userop";

const aa_transact = async() => {
  const rpcUrl ='https://api.stackup.sh/v1/node/30f261fef450031ac169889e4fc638d4526de1808ae25bd0c6d4609a323d671c';
  const simpleAcc = await getSmartAccount();
  const client = await Client.init(rpcUrl);
  const aaTx = await client.sendUserOperation(
    simpleAcc.execute("0xCF1E6Ab1949D0573362f5278FAbCa4Ec74BE913C",10000,"0x"),
    { onBuild: (op) => console.log("Signed UserOperation:", op) }
  );
  const userOpHash = aaTx.userOpHash
  console.log("UserOperation Hash:", userOpHash);
  const ev = await aaTx.wait();
  return userOpHash;
}

export const onRpcRequest: OnRpcRequestHandler = async({ origin, request }) => {
  const simpleAcc = await getSmartAccount();
  switch (request.method) {
    case 'hello':
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            text(`Hello, **${origin}**!`),
            text('This custom confirmation is just for display purposes.'),
            text(
              'But you can edit the snap source code to make it do something, if you want to!',
            ),
          ]),
        },
      });
    
    case 'getSCW':
      const scwAddress = simpleAcc.getSender();
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            heading('SCW Account Details'),
            text(`SCW Address is : ${scwAddress}`),
          ]),
        },
      });
    
    case 'sendAATx':
      const txhash = await aa_transact();
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            text(`Your transaction hash is :`),
            text(txhash),
          ]),
        },
      });

    default:
      throw new Error('Method not found.');
  }
};
