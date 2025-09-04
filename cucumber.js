module.exports = {
  default: {
    format: [
      'progress-bar',
      'html:cucumber-report.html'
    ],
    paths: ['features/**/*.feature'],
    require: ['features/step_definitions/**/*.ts'],
    requireModule: ['ts-node/register'],
        stepTimeout: 2 * 1000,
  }
};
