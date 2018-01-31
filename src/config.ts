export class Config {
    public static squidDefaultEndpoint: string = 'https://sirnommington.com';
    
    public static endpoints: string[] = [
        Config.squidDefaultEndpoint,
        'http://localhost:3000',
        'https://sirnommington-test.azurewebsites.net',
        'https://sirnommington-ppe.azurewebsites.net'
    ];

    public static gcmSenderId: string = '670316986609';
}