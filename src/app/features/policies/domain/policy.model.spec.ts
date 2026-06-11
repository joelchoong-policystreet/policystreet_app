import { MOTOR_POLICIES_FIXTURE } from '../data/motor-policies.fixture';
import {
  daysUntilCoverageEnd,
  sortPolicyCardsForAllTab,
  toPolicyCard,
  toQuotationVehicleOptions,
} from './policy.model';

describe('policy.model', () => {
  const sample = MOTOR_POLICIES_FIXTURE[0];

  it('toPolicyCard maps motor policy list fields', () => {
    const card = toPolicyCard(sample);
    expect(card.id).toBe(sample.id);
    expect(card.plate).toBe(sample.plate);
    expect(card.coveragePeriod).toBe(sample.coveragePeriodShort);
    expect(card.status).toBe(sample.status);
  });

  it('toQuotationVehicleOptions maps plate and model', () => {
    const options = toQuotationVehicleOptions(MOTOR_POLICIES_FIXTURE);
    expect(options.length).toBe(MOTOR_POLICIES_FIXTURE.length);
    expect(options[0].plate).toBe(MOTOR_POLICIES_FIXTURE[0].plate);
    expect(options[0].model).toBe(MOTOR_POLICIES_FIXTURE[0].carModel);
  });

  it('daysUntilCoverageEnd counts whole days until end date', () => {
    const days = daysUntilCoverageEnd('2026-06-01', new Date(2026, 4, 28));
    expect(days).toBe(4);
  });

  it('sortPolicyCardsForAllTab orders active before expiring before expired', () => {
    const cards = MOTOR_POLICIES_FIXTURE.map(toPolicyCard);
    const sorted = sortPolicyCardsForAllTab(cards);
    const statuses = sorted.map((c) => c.status);
    const activeIdx = statuses.indexOf('ACTIVE');
    const expiringIdx = statuses.indexOf('EXPIRING SOON');
    const expiredIdx = statuses.indexOf('EXPIRED');

    if (activeIdx >= 0 && expiringIdx >= 0) {
      expect(activeIdx).toBeLessThan(expiringIdx);
    }
    if (expiringIdx >= 0 && expiredIdx >= 0) {
      expect(expiringIdx).toBeLessThan(expiredIdx);
    }
  });
});
