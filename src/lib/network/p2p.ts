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

export function sendData(connection: DataConnection, data: any) {
  console.log('Sending data:', data);
  connection.send(data);
}

export function listenForData(connection: DataConnection, dataHandler: (data: any) => void) {
  connection.on('data', (data) => {
    console.log('Received data:', data);
    dataHandler(data);
  });
}
