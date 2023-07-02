import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { heading, panel, text } from '@metamask/snaps-ui';
import { getSmartAccount } from './getSmartAccount';
import { Client, Presets } from "userop";
import { ethers } from 'ethers';

const aa_transact = async() => {
  const rpcUrl ='https://api.stackup.sh/v1/node/30f261fef450031ac169889e4fc638d4526de1808ae25bd0c6d4609a323d671c';
  const simpleAcc = await getSmartAccount();
  const client = await Client.init(rpcUrl);
  
  const walletAddress : any = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'prompt',
      content: panel([
        heading('What is the wallet address?'),
        text('Please enter the wallet address to be monitored'),
      ]),
      placeholder: '0x123...',
    },
  });

  
  const target = ethers.utils.getAddress(walletAddress);
  const value = ethers.utils.parseEther("0.0001");
  const aaTx = await client.sendUserOperation(
    simpleAcc.execute(target,value,"0x"),
    { onBuild: (op) => console.log("Signed UserOperation:", op) }
  );
  return aaTx;

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
      const aaTxn = await aa_transact();
      const userOpHash = aaTxn.userOpHash
      const ev = await aaTxn.wait();
      const txHash : any = ev?.transactionHash;
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            heading(`Your UserOP hash is :`),
            text(userOpHash),
            heading(`Your Transaction hash is :`),
            text(txHash)
          ]),
        },
      });

    default:
      throw new Error('Method not found.');
  }
};
