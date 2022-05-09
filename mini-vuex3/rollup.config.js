import { uglify } from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import clear from 'rollup-plugin-clear';
import sourcemaps from 'rollup-plugin-sourcemaps';

const env = process.env.env_type;
const isProdEnv = env === 'production';

console.log('env:', env);

const plugins = [
    clear({
        targets: ['./dist'],
    }),
    sourcemaps(),
    commonjs(),
    typescript({
        sourcemap: true,
        tsconfigOverride: {
            compilerOptions: {
                declaration: true,
                target: 'es6',
                module: 'es6',
            },
            include: ['src/**/*.ts'],
        },
    }),
    // filesize()
];

if (isProdEnv) {
    plugins.push(uglify());
}

export default {
    plugins,
    input: './src/index.ts',
    output: {
        name: 'library',
        // format: 'umd',
        format: 'es',
        file: 'dist/index.js',
        sourcemap: true,
    },
};
