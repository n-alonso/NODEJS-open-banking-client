import { IoCContainer } from "../../../../core/ioc-container";
import { OpenBankingDataSource } from "../../../../db/sources/open-banking";

export class AccountsRepository {
    private readonly container: IoCContainer;
    private readonly dataSource: OpenBankingDataSource;

    public constructor() {
        this.container = IoCContainer.getInstance();
        this.dataSource = this.container.resolve("OpenBankingDataSource");
    }

    public findBy() {}
}
