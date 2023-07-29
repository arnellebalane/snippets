import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

export const loadSecretsToEnvironment = async () => {
    const client = new SecretsManagerClient({});
    const command = new GetSecretValueCommand({
        SecretId: process.env.DATABASE_URL_SECRET_ARN,
    });
    const secret = await client.send(command);

    process.env.DATABASE_URL = secret.SecretString;
};
