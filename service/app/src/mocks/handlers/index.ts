import { adminHandlers } from "./admin"
import { authHandlers } from "./auth"
import { gameHandlers } from "./game"

export const handlers = [...authHandlers, ...gameHandlers, ...adminHandlers]
