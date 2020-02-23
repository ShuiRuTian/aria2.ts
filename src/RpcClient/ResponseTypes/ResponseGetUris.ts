interface StructGetUris{

uri: string;

/**
 * 'used' if the URI is in use. 'waiting' if the URI is still waiting in the queue.
 */
status: 'used'|'waiting';

}

export type ResponseGetUris = Array<StructGetUris>;
