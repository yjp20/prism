import * as pino from 'pino';

/**
 * Creates special instance of pino logger that prevent collecting or logging anything
 * Unfortunately disabled logger didn't work
 */
export function createTestLogger() {
  const logger = pino({});

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const noop = () => {};
  logger.info = noop;
  logger.success = noop;
  logger.error = noop;
  logger.warn = noop;
  logger.child = () => logger;

  return logger;
}
