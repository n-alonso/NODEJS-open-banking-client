import dotenv from "dotenv";
dotenv.config();
import { Orchestrator } from "./core/app-orchestrator";

const server: Orchestrator = Orchestrator.getInstance();
server.register();
server.bootstrap();
