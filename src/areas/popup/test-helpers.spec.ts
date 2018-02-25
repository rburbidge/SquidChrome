/** Setup CSS after each test has run. */
afterEach(() => {
    // Set body class on the test div ID created by karma. Do this after each test runs because it was not available in beforeEach()
    const testDivId = 'root0';
    $(`#${testDivId}`).addClass("squid-body")
});