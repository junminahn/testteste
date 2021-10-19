const _ = require('lodash');
const { Client } = require('pg');
const format = require('pg-format');
const KcAdminClient = require('keycloak-admin').default;

const KEYCLOAK_URL = 'https://dev.oidc.gov.bc.ca';
const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID || 'admin-cli';
const KEYCLOAK_CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET;
const KEYCLOAK_USERNAME = process.env.KEYCLOAK_USERNAME;
const KEYCLOAK_PASSWORD = process.env.KEYCLOAK_PASSWORD;

const kcAdminClient = new KcAdminClient({
  baseUrl: `${KEYCLOAK_URL}/auth`,
  realmName: 'master',
});

async function main() {
  try {
    await kcAdminClient.auth({
      grantType: KEYCLOAK_CLIENT_SECRET ? 'client_credentials' : 'password',
      clientId: KEYCLOAK_CLIENT_ID,
      clientSecret: KEYCLOAK_CLIENT_SECRET,
      username: KEYCLOAK_USERNAME,
      password: KEYCLOAK_PASSWORD,
    });

    const client = new Client({
      host: PGHOST,
      port: PGPORT,
      user: PGUSER,
      password: PGPASSWORD,
    });

    const realms = await kcAdminClient.realms.find({});
    const dataset = await Promise.all(
      realms.map(async (realm) => {
        const sessions = await kcAdminClient.sessions.find({
          realm: realm.realm,
        });
        const totalActive = _.sum(_.map(sessions, 'active').map(Number));
        return [KEYCLOAK_URL, realm.realm, totalActive];
      })
    );

    const query = format(
      'INSERT INTO active_sessions (keycloak_url, realm, session_count) VALUES %L',
      dataset
    );

    await client.connect();
    await client.query(query);
    await client.end();
  } catch (err) {
    console.log(err);
  }
}

main();
