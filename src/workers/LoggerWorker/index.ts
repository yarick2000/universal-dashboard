import { WorkerMessageT } from '../types';

export const dummyWorker = {
  id: 'dummyWorker',
  postMessage: (message: WorkerMessageT<any>) => {
    console.log(`Message posted to ${dummyWorker.id}:`, message);
  },
  onmessage: (callback: (message: WorkerMessageT<any>) => void) => {
    console.log(`onmessage callback set for ${dummyWorker.id}`);
    // Simulate receiving a message
    setTimeout(() => {
      callback({ type: 'data', payload: { data: 'Dummy data' } });
    }, 1000);
  },
  terminate: () => {
    console.log(`Worker ${dummyWorker.id} terminated`);
  },
};
