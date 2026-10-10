export const VAT_RATE = 0.08;

// Giá trong dữ liệu là giá CHƯA VAT; bật VAT thì cộng thêm 8%
export const priceWithVat = (base: number, includeVat: boolean) =>
  Math.round(includeVat ? base * (1 + VAT_RATE) : base);

export const applyDiscount = (base: number, percent: number) =>
  Math.round((base * (100 - percent)) / 100);

// 351000 -> "351.000₫"
export const formatVnd = (amount: number) => `${new Intl.NumberFormat("vi-VN").format(amount)}₫`;
