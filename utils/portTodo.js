import dotenv from "dotenv";
dotenv.config();
const { TODO_NODE_PORT: port } = process.env;

export default port;
