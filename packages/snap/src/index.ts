import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { heading, panel, text } from '@metamask/snaps-ui';
import { getSmartAccount } from './getSmartAccount';



export const onRpcRequest: OnRpcRequestHandler = async({ origin, request }) => {
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
      const scwAddress =await getSmartAccount();
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

    default:
      throw new Error('Method not found.');
  }
};
