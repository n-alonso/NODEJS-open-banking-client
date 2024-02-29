import { RateLimit } from "koa2-ratelimit";

/**
 * Use:
 * 'messageKey' and 'message' for violation response
 * 'statusCode' for custom HTTP status for violation response
 * 'whitelist' to not apply to a list of IP addresses
 * 'store' for caching this data
 */

export default RateLimit.middleware({
    interval: { min: 1 },
    max: 15,
    whitelist: ["example_ip", "another_ip"],
});
