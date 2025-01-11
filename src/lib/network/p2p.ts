import Peer, { type DataConnection } from 'peerjs';

export async function open(peer: Peer): Promise<string> {
  return new Promise((resolve) => {
    peer.on('open', (id) => resolve(id));
  });
}

export async function disconnect(peer: Peer, connections: DataConnection[]) {
  console.log('Disconnecting ');
  peer.disconnect();
  connections.forEach((connection) => connection.close());
}

export function onClose(connection: DataConnection, handler: () => void) {
  connection.on('error', handler);
  connection.on('close', handler);
}

export function listenForConnections<T>(
  peer: Peer,
  block: (connection: DataConnection) => void,
  dataHandler: (data: T) => void
) {
  console.log('Listening for connections');
  peer.on('connection', async (connection) => {
    await openConnection<T>(connection, dataHandler);
    block(connection);
  });
}

export async function connect<T>(
  peer: Peer,
  id: string,
  dataHandler: (data: T) => void
): Promise<DataConnection> {
  return new Promise(async (resolve, reject) => {
    const errorHandler = (error: any) => {
      peer.off('error', errorHandler);
      reject(error);
    };
    peer.on('error', errorHandler);

    const connection = peer.connect(id);
    await openConnection<T>(connection, dataHandler);

    peer.off('error', errorHandler);
    resolve(connection);
  });
}

async function openConnection<T>(
  connection: DataConnection,
  dataHandler: (data: T) => void
): Promise<void> {
  return new Promise((resolve) => {
    connection.on('open', () => {
      console.log('Connection established', connection.peer);
      connection.on('data', (data) => {
        console.log('Received data', connection.peer, data);
        dataHandler(data as T);
      });
      resolve();
    });
  });
}

export function stopListeningForConnections(peer: Peer) {
  peer.off('connection');
}

export function sendData<T>(connections: DataConnection[], data: T) {
  connections.forEach((connection) => {
    console.log('Sending data', connection.peer, data);
    connection.send(data);
  });
}
