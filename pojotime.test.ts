import { describe, expect, it } from "vitest";

import pojotime from './pojotime';
pojotime();

describe('pojotime to build pojo', () => {
  it('works', () => {
    const actual = new Date('2023-08-20 12:20:30').pojo;
    expect(actual.years).toEqual(2023);
    expect(actual.months).toEqual(8);
    expect(actual.days).toEqual(20);
    expect(actual.hours).toEqual(12);
    expect(actual.minutes).toEqual(20);
    expect(actual.seconds).toEqual(30);
  });
});

describe('pojotime update with diff function', () => {
  it('next day', () => {
    const actual = new Date('2023-08-20 12:20:30').pojo.update((pojo) => ({
      days: pojo.days + 1,
    }));
    expect(actual).toEqual(new Date('2023-08-21 12:20:30'));
  });

  it('first day of month', () => {
    const actual = new Date('2023-08-20 12:20:30').pojo.update({ days: 1 });
    expect(actual).toEqual(new Date('2023-08-01 12:20:30'));
  });

  it('last day of month', () => {
    const actual = new Date('2023-08-20 12:20:30').pojo.update((pojo) => ({
      months: pojo.months + 1,
      days: 0,
    }));
    expect(actual).toEqual(new Date('2023-08-31 12:20:30'));
  });

  it('last day of previous month', () => {
    const actual = new Date('2023-08-20 12:20:30').pojo.update({
      days: 0,
    });
    expect(actual).toEqual(new Date('2023-07-31 12:20:30'));
  });

  it('one day before last day of previous month', () => {
    const actual = new Date('2023-08-20 12:20:30').pojo.update({ days: -1 });
    expect(actual).toEqual(new Date('2023-07-30 12:20:30'));
  });

  it('20th day of this month', () => {
    const actual = new Date('2023-08-20 12:20:30').pojo.update({ days: 20 });
    expect(actual).toEqual(new Date('2023-08-20 12:20:30'));
  });
});
