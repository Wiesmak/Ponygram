export default class Timestamp {
    constructor(public timestamp: number) {}

    public static fromString(timestamp: string): Timestamp {
        return new Timestamp(parseInt(timestamp))
    }

    public static now(): Timestamp {
        return new Timestamp(Date.now())
    }

    public static fromDate(date: Date): Timestamp {
        return new Timestamp(date.getTime())
    }

    public toString(): string {
        return this.timestamp.toString()
    }

    public toDate(): Date {
        return new Date(this.timestamp)
    }
}