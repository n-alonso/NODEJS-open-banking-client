import { IoCContainer } from "../../core/IoCContainer";
import { HealthRouter } from "./HealthRouter";
const container: IoCContainer = IoCContainer.getInstance();

export class HealthModule {
    public static register(): void {
        container.register(HealthRouter.name, new HealthRouter());
    }
}
