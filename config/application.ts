import {DatabaseConfig} from "../util/types"

/**
 * Application configuration
 * @class ApplicationConfig
 * @classdesc Application configuration
 * @export ApplicationConfig
 */
export default class ApplicationConfig {
    /**
     * Application port
     * @static
     * @type {number}
     * @memberof ApplicationConfig
     * @default 3000
     * @readonly
     * @public
     * @example
     * // Set application port
     * static PORT: number = 3000
     * @remarks This property is static and should be set before application start.
     */
    static PORT: number = 3000

    /**
     * Database configuration
     * @remarks Set mongodb database configuration using {@link DatabaseConfig} interface.
     * @static
     * @type {DatabaseConfig}
     * @memberof ApplicationConfig
     * @readonly
     * @public
     * @example
     * // Set database configuration
     * static DATABASE: DatabaseConfig = {
     *   host: '10.0.0.1',
     *   port: 27017,
     *   user: 'root',
     *   password: 'zaq1@WSX',
     *   database: 'myDB'
     * }
     */
    static DATABASE: DatabaseConfig = {
        host: '127.0.0.1',
        port: 27017,
        user: null,
        password: null,
        database: 'ponygram'
    }
}
