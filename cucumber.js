module.exports = {
  default: {
    requireModule: ['esbuild-register'],
    require: ['features/step_definitions/**/*.ts'],
    format: ['summary', 'progress-bar'],
    publishQuiet: true,
    timeout: 2000,
  },
};