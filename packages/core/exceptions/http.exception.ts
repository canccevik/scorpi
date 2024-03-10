export class HttpException extends Error {
  constructor(
    public readonly payload: Object | string,
    public readonly statusCode: number
  ) {
    super()
  }

  public static createPayload(
    payload?: Object | string,
    description?: string,
    statusCode?: number
  ): object {
    if (typeof payload === 'object') {
      return payload
    }
    return { statusCode, message: payload, error: description }
  }
}
