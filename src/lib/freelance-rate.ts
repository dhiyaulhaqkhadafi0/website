/**
 * Framework-agnostic calculation for Freelance Rate Calculator.
 * All values use one selected currency. This function performs NO exchange rate conversion.
 * Does not fetch, store, or emit financial inputs.
 */
export type Currency = 'IDR' | 'USD';

export type RateInputs = {
  currency: Currency;
  desiredMonthlyTakeHome: number;
  monthlyBusinessCosts: number;
  weeklyWorkHours: number;
  billablePercent: number;
  reservePercent: number;
  quoteBufferPercent: number;
};

export type RateResult = {
  monthlyBillableHours: number;
  requiredMonthlyRevenue: number;
  minimumHourlyRate: number;
  quoteHourlyRate: number;
  suggestedRoundedQuote: number;
};

function ensureFiniteRange(value: number, label: string, min: number, max: number): void {
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new RangeError(`${label} harus di antara ${min} dan ${max}.`);
  }
}

export function calculateFreelanceRate(input: RateInputs): RateResult {
  if (input.currency !== 'IDR' && input.currency !== 'USD') {
    throw new Error('Mata uang tidak didukung.');
  }
  ensureFiniteRange(input.desiredMonthlyTakeHome, 'Target pendapatan', 0, 1_000_000_000_000);
  ensureFiniteRange(input.monthlyBusinessCosts, 'Biaya operasional', 0, 1_000_000_000_000);
  ensureFiniteRange(input.weeklyWorkHours, 'Jam kerja mingguan', 1, 80);
  ensureFiniteRange(input.billablePercent, 'Persentase billable', 0, 100);
  ensureFiniteRange(input.reservePercent, 'Persentase cadangan', 0, 99);
  ensureFiniteRange(input.quoteBufferPercent, 'Buffer penawaran', 0, 300);

  if (input.desiredMonthlyTakeHome + input.monthlyBusinessCosts <= 0) {
    throw new Error('Isi target pendapatan atau biaya operasional lebih dari nol.');
  }

  const monthlyBillableHours = input.weeklyWorkHours * (52 / 12) * (input.billablePercent / 100);
  if (monthlyBillableHours <= 0) {
    throw new Error('Jam billable harus lebih dari nol.');
  }

  const requiredMonthlyRevenue =
    (input.desiredMonthlyTakeHome + input.monthlyBusinessCosts) /
    (1 - input.reservePercent / 100);
  const minimumHourlyRate = requiredMonthlyRevenue / monthlyBillableHours;
  const quoteHourlyRate = minimumHourlyRate * (1 + input.quoteBufferPercent / 100);
  const increment = input.currency === 'IDR' ? 5_000 : 5;
  const suggestedRoundedQuote = Math.ceil(quoteHourlyRate / increment) * increment;
  if (![monthlyBillableHours, requiredMonthlyRevenue, minimumHourlyRate, quoteHourlyRate, suggestedRoundedQuote].every(Number.isFinite)) {
    throw new RangeError('Angka terlalu besar untuk dihitung. Periksa jam billable dan nominal input.');
  }

  return {
    monthlyBillableHours,
    requiredMonthlyRevenue,
    minimumHourlyRate,
    quoteHourlyRate,
    suggestedRoundedQuote,
  };
}

export function formatCurrency(value: number, currency: Currency): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'IDR' ? 0 : 2,
  }).format(value);
}

export const DEFAULT_RATE_INPUTS: RateInputs = {
  currency: 'IDR',
  desiredMonthlyTakeHome: 8_000_000,
  monthlyBusinessCosts: 1_000_000,
  weeklyWorkHours: 25,
  billablePercent: 60,
  reservePercent: 15,
  quoteBufferPercent: 20,
};
