import Timestamp from "../lib/timestamp.ts"

export type VoidCallback = () => void

export type UUID = `${string}-${string}-${string}-${string}-${string}`

export type Status = "original" | `modified-${number}`

export type History = {
    status: Status
    timestamp: Timestamp
}
