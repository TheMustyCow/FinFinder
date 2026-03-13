const awsConfig = {
    Auth: {
        region: "us-west-2",
        userPoolId: "YOUR_USER_POOL_ID",
        userPoolWebClientId: "YOUR_CLIENT_ID",
        authenticationFlowType: "USER_PASSWORD_AUTH"
    }
};

export default awsConfig;