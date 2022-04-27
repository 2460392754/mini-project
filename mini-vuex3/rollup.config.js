import { uglify } from 'rollup-plugin-uglify';
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import clear from 'rollup-plugin-clear';

export default {
    plugins: [
        clear({
            targets: ['./dist']
        }),
        commonjs(),
        typescript({
            tsconfigOverride: {
                compilerOptions: {
                    declaration: true,
                    target: 'es6',
                    module: 'es6'
                },
                include: ['src/**/*.ts']
            }
        }),
        // uglify()
    ],
    input: './src/index.ts',
    output: [
        {
            format: 'esm',
            file: 'dist/index.js'
        }
    ]
};
