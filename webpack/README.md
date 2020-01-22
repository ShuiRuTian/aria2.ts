## about tsconfig.json in current folder
This file should only be used for the typescript verion of webpack config file.

0. ts-node could run TypeScript fies without compiling it to plain JavaScript first.
1. corss-env could assign environment variables for node.
2. ts-node use environment variable TS_NODE_PROJECT as the path to TypeScript JSON project file
So, we could use corss-env to assign process.env.TS_NODE_PROJECT as this file to let ts-node use as tsconfig.
As for why webpack will use ts-node automatically for ts config file, I do not know.


## Why not put webpack config in root path?
The main purpose is to let vscode could give error correctly.

It seems that vscode only read a file named tsconfig.json as configuration.
You can exclude these ts files, but you could not applay another tsconfig file whose name is not tsconfig.json on these.

Surely that we could use code like
```
cross-env TS_NODE_PROJECT=\"tsconfig-for-webpack-config.json\" webpack"
```
to let it run correctly, but it would just display error.