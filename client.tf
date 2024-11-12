module "client_Joe" {
  source = "../../../modules/openid-client"

  realm_id    = data.keycloak_realm.this.id
  client_name = "Joe"
  valid_redirect_uris = [
    "https://example.com",
    "https://example22.com",
    "https://example77.com",
    "https://example33.com",
    "https://example44.com",
  ]
}
