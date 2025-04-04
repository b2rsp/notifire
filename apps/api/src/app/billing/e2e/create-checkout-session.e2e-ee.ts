/* eslint-disable global-require */
import sinon from 'sinon';
import { expect } from 'chai';

import { ApiServiceLevelEnum, StripeBillingIntervalEnum } from '@novu/shared';

const dashboardOrigin = process.env.FRONT_BASE_URL;
const checkoutSessionCreateParamsMock = {
  mode: 'subscription',
  customer: 'customer_id',
  payment_method_types: ['card'],
  tax_id_collection: {
    enabled: true,
  },
  automatic_tax: {
    enabled: true,
  },
  billing_address_collection: 'auto',
  customer_update: {
    name: 'auto',
    address: 'auto',
  },
  success_url: `${dashboardOrigin}/manage-account/billing?result=success&session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${dashboardOrigin}/manage-account/billing?result=canceled`,
};

describe('Create checkout session #novu-v2', async () => {
  if (!require('@novu/ee-billing').CreateCheckoutSession) {
    throw new Error("CreateCheckoutSession doesn't exist");
  }

  const { CreateCheckoutSession } = require('@novu/ee-billing');

  const getOrCreateCustomer = {
    execute: () => Promise.resolve({ id: 'customer_id' }),
  };
  const getPrices = {
    execute: () =>
      Promise.resolve({
        licensed: [{ id: 'licensed_price_id_1' }],
        metered: [{ id: 'metered_price_id_1' }],
      }),
  };

  const stripeStub = {
    checkout: {
      sessions: {
        create: () => {},
      },
    },
  };
  let checkoutCreateStub: sinon.SinonStub;

  beforeEach(() => {
    checkoutCreateStub = sinon.stub(stripeStub.checkout.sessions, 'create').resolves({ url: 'url' });
  });

  afterEach(() => {
    checkoutCreateStub.reset();
  });

  it('Create checkout session with 1 subscription containing 1 licensed item and 1 metered item for monthly billing interval', async () => {
    const usecase = new CreateCheckoutSession(stripeStub, getOrCreateCustomer, getPrices);

    const result = await usecase.execute({
      organizationId: 'organization_id',
      userId: 'user_id',
      billingInterval: StripeBillingIntervalEnum.MONTH,
      apiServiceLevel: ApiServiceLevelEnum.BUSINESS,
      origin: dashboardOrigin,
    });

    expect(checkoutCreateStub.lastCall.args.at(0)).to.deep.equal({
      ...checkoutSessionCreateParamsMock,
      line_items: [{ price: 'licensed_price_id_1', quantity: 1 }, { price: 'metered_price_id_1' }],
      metadata: {
        apiServiceLevel: ApiServiceLevelEnum.BUSINESS,
        billingInterval: StripeBillingIntervalEnum.MONTH,
      },
    });

    expect(result).to.deep.equal({ stripeCheckoutUrl: 'url' });
  });

  it('Create checkout session with 1 subscription containing 1 licensed item for annual billing interval', async () => {
    const usecase = new CreateCheckoutSession(stripeStub, getOrCreateCustomer, getPrices);

    const result = await usecase.execute({
      organizationId: 'organization_id',
      userId: 'user_id',
      billingInterval: StripeBillingIntervalEnum.YEAR,
      apiServiceLevel: ApiServiceLevelEnum.BUSINESS,
      origin: dashboardOrigin,
    });

    expect(checkoutCreateStub.lastCall.args.at(0)).to.deep.equal({
      ...checkoutSessionCreateParamsMock,
      line_items: [{ price: 'licensed_price_id_1', quantity: 1 }],
      metadata: {
        apiServiceLevel: ApiServiceLevelEnum.BUSINESS,
        billingInterval: StripeBillingIntervalEnum.YEAR,
      },
    });

    expect(result).to.deep.equal({ stripeCheckoutUrl: 'url' });
  });
});
