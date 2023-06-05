import Timestamp from "../lib/timestamp.ts"

export type VoidCallback = () => void

export type UUID = `${string}-${string}-${string}-${string}-${string}`

export type Filter = "rotate" | "resize" | "grayscale" | "blur" | "sharpen" | "reformat" | "crop" | "flip" | "negate" | "tint"

export type Status = "original" | `modified-${number}` | Filter

export type History = {
    status: Status
    timestamp: Timestamp
}

export type Tag = {
    name: string
}

/**
 * Database configuration
 * @interface DatabaseConfig
 * @export DatabaseConfig
 * @property {string} host - Database host (default: localhost)
 * @property {number} port - Database port (default: 27017)
 * @property {string} user - Database user (default: none)
 * @property {string} password - Database password (default: none)
 * @property {string} database - Database name (default: MyDatabase)
 * @example
 * // Set database configuration
 * static DATABASE: DatabaseConfig = {
 *    host: '10.0.0.1',
 *    port: 27017,
 *    user: 'root',
 *    password: 'zaq1@WSX',
 *    database: 'myDB'
 * }
 * @remarks For use with MongoDB in ApplicationConfig
 * @see {@link ApplicationConfig}
 */
export type DatabaseConfig = {
    host: string,
    port: number,
    user: string,
    password: string,
    database: string
}
