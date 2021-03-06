import { resolve } from 'path';
import { coerce } from 'semver';
import { config as loadEnv } from 'dotenv';
import { sync as osLocale } from 'os-locale';
import { autoParse, sortedUniq } from '@lykmapipo/common';
import {
  compact,
  forEach,
  get as grab,
  isEmpty,
  last,
  map,
  merge,
  once,
  set as define,
  toLower,
  toNumber,
  toString,
  trim,
  uniq,
  size as sizeOf,
} from 'lodash';

/**
 * @function load
 * @name load
 * @description Load environment variables from .env file only once
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.7.0
 * @version 0.2.0
 * @static
 * @public
 * @example
 * const { load } = require('@lykmapipo/env');
 * const env = load();
 *
 */
export const load = once(() => {
  // ensure BASE_PATH
  const BASE_PATH = process.env.BASE_PATH || process.cwd();
  // load .env file
  const path = resolve(BASE_PATH, '.env');
  return loadEnv({ path });
});

/**
 * @function mapToNumber
 * @name mapToNumber
 * @description Convert provided value to number
 * @param {*} value valid value
 * @returns {number} value as number
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.7.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 * const { mapToNumber } = require('@lykmapipo/env');
 * const age = mapToNumber('3.2'); //=> 3.2
 *
 */
export const mapToNumber = value => toNumber(value);

/**
 * @function mapToString
 * @name mapToString
 * @description Convert provided value to string
 * @param {*} value valid value
 * @returns {string} value as string
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.7.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 * const { mapToString } = require('@lykmapipo/env');
 * const age = mapToString(3.2); //=> '3.2'
 *
 */
export const mapToString = value => toString(value);

/**
 * @function set
 * @name set
 * @description Set environment variable
 * @param {string} key value key
 * @param {*} [value] value to set on key
 * @returns {*} environment value
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 * const { set } = require('@lykmapipo/env');
 * const BASE_PATH = set('BASE_PATH', process.cwd());
 *
 */
export const set = (key, value) => {
  define(process.env, key, value);
  return value;
};

/**
 * @function get
 * @name get
 * @description Get environment variable
 * @param {string} key value key
 * @param {*} [defaultValue] value to return if key not exists
 * @returns {*} environment value
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 * const { get } = require('@lykmapipo/env');
 * const BASE_PATH = get('BASE_PATH', process.cwd());
 *
 */
export const get = (key, defaultValue) => {
  // ensure .env is loaded
  load();
  // get value
  const value = grab(process.env, key, defaultValue);
  return value;
};

/**
 * @function clear
 * @name clear
 * @description Clear environment variables
 * @param {...string} keys valid keys
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.9.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 * const { clear } = require('@lykmapipo/env');
 * clear('BASE_PATH');
 * process.env.BASE_PATH //=> undefined
 *
 */
export const clear = (...keys) => {
  forEach([...keys], key => {
    delete process.env[key];
  });
};

/**
 * @function getArray
 * @name getArray
 * @description Get array value from environment variable
 * @param {string} key value key
 * @param {Array} [defaultValue] value to return if key not exists
 * @returns {Array} environment value
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 * const { getArray } = require('@lykmapipo/env');
 * const categories = getArray('CATEGORIES'); //=> ['Fashion', 'Technology']
 *
 */
export const getArray = (key, defaultValue) => {
  let value = [].concat(defaultValue);
  if (!isEmpty(key)) {
    value = [...value, ...get(key, '').split(',')];
  }
  value = map(value, trim);
  value = uniq(compact(value));
  return value;
};

/**
 * @function getNumbers
 * @name getNumbers
 * @description Get array of numbers from environment variable
 * @param {string} key value key
 * @param {number[]} [defaultValue] value to return if key not exists
 * @returns {number[]} environment value
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 * const { getNumbers } = require('@lykmapipo/env');
 * const ages = getNumbers('AGES'); //=> [11, 18]
 *
 */
export const getNumbers = (key, defaultValue) => {
  let numbers = getArray(key, defaultValue);
  numbers = map(numbers, mapToNumber);
  return numbers;
};

