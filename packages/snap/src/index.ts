import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { divider, heading, panel, text } from '@metamask/snaps-ui';
import { getSmartAccount } from './getSmartAccount';
import { Client, Presets } from "userop";
import { ethers } from 'ethers';
import { pimlicoPaymaster } from './pimlicoPaymaster';
import { stackupPaymaster } from './stackupPaymaster';

const aa_transact = async(walletAddress : any,amount : any) => {
  const rpcUrl ='https://api.stackup.sh/v1/node/30f261fef450031ac169889e4fc638d4526de1808ae25bd0c6d4609a323d671c';
  const simpleAcc = await getSmartAccount();
  const client = await Client.init(rpcUrl);


  
  const target = ethers.utils.getAddress(walletAddress);
  const value = ethers.utils.parseEther(amount);
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
    
    case 'sendAATx':{
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
      const amount : any = await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'prompt',
          content: panel([
            heading('What is the transfer amount?'),
            text('Please enter the amount to be transferred'),
          ]),
          placeholder: '0.001 ETH...',
        },
      });
      const eth_amount = ethers.utils.parseEther(amount);
      const value = eth_amount.toString();
      const addr = ethers.utils.getAddress(walletAddress);
      const target = addr.toString();
      const paymsterchoice = await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'prompt',
          content: panel([
            heading('Choose Paymaster for Transaction'),
            text('A) StackUp'),
            text('B) Pimlico'),
            text('C) Pimlico ERC20 Paymaster'),
            divider(),
          ]),
          placeholder: 'Choose A or B or C',
        },
      });
      if(paymsterchoice === 'A'){
          const tx = await stackupPaymaster(target,value,"0x");
      }
      else {
          await pimlicoPaymaster(target,value,"0x");
      }
    }
    break;
    default:
      throw new Error('Method not found.');
  }
};
