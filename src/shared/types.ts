
// TypeScript does not treat Uuid any different from a string
// Uuid is only used as an indicator to developers when a variable should only contain a UUID string
// Same goes for Int.
export type Uuid = string
export type Int = number
export type Hash = string