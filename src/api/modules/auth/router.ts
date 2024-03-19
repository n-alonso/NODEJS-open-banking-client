import Router from "@koa/router";
import passport from "koa-passport";
import * as jwt from "jsonwebtoken";
import winston from "winston";
import { Logger } from "../../../libs/logger";

export class AuthRouter {
    private readonly authRouter: Router;
    private readonly logger: winston.Logger;

    public constructor() {
        this.logger = new Logger(AuthRouter.name).getLogger();
        this.authRouter = new Router({ prefix: "/auth" });

        this.authRouter.get("/google", (ctx, next) => {
            const token: string | undefined = ctx.cookies.get("auth_token");
            if (token) {
                try {
                    jwt.verify(token, process.env.JWT_SECRET as string);
                    ctx.response.body = { message: "Already authenticated" };
                    return;
                } catch (err: unknown) {
                    // Nothing to do here, the token was not valid so gotta proceed with authentication
                }
            }

            passport.authenticate("google", {
                scope: ["profile", "email"],
            })(ctx, next);
        });

        this.authRouter.get("/google/callback", (ctx, next) =>
            passport.authenticate("google", (err, user, info) => {
                if (err) {
                    this.logger.error(err);
                    ctx.throw(500, err.message);
                }
                if (!user) {
                    ctx.throw(500, "Did not receive a user");
                }

                const token: string = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, {
                    expiresIn: "2 weeks",
                });

                ctx.cookies.set("auth_token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    expires: new Date(Date.now() + 2 * 604800000), // 2 weeks
                });
                ctx.response.body = { message: "Authentication successful", user: { id: user.id }, info: info };
                return;
            })(ctx, next),
        );

        this.authRouter.get("/logout", (ctx) => {
            ctx.cookies.set("auth_token", "", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                expires: new Date(1),
            });
            ctx.response.body = { message: "Logged out successfully" };
        });
    }
    public getRouter(): Router {
        return this.authRouter;
    }
}