/**
 * @function getNumber
 * @name getNumber
 * @description Get number value from environment variable
 * @param {string} key value key
 * @param {number} [defaultValue] value to return if key not exists
 * @returns {number} environment value
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 * const { getNumber } = require('@lykmapipo/env');
 * const defaultAge = getNumber('DEFAULT_AGE'); //=> 11
 *
 */
export const getNumber = (key, defaultValue) => {
  let value = get(key, defaultValue);
  value = value ? mapToNumber(value) : value;
  return value;
};

/**
 * @function getString
 * @name getString
 * @description Get string value from environment variable
 * @param {string} key value key
 * @param {string} [defaultValue] value to return if key not exists
 * @returns {string} environment value
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 * const { getString } = require('@lykmapipo/env');
 * const category = getString('DEFAULT_CATEGORY'); //=> 'Fashion'
 *
 */
export const getString = function getString(key, defaultValue) {
  let value = get(key, defaultValue);
  value = value ? mapToString(value) : value;
  return value;
};

/**
 * @function getStrings
 * @name getStrings
 * @description Get array of strings from environment variable
 * @param {string} key value key
 * @param {string[]} [defaultValue] value to return if key not exists
 * @returns {string[]} environment value
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 * const { getStrings } = require('@lykmapipo/env');
 * const categories = getStrings('CATEGORIES');
 * //=> ['Fashion', 'Technology']
 *
 */
export const getStrings = (key, defaultValue) => {
  let strings = getArray(key, defaultValue);
  strings = map(strings, mapToString);
  return strings;
};

/**
 * @function getStringSet
 * @name getStringSet
 * @description Get array of unique sorted strings from environment variable
 * @param {string} key value key
 * @param {string[]} [defaultValue] value to return if key not exists
 * @returns {string[]} environment value
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.11.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 * const { getStringSet } = require('@lykmapipo/env');
 * const categories = getStringSet('CATEGORIES');
 * //=> ['Fashion', 'Technology']
 *
 */
export const getStringSet = (key, defaultValue) => {
  let strings = getStrings(key, defaultValue);
  strings = sortedUniq(strings);
  return strings;
};

/**
 * @function getBoolean
 * @name getBoolean
 * @description Get boolean value from environment variable
 * @param {string} key value key
 * @param {boolean} [defaultValue] value to return if key not exists
 * @returns {boolean} environment value
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 * const { getBoolean } = require('@lykmapipo/env');
 * const debug = getBoolean('DEBUG'); //=> true
 *
 */
export const getBoolean = (key, defaultValue) => {
  let value = get(key, defaultValue);
  if (value === 'false') {
    value = false;
  }
  if (value === 'true') {
    value = true;
  }
  value = value ? Boolean(value) : value;
  return value;
};

/**
 * @function getObject
 * @name getObject
 * @description Get plain object value from environment variable
 * @param {string} key value key
 * @param {object} [defaultValue={}] value to return if key not exists
 * @returns {object} environment value
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.10.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const { getObject } = require('@lykmapipo/env');
 *
 * const object = getObject('OBJECT');
 * // => { lead: { ref: 'Person' } ... }
 *
 * const object = getObject('OBJECT_NOT_EXIST');
 * // => {}
 *
 */
export const getObject = (key, defaultValue = {}) => {
  let value = get(key, defaultValue);
  value = value ? autoParse(value) : value;
  return value;
};

/**
 * @function is
 * @name is
 * @description Check if node environment is same as given
 * @param {string} env value of env to test
 * @returns {boolean} true if its a tested node environment else false
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 * const { is } = require('@lykmapipo/env');
 * const test = is('TEST'); //=> true
 *
 */
export const is = env => toLower(get('NODE_ENV')) === toLower(env);

/**
 * @function isTest
 * @name isTest
 * @description Check if node environment is test
 * @returns {boolean} true if its a test node environment else false
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 * const { isTest } = require('@lykmapipo/env');
 * const test = isTest(); //=> true
 *
 */
export const isTest = () => is('test');

/**
 * @function isDevelopment
 * @name isDevelopment
 * @description Check if node environment is development
 * @returns {boolean} true if its a development node environment else false
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 * const { isDevelopment } = require('@lykmapipo/env');
 * const isDev = isDevelopment(); //=> true
 *
 */
