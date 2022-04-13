export interface MutationResponse<T> {
  success: boolean
  result: T
  errors?: MutationError | any
}

export interface MutationError {
  message: string
  code: string
}

export interface NodeQueryResponse<T> {
  pageInfo: {
    hasNextPage: boolean
    hasPreviousPage: boolean
    startCursor: string
    endCursor: string
  }
  edges: {
    node: T
    cursor: string
  }
}

export interface ErrorQueryResponse {
  message?: string
  location?: {
    line: number
    column: number
  }
  path?: string
}

export interface OTPResponse {
  verifyId: string
  createAt: string
  expireIn: number
}
