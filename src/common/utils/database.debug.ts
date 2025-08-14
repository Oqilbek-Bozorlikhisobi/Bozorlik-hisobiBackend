export function debugDatabaseConfig(config: Record<string, any>) {

  const debugConfig = { ...config, password: config.password ? `${config.password.substring(0, 1)}****` : 'undefined' };

  // console.log('Final Database Configuration:', debugConfig);

  return config;
}
