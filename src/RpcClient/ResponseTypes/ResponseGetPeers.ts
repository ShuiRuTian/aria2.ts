interface StructGetPeers{
/**
 * Percent-encoded peer ID.
 */
peerId: string;
/**
 * IP address of the peer.
 */
ip: string;
/**
 * Port number of the peer.
 */
port: string;
/**
 * Hexadecimal representation of the download progress of the peer. The highest bit corresponds to the piece at index 0. Set bits indicate the piece is available and unset bits indicate the piece is missing. Any spare bits at the end are set to zero.
 */
bitfield: string;
/**
 * true if aria2 is choking the peer. Otherwise false.
 */
amChoking: boolean;
/**
 * true if the peer is choking aria2. Otherwise false.
 */
peerChoking: boolean;
/**
 * Download speed (byte/sec) that this client obtains from the peer.
 */
downloadSpeed: number;
/**
 * Upload speed(byte/sec) that this client uploads to the peer.
 */
uploadSpeed: number;
/**
 * true if this peer is a seeder. Otherwise false.
 */
seeder: boolean;

}

export type ResponseGetPeers = Array<StructGetPeers>;
