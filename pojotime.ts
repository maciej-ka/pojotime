type PojoData = {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export type PojoDiff =
  | Partial<PojoData>
  | ((pojo: PojoData) => Partial<PojoData>);

/*
 * Create pojo, a plain object with { years, months, days, hours, minutes, seconds }
 * manipulation methods attached with some pre-defined uses.
 *
 * Purpose of this is to limit some of Date API weirdness.
 * For example days in Date API are 1-indexed, but months are 0-indexed.
 * (in pojo all parts are 1 indexed, as in hand written date)
 *
 * Or that setHours, setMinutes, but setDate for days.
 * And a fact that all these mutation methods return timestamp number instead of Date.
 *
 * @param date - Date object to convert to pojo
 * @returns pojo - plain object with { years, months, days, hours, minutes, seconds }
 */
export const makeDate = (date: PojoData): Date => {
  const { years, months, days, hours, minutes, seconds } = date;
  return new Date(years, months - 1, days, hours, minutes, seconds);
};

type formatter = (data: {
  years: string;
  months: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}) => string;
type Pojo = {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  update: (diff: PojoDiff) => Date;
  updateYears: (years: number) => Date;
  updateMonths: (months: number) => Date;
  updateDays: (days: number) => Date;
  updateHours: (hours: number) => Date;
  updateMinutes: (minutes: number) => Date;
  updateSeconds: (seconds: number) => Date;
  add: (diff: PojoDiff) => Date;
  addYears: (years: number) => Date;
  addMonths: (months: number) => Date;
  addDays: (days: number) => Date;
  addHours: (hours: number) => Date;
  addMinutes: (minutes: number) => Date;
  addSeconds: (seconds: number) => Date;
  dayStart: () => Date;
  dayEnd: () => Date;
  monthStart: () => Date;
  monthEnd: () => Date;
  format: (formatter: formatter) => string;
};

declare global {
  interface Date {
    pojo: Pojo;
  }
}

let isInitialized = false;

const pojotimeInit = () => {
  if (isInitialized) return;
  isInitialized = true;

  Object.defineProperty(Date.prototype, 'pojo', {
    get: function () {
      const years = this.getFullYear();
      const months = this.getMonth() + 1;
      const days = this.getDate();
      const hours = this.getHours();
      const minutes = this.getMinutes();
      const seconds = this.getSeconds();
      const pojo = { years, months, days, hours, minutes, seconds };
      const update = (diff: PojoDiff) => {
        const diffEval = typeof diff === 'function' ? diff(pojo) : diff;
        return makeDate({ ...pojo, ...diffEval });
      };
      const updateDays = (days: number) => update({ days });
      const add = (diff: PojoDiff) => {
        const diffEval = typeof diff === 'function' ? diff(pojo) : diff;
        return makeDate({
          years: years + (diffEval.years || 0),
          months: months + (diffEval.months || 0),
          days: days + (diffEval.days || 0),
          hours: hours + (diffEval.hours || 0),
          minutes: minutes + (diffEval.minutes || 0),
          seconds: seconds + (diffEval.seconds || 0),
        });
      };
      const pad = (arg: number) => arg.toString().padStart(2, '0');
      const format = (formatter: formatter) =>
        formatter({
          years,
          months: pad(months),
          days: pad(days),
          hours: pad(hours),
          minutes: pad(minutes),
          seconds: pad(seconds),
        });
      return {
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
        update,
        updateYears: (years: number) => update({ years }),
        updateMonths: (months: number) => update({ months }),
        updateDays,
        updateHours: (hours: number) => update({ hours }),
        updateMinutes: (minutes: number) => update({ minutes }),
        updateSeconds: (seconds: number) => update({ seconds }),
        add,
        addYears: (years: number) => add({ years }),
        addMonths: (months: number) => add({ months }),
        addDays: (days: number) => add({ days }),
        addHours: (hours: number) => add({ hours }),
        addMinutes: (minutes: number) => add({ minutes }),
        addSeconds: (seconds: number) => add({ seconds }),
        dayStart: () => update({ hours: 0, minutes: 0, seconds: 0 }),
        dayEnd: () => update({ hours: 23, minutes: 59, seconds: 59 }),
        monthStart: () => updateDays(1),
        monthEnd: () => update((x) => ({ months: x.months + 1, days: 0 })),
        format,
      };
    },
    enumerable: false,
    configurable: true,
  });
};

export default pojotimeInit;
