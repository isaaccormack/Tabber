/**
 * Simple wrapper around console.log which only logs if env DEBUG flag is set
 */
export function debugLogger(msg: any): void {
    process.env.DEBUG && console.log(msg)
}
