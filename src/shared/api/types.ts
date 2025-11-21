type ErrorsMessage = {
  field: string
  message: string
}

export type ErrorResponse = {
  message?: string
  errorsMessages: ErrorsMessage[]
}

export type AuthoriseError = {
  message: string
  errorsMessages: []
}
