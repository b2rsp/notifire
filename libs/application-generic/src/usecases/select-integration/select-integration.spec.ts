import { ChannelTypeEnum, EmailProviderIdEnum } from '@novu/shared';
import {
  EnvironmentRepository,
  ExecutionDetailsRepository,
  IntegrationEntity,
  IntegrationRepository,
  JobRepository,
  SubscriberRepository,
  TenantRepository,
  MessageRepository,
} from '@novu/dal';

import { SelectIntegration } from './select-integration.usecase';
import { SelectIntegrationCommand } from './select-integration.command';
import { ConditionsFilter } from '../conditions-filter';
import { CompileTemplate } from '../compile-template';
import { CreateExecutionDetails } from '../create-execution-details';

const testIntegration: IntegrationEntity = {
  _environmentId: 'env-test-123',
  _id: 'integration-test-123',
  _organizationId: 'org-test-123',
  active: true,
  channel: ChannelTypeEnum.EMAIL,
  credentials: {
    apiKey: '123',
    user: 'test-user',
    secretKey: '123',
    domain: 'domain',
    password: '123',
    host: 'host',
    port: 'port',
    secure: true,
    region: 'region',
    accountSid: 'accountSid',
    messageProfileId: 'messageProfileId',
    token: '123',
    from: 'from',
    senderName: 'senderName',
    applicationId: 'applicationId',
    clientId: 'clientId',
    projectName: 'projectName',
  },
  providerId: 'test-provider-id',
  deleted: false,
  identifier: 'test-integration-identifier',
  name: 'test-integration-name',
  primary: true,
  priority: 1,
  deletedAt: null,
  deletedBy: null,
};

const novuIntegration: IntegrationEntity = {
  _environmentId: 'env-test-123',
  _id: 'integration-test-novu-123',
  _organizationId: 'org-test-123',
  active: true,
  channel: ChannelTypeEnum.EMAIL,
  credentials: {},
  providerId: EmailProviderIdEnum.Novu,
  deleted: false,
  identifier: 'test-novu-integration-identifier',
  name: 'test-novu-integration-name',
  primary: true,
  priority: 1,
  deletedAt: null,
  deletedBy: null,
};

const findOneMock = jest.fn(() => testIntegration);

jest.mock('@novu/dal', () => ({
  ...jest.requireActual('@novu/dal'),
  IntegrationRepository: jest.fn(() => ({
    findOne: findOneMock,
  })),
}));

jest.mock('../get-decrypted-integrations', () => ({
  ...jest.requireActual('../get-decrypted-integrations'),
  GetDecryptedIntegrations: jest.fn(() => ({
    execute: jest.fn(() => novuIntegration),
  })),
}));

describe('select integration', function () {
  let useCase: SelectIntegration;
  const integrationRepository: IntegrationRepository = new IntegrationRepository();
  const executionDetailsRepository: ExecutionDetailsRepository = new ExecutionDetailsRepository();

  const conditionsFilter = new ConditionsFilter(
    new SubscriberRepository(),
    new MessageRepository(),
    executionDetailsRepository,
    new JobRepository(),
    new EnvironmentRepository(),
    new CreateExecutionDetails(new ExecutionDetailsRepository()),
    new CompileTemplate()
  );
  beforeEach(async function () {
    // @ts-ignore
    useCase = new SelectIntegration(integrationRepository, conditionsFilter, new TenantRepository());
    jest.clearAllMocks();
  });

  it('should select the integration', async function () {
    const integration = await useCase.execute(
      SelectIntegrationCommand.create({
        channelType: ChannelTypeEnum.EMAIL,
        environmentId: 'environmentId',
        organizationId: 'organizationId',
        userId: 'userId',
        filterData: {},
      })
    );

    expect(integration).not.toBeNull();
    expect(integration?.identifier).toEqual(testIntegration.identifier);
  });

  it('should return the novu integration', async function () {
    findOneMock.mockImplementationOnce(() => null);

    const integration = await useCase.execute(
      SelectIntegrationCommand.create({
        channelType: ChannelTypeEnum.EMAIL,
        environmentId: 'environmentId',
        organizationId: 'organizationId',
        userId: 'userId',
        filterData: {},
      })
    );

    expect(integration).not.toBeNull();
    expect(integration?.providerId).toEqual(EmailProviderIdEnum.Novu);
  });

  it.each`
    channel                   | shouldUsePrimary
    ${ChannelTypeEnum.PUSH}   | ${false}
    ${ChannelTypeEnum.CHAT}   | ${false}
    ${ChannelTypeEnum.IN_APP} | ${false}
    ${ChannelTypeEnum.EMAIL}  | ${true}
    ${ChannelTypeEnum.SMS}    | ${true}
  `(
    'for channel $channel it should select integration by primary: $shouldUsePrimary',
    async ({ channel, shouldUsePrimary }) => {
      const environmentId = 'environmentId';
      const organizationId = 'organizationId';
      const userId = 'userId';
      findOneMock.mockImplementation(() => ({
        ...testIntegration,
        channel,
      }));

      const integration = await useCase.execute(
        SelectIntegrationCommand.create({
          channelType: channel,
          environmentId,
          organizationId,
          userId,
          filterData: {},
        })
      );

      expect(findOneMock).toHaveBeenCalledWith(
        {
          _organizationId: organizationId,
          _environmentId: environmentId,
          channel,
          active: true,
          ...(shouldUsePrimary && {
            primary: true,
          }),
        },
        undefined,
        { query: { sort: { createdAt: -1 } } }
      );
    }
  );
});
