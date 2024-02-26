import passport from "koa-passport";
import GooglePassport from "passport-google-oauth20";
import { User } from "../../modules/users/models/UserEntity.interface";
import { IoCContainer } from "../../../core/IoCContainer";
import { UserService } from "../../modules/users/UserService";
import { UserDto } from "../../modules/users/models/UserDto";
import { Crypto } from "../../../libs/Crypto";

const googleStrategy = GooglePassport.Strategy;
const container: IoCContainer = IoCContainer.getInstance();
const userService: UserService = container.resolve(UserService.name);

passport.use(
    new googleStrategy(
        {
            clientID: process.env.CLIENT_ID as string,
            clientSecret: process.env.CLIENT_SECRET as string,
            callbackURL: process.env.CALLBACK as string,
        },
        async function (accessToken, refreshToken, profile, callback): Promise<void> {
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
