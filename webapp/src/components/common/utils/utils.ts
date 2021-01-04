export const throwFormattedError = (msg: string, statusCode: number, statusText: string) => {
  throw new Error(msg + ': ' + statusCode + ' (' + statusText + ')');
}