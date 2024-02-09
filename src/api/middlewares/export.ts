import { bodyParser, koaHelmet, koaLogger } from "./common.middleware";

export default [
    bodyParser(),
    koaHelmet(),
    koaLogger(),
];