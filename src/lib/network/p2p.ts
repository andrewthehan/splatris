import Peer, { type DataConnection } from 'peerjs';

export async function open(peer: Peer): Promise<string> {
  return new Promise((resolve) => {
    peer.on('open', (id) => resolve(id));
  });
}

export function listenForConnections(peer: Peer): Promise<DataConnection> {
  return new Promise((resolve) => {
    peer.on('connection', (connection) => connection.on('open', () => resolve(connection)));
  });
}

export function sendData<T>(connection: DataConnection, data: T) {
  console.log('Sending data:', data);
  connection.send(data);
}

export function listenForData<T>(connection: DataConnection, dataHandler: (data: T) => void) {
  connection.on('data', (data) => {
    console.log('Received data:', data);
    dataHandler(data as T);
  });
}