export const isDevelopment = () => is('development');

/**
 * @function isProduction
 * @name isProduction
 * @description Check if node environment is production
 * @returns {boolean} true if its a production node environment else false
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 * const { isProduction } = require('@lykmapipo/env');
 * const isProd = isProduction(); //=> true
 *
 */
export const isProduction = () => is('production');

/**
 * @function isLocal
 * @name isLocal
 * @description Check if node environment is development or test
 * @returns {boolean} true if its a development or test node environment
 * else false
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 * const { isLocal } = require('@lykmapipo/env');
 * const local = isLocal(); //=> true
 *
 */
export const isLocal = () => isTest() || isDevelopment();

/**
 * @function isHeroku
 * @name isHeroku
 * @description Check if runtime environment is heroku
 * @returns {boolean} true if its runtime environment is heroku else false
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 * const { isHeroku } = require('@lykmapipo/env');
 * const heroku = isHeroku(); //=> true
 *
 */
export const isHeroku = () => toLower(get('RUNTIME_ENV')) === 'heroku';

/**
 * @function apiVersion
 * @name apiVersion
 * @description Parse api version from environment variable
 * @param {object} [optns] valid options
 * @param {string} [optns.version=1.0.0] value to use to parse api version
 * @param {string} [optns.prefix=v] prefix to set on parsed api version
 * @param {boolean} [optns.major=true] whether to allow major part
 * @param {boolean} [optns.minor=false] whether to allow minor part
 * @param {boolean} [optns.patch=false] whether to allow patch part
 * @returns {string} parsed environment api version
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 * const { apiVersion } = require('@lykmapipo/env');
 * const version = apiVersion(); //=> v1
 * const version = apiVersion({ version: '2.0.0' }); //=> v2
 *
 */
export const apiVersion = optns => {
  // ensure options
  const options = merge(
    {},
    {
      version: '1.0.0',
      prefix: 'v',
      major: true,
      minor: false,
      patch: false,
    },
    optns
  );
  const { version, prefix, minor, patch } = options;

  // parse api version
  const parsedVersion = coerce(getString('API_VERSION', version));

  // prepare exposed api version
  let parsedApiVersion = parsedVersion.major;

  // allow minor
  if (minor) {
    parsedApiVersion = [parsedVersion.major, parsedVersion.minor].join('.');
  }

  // allow patch
  if (patch) {
    parsedApiVersion = [
      parsedVersion.major,
      parsedVersion.minor,
      parsedVersion.patch,
    ].join('.');
  }

  // return prefixed api version
  parsedApiVersion = `${prefix}${parsedApiVersion}`;
  return parsedApiVersion;
};

/**
 * @function getLocale
 * @name getLocale
 * @description Obtain runtime locale
 * @param {string} [defaultLocale='sw'] valid default locale
 * @returns {string} valid runtime locale
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.9.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 * const { getLocale } = require('@lykmapipo/env');
 * const locale = getLocale(); //=> sw
 *
 */
export const getLocale = (defaultLocale = 'sw') => {
  // obtain os locale
  let locale = osLocale() || osLocale({ spawn: false }) || defaultLocale;

  // switch with environment locale
  locale = getString('DEFAULT_LOCALE', locale);

  // return derived locale
  return locale;
};

/**
 * @function getCountryCode
 * @name getCountryCode
 * @description Obtain runtime country code
 * @param {string} [defaultCountryCode='TZ'] valid default country code
 * @returns {string} valid runtime country code
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.9.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 * const { getCountryCode } = require('@lykmapipo/env');
 * const countryCode = getCountryCode(); //=> TZ
 *
 */
export const getCountryCode = (defaultCountryCode = 'TZ') => {
  // obtain runtime country code
  let countryCode = defaultCountryCode;

  // obtain from os locale parts
  if (sizeOf(getLocale().split('_')) > 1) {
    countryCode = last(getLocale().split('_'));
  }

  // obtain from os locale parts
  if (sizeOf(getLocale().split('-')) > 1) {
    countryCode = last(getLocale().split('-'));
  }

  // switch with environment country code
  countryCode = getString('DEFAULT_COUNTRY_CODE', countryCode);

  // return derived country code
  return countryCode;
};
