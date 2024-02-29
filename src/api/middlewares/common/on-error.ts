import { Context, Next } from "koa";

interface HttpError extends Error {
    status?: number;
    statusCode?: number;
}

export async function onError(ctx: Context, next: Next) {
    try {
        await next();
    } catch (err: unknown) {
        const httpError = err as HttpError;

        ctx.status = httpError.statusCode || httpError.status || 500;
        ctx.body = {
            error: {
                message: httpError.message,
                code: httpError.statusCode || httpError.status || 500,
            },
        };
    }
}
