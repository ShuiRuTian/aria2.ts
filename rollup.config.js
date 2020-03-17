import typescript from 'rollup-plugin-typescript2';
import { outputJson } from 'fs-extra';

export default {
	input: './index.ts',

	plugins: [
		typescript(/*{ plugin options }*/)
    ],

    output: [
        {
          file: 'dist/cjs/index.js',
          format: 'cjs'
        },
        {
          file: 'dist/esm/index.js',
          format: 'es'
        }
      ]
}