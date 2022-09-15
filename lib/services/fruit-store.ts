import { Sequelize } from 'sequelize';
import { Dialect, Options } from 'sequelize/types/sequelize';
import AllConfigs from '../../config/config.json';

/**
 * FruitStore is the main portal for fetching fruit from any external data sources.
 * 
 * FruitStore currently supports fetching to postgres, but will eventually include a caching service.
 */

type Environment = 'development' | 'test' | 'production';

const env: Environment = process.env.APP_ENV as Environment || 'development'; 
const config = AllConfigs[env];

const options: Options = {
  host: config.host,
  dialect: config.dialect as Dialect
};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password ? config.password : undefined,
  options
);

export { sequelize };