import typescript from 'rollup-plugin-typescript2';
import { outputJson } from 'fs-extra';

export default {
	input: './index.ts',

	plugins: [
		typescript(/*{ plugin options }*/)
    ],

    output: [
        {
          file: 'lib/cjs/index.js',
          format: 'cjs',
          sourcemap: true
        },
        {
          file: 'lib/esm/index.js',
          format: 'es',
          sourcemap: true
        }
      ]
}