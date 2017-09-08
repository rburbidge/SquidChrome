import { ChromeUtil } from "./common/chrome-util";

export class Config {
    public static isDevMode: boolean = ChromeUtil.isDevMode();

    // public static squidEndpoint: string = 'http://sirnommington.com'; // prod
    public static squidEndpoint: string = 'http://localhost:3000'; // localhost
    //public static squidEndpoint: string = 'http://71.231.137.10'; // localhost public IP
}