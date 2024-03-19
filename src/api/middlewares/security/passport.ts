import passport from "koa-passport";
import GooglePassport from "passport-google-oauth20";
import { User } from "../../modules/users/models/user-entity";
import { IoCContainer } from "../../../core/ioc-container";
import { UserService } from "../../modules/users/service";
import { UserDto } from "../../modules/users/models/user-dto";
import { Crypto } from "../../../libs/crypto";

const googleStrategy = GooglePassport.Strategy;
const container: IoCContainer = IoCContainer.getInstance();
const userService: UserService = container.resolve(UserService.name);

passport.use(
    new googleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
        },
        async function (_accessToken, _refreshToken, profile, callback): Promise<void> {
            const crypto: Crypto = new Crypto();

            const { id, displayName, emails } = profile;
            const dto: UserDto = new UserDto(
                crypto.encrypt(id),
                crypto.encrypt(displayName),
                emails?.[0]?.value && crypto.encrypt(emails?.[0]?.value),
            );

            const user: User = await userService.findOrCreate(dto);

            return callback(null, user);
        },
    ),
);

export default passport.initialize();
