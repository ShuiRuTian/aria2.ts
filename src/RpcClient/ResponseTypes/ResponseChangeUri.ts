export interface ResponseChangeUri extends Array<number>{
    /**
     * The first integer is the number of URIs deleted.
     */
    [0]: number;
    /**
     *  The second integer is the number of URIs added.
     */
    [1]: number;
    length: 2;
}
