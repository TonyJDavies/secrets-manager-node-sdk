/**
 * (C) Copyright IBM Corp. 2023.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */

const { readExternalSources } = require('ibm-cloud-sdk-core');
const SecretsManagerV2 = require('../../dist/secrets-manager/v2');
const authHelper = require('../resources/auth-helper.js');

// testcase timeout value (200s).
const timeout = 200000;

// Location of our config file.
const configFile = 'secrets_manager_v2.env';

const describe = authHelper.prepareTests(configFile);

describe('SecretsManagerV2_integration', () => {
  jest.setTimeout(timeout);

  // Service instance
  let secretsManagerService;

  // Variables to hold link values
  let configurationNameForGetConfigurationLink;
  let secretGroupIdForGetSecretGroupLink;
  let secretIdForCreateSecretVersionLink;
  let secretIdForCreateSecretVersionLocksLink;
  let secretIdForGetSecretLink;
  let secretIdForGetSecretVersionLink;
  let secretIdForListSecretLocksLink;
  let secretIdForListSecretVersionLocksLink;
  let secretNameLink;
  let secretVersionIdForCreateSecretVersionLocksLink;
  let secretVersionIdForDeleteSecretVersionLocksLink;
  let secretVersionIdForGetSecretVersionLink;
  let secretVersionIdForGetSecretVersionMetadataLink;
  let secretVersionIdForListSecretVersionLocksLink;
  let secretVersionIdForUpdateSecretVersionMetadataLink;

  test('Initialize service', async () => {
    secretsManagerService = SecretsManagerV2.newInstance();

    expect(secretsManagerService).not.toBeNull();

    const config = readExternalSources(SecretsManagerV2.DEFAULT_SERVICE_NAME);
    expect(config).not.toBeNull();

    secretsManagerService.enableRetries();
  });

  test('createSecretGroup()', async () => {
    const params = {
      name: 'my-secret-group',
      description: 'Extended description for this group.',
    };

    const res = await secretsManagerService.createSecretGroup(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(201);
    expect(res.result).toBeDefined();
    secretGroupIdForGetSecretGroupLink = res.result.id;
  });

  test('createSecret()', async () => {
    // Request models needed by this operation.

    // ArbitrarySecretPrototype
    const secretPrototypeModel = {
      custom_metadata: { metadata_custom_key: 'metadata_custom_value' },
      description: 'Description of my arbitrary secret.',
      expiration_date: '2023-10-05T11:49:42Z',
      labels: ['dev', 'us-south'],
      name: 'example-arbitrary-secret',
      secret_group_id: 'default',
      secret_type: 'arbitrary',
      payload: 'secret-data',
      version_custom_metadata: { custom_version_key: 'custom_version_value' },
    };

    const params = {
      secretPrototype: secretPrototypeModel,
    };

    const res = await secretsManagerService.createSecret(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(201);
    expect(res.result).toBeDefined();
    secretIdForGetSecretLink = res.result.id;
    secretIdForGetSecretVersionLink = res.result.id;
  });

  test('updateSecretMetadata()', async () => {
    // Request models needed by this operation.

    // ArbitrarySecretMetadataPatch
    const secretMetadataPatchModel = {
      name: 'updated-arbitrary-secret-name-example',
      description: 'updated Arbitrary Secret description',
      labels: ['dev', 'us-south'],
      custom_metadata: { metadata_custom_key: 'metadata_custom_value' },
      expiration_date: '2033-04-12T23:20:50.520Z',
    };

    const params = {
      id: secretIdForGetSecretLink,
      secretMetadataPatch: secretMetadataPatchModel,
    };

    const res = await secretsManagerService.updateSecretMetadata(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
    secretNameLink = res.result.name;
  });

  test('listSecretVersions()', async () => {
    const params = {
      secretId: secretIdForGetSecretLink,
    };

    const res = await secretsManagerService.listSecretVersions(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
    secretVersionIdForGetSecretVersionLink = res.result.versions[0].id;
    secretIdForCreateSecretVersionLink = res.result.versions[0].secret_id;
    secretVersionIdForGetSecretVersionMetadataLink = res.result.versions[0].id;
    secretVersionIdForUpdateSecretVersionMetadataLink = res.result.versions[0].id;
    secretIdForCreateSecretVersionLocksLink = res.result.versions[0].secret_id;
    secretVersionIdForCreateSecretVersionLocksLink = res.result.versions[0].id;
    secretVersionIdForDeleteSecretVersionLocksLink = res.result.versions[0].id;
  });

  test('createSecretLocksBulk()', async () => {
    // Request models needed by this operation.

    // SecretLockPrototype
    const secretLockPrototypeModel = {
      name: 'lock-example-1',
      description: 'lock for consumer 1',
      attributes: { key: 'value' },
    };

    const params = {
      id: secretIdForGetSecretLink,
      locks: [secretLockPrototypeModel],
      mode: 'remove_previous',
    };

    const res = await secretsManagerService.createSecretLocksBulk(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(201);
    expect(res.result).toBeDefined();
    secretIdForListSecretLocksLink = res.result.secret_id;
    secretIdForListSecretVersionLocksLink = res.result.secret_id;
    secretVersionIdForListSecretVersionLocksLink = res.result.versions[0].version_id;
  });

  test('createConfiguration()', async () => {
    // Request models needed by this operation.

    // PrivateCertificateConfigurationRootCAPrototype
    const configurationPrototypeModel = {
      config_type: 'private_cert_configuration_root_ca',
      name: 'example-root-CA',
      max_ttl: '43830h',
      crl_expiry: '72h',
      crl_disable: false,
      crl_distribution_points_encoded: true,
      issuing_certificates_urls_encoded: true,
      common_name: 'example.com',
      alt_names: ['alt-name-1', 'alt-name-2'],
      ip_sans: '127.0.0.1',
      uri_sans: 'https://www.example.com/test',
      other_sans: ['1.2.3.5.4.3.201.10.4.3;utf8:test@example.com'],
      ttl: '2190h',
      format: 'pem',
      private_key_format: 'der',
      key_type: 'rsa',
      key_bits: 4096,
      max_path_length: -1,
      exclude_cn_from_sans: false,
      permitted_dns_domains: ['testString'],
      ou: ['testString'],
      organization: ['testString'],
      country: ['testString'],
      locality: ['testString'],
      province: ['testString'],
      street_address: ['testString'],
      postal_code: ['testString'],
      serial_number: 'd9:be:fe:35:ba:09:42:b5:35:ba:09:42:b5',
    };

    const params = {
      configurationPrototype: configurationPrototypeModel,
    };

    const res = await secretsManagerService.createConfiguration(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(201);
    expect(res.result).toBeDefined();
    configurationNameForGetConfigurationLink = res.result.name;
  });

  test('listSecretGroups()', async () => {
    const res = await secretsManagerService.listSecretGroups();
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('getSecretGroup()', async () => {
    const params = {
      id: secretGroupIdForGetSecretGroupLink,
    };

    const res = await secretsManagerService.getSecretGroup(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('updateSecretGroup()', async () => {
    const params = {
      id: secretGroupIdForGetSecretGroupLink,
      name: 'my-secret-group',
      description: 'Extended description for this group.',
    };

    const res = await secretsManagerService.updateSecretGroup(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('listSecrets()', async () => {
    const params = {
      offset: 0,
      limit: 200,
      sort: 'created_at',
      search: 'example',
      groups: ['default', 'cac40995-c37a-4dcb-9506-472869077634'],
    };

    const res = await secretsManagerService.listSecrets(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('listSecrets() via SecretsPager', async () => {
    const params = {
      limit: 10,
      sort: 'created_at',
      search: 'example',
      groups: ['default', 'cac40995-c37a-4dcb-9506-472869077634'],
    };

    const allResults = [];

    // Test getNext().
    let pager = new SecretsManagerV2.SecretsPager(secretsManagerService, params);
    while (pager.hasNext()) {
      const nextPage = await pager.getNext();
      expect(nextPage).not.toBeNull();
      allResults.push(...nextPage);
    }

    // Test getAll().
    pager = new SecretsManagerV2.SecretsPager(secretsManagerService, params);
    const allItems = await pager.getAll();
    expect(allItems).not.toBeNull();
    expect(allItems).toHaveLength(allResults.length);
    console.log(`Retrieved a total of ${allResults.length} items(s) with pagination.`);
  });

  test('getSecret()', async () => {
    const params = {
      id: secretIdForGetSecretLink,
    };

    const res = await secretsManagerService.getSecret(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('getSecretMetadata()', async () => {
    const params = {
      id: secretIdForGetSecretLink,
    };

    const res = await secretsManagerService.getSecretMetadata(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  // The integration test for createSecretAction has been explicitly excluded from generation.
  // A test for this operation must be developed manually.
  // test('createSecretAction()', async () => {});

  test('getSecretByNameType()', async () => {
    const params = {
      secretType: 'arbitrary',
      name: secretNameLink,
      secretGroupName: 'default',
    };

    const res = await secretsManagerService.getSecretByNameType(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('createSecretVersion()', async () => {
    // Request models needed by this operation.

    // ArbitrarySecretVersionPrototype
    const secretVersionPrototypeModel = {
      payload: 'updated secret credentials',
      custom_metadata: { metadata_custom_key: 'metadata_custom_value' },
      version_custom_metadata: { custom_version_key: 'custom_version_value' },
    };

    const params = {
      secretId: secretIdForGetSecretLink,
      secretVersionPrototype: secretVersionPrototypeModel,
    };

    const res = await secretsManagerService.createSecretVersion(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(201);
    expect(res.result).toBeDefined();
  });

  test('getSecretVersion()', async () => {
    const params = {
      secretId: secretIdForGetSecretLink,
      id: secretVersionIdForGetSecretVersionLink,
    };

    const res = await secretsManagerService.getSecretVersion(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('getSecretVersionMetadata()', async () => {
    const params = {
      secretId: secretIdForGetSecretLink,
      id: secretVersionIdForGetSecretVersionLink,
    };

    const res = await secretsManagerService.getSecretVersionMetadata(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('updateSecretVersionMetadata()', async () => {
    const params = {
      secretId: secretIdForGetSecretLink,
      id: secretVersionIdForGetSecretVersionLink,
      versionCustomMetadata: { key: 'value' },
    };

    const res = await secretsManagerService.updateSecretVersionMetadata(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  // The integration test for createSecretVersionAction has been explicitly excluded from generation.
  // A test for this operation must be developed manually.
  // test('createSecretVersionAction()', async () => {});

  test('listSecretsLocks()', async () => {
    const params = {
      offset: 0,
      limit: 200,
      search: 'example',
      groups: ['default', 'cac40995-c37a-4dcb-9506-472869077634'],
    };

    const res = await secretsManagerService.listSecretsLocks(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('listSecretsLocks() via SecretsLocksPager', async () => {
    const params = {
      limit: 10,
      search: 'example',
      groups: ['default', 'cac40995-c37a-4dcb-9506-472869077634'],
    };

    const allResults = [];

    // Test getNext().
    let pager = new SecretsManagerV2.SecretsLocksPager(secretsManagerService, params);
    while (pager.hasNext()) {
      const nextPage = await pager.getNext();
      expect(nextPage).not.toBeNull();
      allResults.push(...nextPage);
    }

    // Test getAll().
    pager = new SecretsManagerV2.SecretsLocksPager(secretsManagerService, params);
    const allItems = await pager.getAll();
    expect(allItems).not.toBeNull();
    expect(allItems).toHaveLength(allResults.length);
    console.log(`Retrieved a total of ${allResults.length} items(s) with pagination.`);
  });

  test('listSecretLocks()', async () => {
    const params = {
      id: secretIdForGetSecretLink,
      offset: 0,
      limit: 25,
      sort: 'name',
      search: 'example',
    };

    const res = await secretsManagerService.listSecretLocks(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('listSecretLocks() via SecretLocksPager', async () => {
    const params = {
      id: secretIdForGetSecretLink,
      limit: 10,
      sort: 'name',
      search: 'example',
    };

    const allResults = [];

    // Test getNext().
    let pager = new SecretsManagerV2.SecretLocksPager(secretsManagerService, params);
    while (pager.hasNext()) {
      const nextPage = await pager.getNext();
      expect(nextPage).not.toBeNull();
      allResults.push(...nextPage);
    }

    // Test getAll().
    pager = new SecretsManagerV2.SecretLocksPager(secretsManagerService, params);
    const allItems = await pager.getAll();
    expect(allItems).not.toBeNull();
    expect(allItems).toHaveLength(allResults.length);
    console.log(`Retrieved a total of ${allResults.length} items(s) with pagination.`);
  });

  test('createSecretVersionLocksBulk()', async () => {
    // Request models needed by this operation.

    // SecretLockPrototype
    const secretLockPrototypeModel = {
      name: 'lock-example-1',
      description: 'lock for consumer 1',
      attributes: { key: 'value' },
    };

    const params = {
      secretId: secretIdForGetSecretLink,
      id: secretVersionIdForGetSecretVersionLink,
      locks: [secretLockPrototypeModel],
      mode: 'remove_previous',
    };

    const res = await secretsManagerService.createSecretVersionLocksBulk(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(201);
    expect(res.result).toBeDefined();
  });

  test('listSecretVersionLocks()', async () => {
    const params = {
      secretId: secretIdForGetSecretLink,
      id: secretVersionIdForGetSecretVersionLink,
      offset: 0,
      limit: 25,
      sort: 'name',
      search: 'example',
    };

    const res = await secretsManagerService.listSecretVersionLocks(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('listSecretVersionLocks() via SecretVersionLocksPager', async () => {
    const params = {
      secretId: secretIdForGetSecretLink,
      id: secretVersionIdForGetSecretVersionLink,
      limit: 10,
      sort: 'name',
      search: 'example',
    };

    const allResults = [];

    // Test getNext().
    let pager = new SecretsManagerV2.SecretVersionLocksPager(secretsManagerService, params);
    while (pager.hasNext()) {
      const nextPage = await pager.getNext();
      expect(nextPage).not.toBeNull();
      allResults.push(...nextPage);
    }

    // Test getAll().
    pager = new SecretsManagerV2.SecretVersionLocksPager(secretsManagerService, params);
    const allItems = await pager.getAll();
    expect(allItems).not.toBeNull();
    expect(allItems).toHaveLength(allResults.length);
    console.log(`Retrieved a total of ${allResults.length} items(s) with pagination.`);
  });

  test('listConfigurations()', async () => {
    const params = {
      offset: 0,
      limit: 200,
      sort: 'config_type',
      search: 'example',
    };

    const res = await secretsManagerService.listConfigurations(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('listConfigurations() via ConfigurationsPager', async () => {
    const params = {
      limit: 10,
      sort: 'config_type',
      search: 'example',
    };

    const allResults = [];

    // Test getNext().
    let pager = new SecretsManagerV2.ConfigurationsPager(secretsManagerService, params);
    while (pager.hasNext()) {
      const nextPage = await pager.getNext();
      expect(nextPage).not.toBeNull();
      allResults.push(...nextPage);
    }

    // Test getAll().
    pager = new SecretsManagerV2.ConfigurationsPager(secretsManagerService, params);
    const allItems = await pager.getAll();
    expect(allItems).not.toBeNull();
    expect(allItems).toHaveLength(allResults.length);
    console.log(`Retrieved a total of ${allResults.length} items(s) with pagination.`);
  });

  test('getConfiguration()', async () => {
    const params = {
      name: configurationNameForGetConfigurationLink,
      xSmAcceptConfigurationType: 'private_cert_configuration_root_ca',
    };

    const res = await secretsManagerService.getConfiguration(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('updateConfiguration()', async () => {
    // Request models needed by this operation.

    // IAMCredentialsConfigurationPatch
    const configurationPatchModel = {
      api_key: 'RmnPBn6n1dzoo0v3kyznKEpg0WzdTpW9lW7FtKa017_u',
    };

    const params = {
      name: configurationNameForGetConfigurationLink,
      configurationPatch: configurationPatchModel,
      xSmAcceptConfigurationType: 'private_cert_configuration_root_ca',
    };

    const res = await secretsManagerService.updateConfiguration(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('createConfigurationAction()', async () => {
    // Request models needed by this operation.

    // PrivateCertificateConfigurationActionRotateCRLPrototype
    const configurationActionPrototypeModel = {
      action_type: 'private_cert_configuration_action_rotate_crl',
    };

    const params = {
      name: configurationNameForGetConfigurationLink,
      configActionPrototype: configurationActionPrototypeModel,
      xSmAcceptConfigurationType: 'private_cert_configuration_root_ca',
    };

    const res = await secretsManagerService.createConfigurationAction(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(201);
    expect(res.result).toBeDefined();
  });

  test('createNotificationsRegistration()', async () => {
    const params = {
      eventNotificationsInstanceCrn: 'crn:v1:bluemix:public:event-notifications:us-south:a/22018f3c34ff4ff193698d15ca316946:578ad1a4-2fd8-4e66-95d5-79a842ba91f8::',
      eventNotificationsSourceName: 'My Secrets Manager',
      eventNotificationsSourceDescription: 'Optional description of this source in an Event Notifications instance.',
    };

    const res = await secretsManagerService.createNotificationsRegistration(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(201);
    expect(res.result).toBeDefined();
  });

  test('getNotificationsRegistration()', async () => {
    const res = await secretsManagerService.getNotificationsRegistration();
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  // The integration test for getNotificationsRegistrationTest has been explicitly excluded from generation.
  // A test for this operation must be developed manually.
  // test('getNotificationsRegistrationTest()', async () => {});

  test('deleteSecretGroup()', async () => {
    const params = {
      id: secretGroupIdForGetSecretGroupLink,
    };

    const res = await secretsManagerService.deleteSecretGroup(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(204);
    expect(res.result).toBeDefined();
  });

  // The integration test for deleteSecretVersionData has been explicitly excluded from generation.
  // A test for this operation must be developed manually.
  // test('deleteSecretVersionData()', async () => {});

  test('deleteSecretLocksBulk()', async () => {
    const params = {
      id: secretIdForGetSecretLink,
      name: ['lock-example-1'],
    };

    const res = await secretsManagerService.deleteSecretLocksBulk(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('deleteSecretVersionLocksBulk()', async () => {
    const params = {
      secretId: secretIdForGetSecretLink,
      id: secretVersionIdForGetSecretVersionLink,
      name: ['lock-example-1'],
    };

    const res = await secretsManagerService.deleteSecretVersionLocksBulk(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('deleteSecret()', async () => {
    const params = {
      id: secretIdForGetSecretLink,
    };

    const res = await secretsManagerService.deleteSecret(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(204);
    expect(res.result).toBeDefined();
  });

  test('deleteConfiguration()', async () => {
    const params = {
      name: configurationNameForGetConfigurationLink,
      xSmAcceptConfigurationType: 'private_cert_configuration_root_ca',
    };

    const res = await secretsManagerService.deleteConfiguration(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(204);
    expect(res.result).toBeDefined();
  });

  test('deleteNotificationsRegistration()', async () => {
    const res = await secretsManagerService.deleteNotificationsRegistration();
    expect(res).toBeDefined();
    expect(res.status).toBe(204);
    expect(res.result).toBeDefined();
  });
});
