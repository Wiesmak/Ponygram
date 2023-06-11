import {MongoClient} from "mongodb"
import {DatabaseConfig} from "../util/types.ts"
import ApplicationConfig from "../config/application.ts"
import Colors, {colorLog} from "../util/colors.ts"

export default class Database extends MongoClient {
    public static async connect(): Promise<Database> {
        const connString = await Database.generateConnectionString(ApplicationConfig.DATABASE)
        const client = new Database(connString)
        colorLog(`Connecting to ${connString}`, Colors.fgWhite)
        try {
            await client.connect()
            colorLog(`Connected to database ${ApplicationConfig.DATABASE.database}`, Colors.fgGreen)
            return client
        } catch (e) {
            colorLog(`Error connecting to database ${ApplicationConfig.DATABASE.database}`, Colors.fgRed)
            process.exit(10)
            return
        }
    }

    public static async generateConnectionString(config: DatabaseConfig): Promise<string> {
        const {host, port, user, password, database} = config
        return `mongodb://${user ? `${user}:${password}@` : ''}${host}:${port}/${database}`
    }
}
