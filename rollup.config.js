import buble from 'rollup-plugin-buble';

export default {
  entry: 'src/pickathing.js',
  plugins: [ buble() ],
  format: 'umd',
  dest: 'dist/pickathing.js'
};