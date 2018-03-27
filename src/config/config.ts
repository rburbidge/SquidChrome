export class Config {
    public static squidEndpoint: string = 'https://sirnommington.com'; // prod
    //public static squidEndpoint: string = 'http://localhost:3000'; // localhost

    /**
     * The Google Cloud Messaging sender ID. This is the "project number" defined in the Google Cloud Developer Console,
     * https://console.cloud.google.com/home/dashboard
     */
    public static gcmSenderId: string = '670316986609';

    public chromeWebStore: string = 'https://chrome.google.com/webstore/detail/squid/gipmiglmamlkehhbcicejmfloehgeklk';
    public googlePlayStore: string = 'https://play.google.com/store/apps/details?id=com.sirnommington.squid';
}