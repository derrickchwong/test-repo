module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['features/step_definitions/**/*.ts', 'features/support/**/*.ts'],
    format: ['summary', 'progress-bar'],
    publishQuiet: true,
    timeout: 2000,
  },
};
