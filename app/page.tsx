"use client";

import { useMemo, useState } from "react";

type Currency = "BGN" | "EUR";

type Payment = {
  id: number;
  currency: Currency;
  amount: number;
};

export default function EuroCalculatorPage() {
  const [documentAmountBGN, setDocumentAmountBGN] = useState<string>("100.00");
  const [rate, setRate] = useState<string>("1.95583");

  const [newPaymentCurrency, setNewPaymentCurrency] = useState<Currency>("EUR");
  const [newPaymentAmount, setNewPaymentAmount] = useState<string>("");

  const [payments, setPayments] = useState<Payment[]>([]);

  // Парсваме текст -> число
  const parsedDocumentAmountBGN = useMemo(
    () => parseFloat(documentAmountBGN.replace(",", ".")) || 0,
    [documentAmountBGN]
  );

  const parsedRate = useMemo(
    () => parseFloat(rate.replace(",", ".")) || 1.95583,
    [rate]
  );

  const documentAmountEUR = useMemo(() => {
    if (parsedRate === 0) return 0;
    return parsedDocumentAmountBGN / parsedRate;
  }, [parsedDocumentAmountBGN, parsedRate]);

  function round2(num: number): number {
    return Math.round(num * 100) / 100;
  }

  function paymentToBGN(payment: Payment): number {
    if (payment.currency === "BGN") return payment.amount;
    return payment.amount * parsedRate;
  }

  const totalPaidBGN = useMemo(() => {
    return round2(
      payments.reduce((sum, p) => sum + paymentToBGN(p), 0)
    );
  }, [payments, parsedRate]);

  const remainingBGN = useMemo(
    () => round2(parsedDocumentAmountBGN - totalPaidBGN),
    [parsedDocumentAmountBGN, totalPaidBGN]
  );

  const remainingEUR = useMemo(() => {
    if (parsedRate === 0) return 0;
    return round2(remainingBGN / parsedRate);
  }, [remainingBGN, parsedRate]);

  function handleAddPayment() {
    const amount = parseFloat(newPaymentAmount.replace(",", "."));
    if (!amount || amount <= 0) return;

    const next: Payment = {
      id: payments.length === 0 ? 1 : payments[payments.length - 1].id + 1,
      currency: newPaymentCurrency,
      amount: round2(amount),
    };

    setPayments((prev) => [...prev, next]);
    setNewPaymentAmount("");
  }

  function handleRemovePayment(id: number) {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  }

  function handleReset() {
    setPayments([]);
    setNewPaymentAmount("");
    setNewPaymentCurrency("EUR");
  }

  const addDisabled =
    !newPaymentAmount ||
    parseFloat(newPaymentAmount.replace(",", ".")) <= 0 ||
    parsedRate === 0;

  const remainingIsNegative = remainingBGN < 0;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center px-3 py-4">
      <div className="w-full max-w-md space-y-4">
        <header className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Евро / лев калкулатор
          </h1>
          <p className="text-xs text-slate-400">
            Смята локално в телефона. Нищо не се записва на сървър.
          </p>
        </header>

        {/* Документ */}
        <section className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 shadow-md space-y-3">
          <h2 className="text-sm font-semibold text-slate-200">
            Сума по документа
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs text-slate-300">
                Сума (лв)
              </label>
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                value={documentAmountBGN}
                onChange={(e) => setDocumentAmountBGN(e.target.value)}
                className="w-full rounded-xl border border-slate-600 bg-slate-900/60 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs text-slate-300">
                Курс евро → лев
              </label>
              <input
                type="number"
                inputMode="decimal"
                step="0.00001"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className={`w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-1 ${
                  parsedRate === 0
                    ? "border-red-500/70 bg-slate-900/60 focus:border-red-400 focus:ring-red-400"
                    : "border-slate-600 bg-slate-900/60 focus:border-emerald-400 focus:ring-emerald-400"
                }`}
              />
            </div>
          </div>

          <div className="flex items-baseline justify-between text-xs text-slate-300">
            <span>Документ в евро:</span>
            <span className="font-semibold text-slate-100">
              {documentAmountEUR.toFixed(2)} €
            </span>
          </div>
        </section>

        {/* Плащане */}
        <section className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 shadow-md space-y-3">
          <h2 className="text-sm font-semibold text-slate-200">
            Добавяне на плащане
          </h2>

          <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] gap-3">
            <div className="space-y-1">
              <label className="block text-xs text-slate-300">
                Валута
              </label>
              <select
                value={newPaymentCurrency}
                onChange={(e) =>
                  setNewPaymentCurrency(e.target.value as Currency)
                }
                className="w-full rounded-xl border border-slate-600 bg-slate-900/60 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
              >
                <option value="BGN">BGN</option>
                <option value="EUR">EUR</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs text-slate-300">
                Сума
              </label>
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                value={newPaymentAmount}
                onChange={(e) => setNewPaymentAmount(e.target.value)}
                className="w-full rounded-xl border border-slate-600 bg-slate-900/60 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                placeholder={
                  newPaymentCurrency === "EUR" ? "напр. 20" : "напр. 10"
                }
              />
            </div>
          </div>

          {/* Бързи суми за евро */}
          {newPaymentCurrency === "EUR" && (
            <div className="flex flex-wrap gap-2 text-xs">
              {[5, 10, 20, 50, 100].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setNewPaymentAmount(String(v))}
                  className="rounded-full border border-emerald-500/40 px-3 py-1 text-emerald-200/90 hover:bg-emerald-500/10 active:bg-emerald-500/20 transition"
                >
                  {v} €
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handleAddPayment}
            disabled={addDisabled}
            className={`mt-1 w-full rounded-xl px-4 py-2 text-sm font-semibold transition 
              ${
                addDisabled
                  ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                  : "bg-emerald-500 text-slate-900 hover:bg-emerald-400 active:bg-emerald-300"
              }`}
          >
            Добави плащане
          </button>
        </section>

        {/* Списък с плащания */}
        {payments.length > 0 && (
          <section className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 shadow-md space-y-3">
            <h2 className="text-sm font-semibold text-slate-200">
              Въведени плащания
            </h2>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {payments.map((p, index) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-xl bg-slate-900/60 px-3 py-2 text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-100">
                      {index + 1}. {p.amount.toFixed(2)} {p.currency}
                    </div>
                    <div className="text-slate-400">
                      В левове:{" "}
                      <span className="text-slate-100">
                        {paymentToBGN(p).toFixed(2)} лв
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemovePayment(p.id)}
                    className="ml-3 rounded-full border border-red-500/60 px-2 py-1 text-[10px] font-semibold text-red-300 hover:bg-red-500/10 active:bg-red-500/20 transition"
                  >
                    Изтрий
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Обобщение */}
        <section className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 shadow-md space-y-3">
          <h2 className="text-sm font-semibold text-slate-200">
            Обобщение
          </h2>

          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-300">Общо по документа:</span>
              <span className="font-semibold text-slate-100">
                {parsedDocumentAmountBGN.toFixed(2)} лв
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-300">Общо платено:</span>
              <span className="font-semibold text-slate-100">
                {totalPaidBGN.toFixed(2)} лв
              </span>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-slate-300">Остава за плащане:</span>
              <span
                className={`font-semibold ${
                  remainingIsNegative ? "text-amber-300" : "text-emerald-300"
                }`}
              >
                {remainingBGN.toFixed(2)} лв ({remainingEUR.toFixed(2)} €)
              </span>
            </div>

            {remainingIsNegative && (
              <p className="text-[11px] text-amber-300/90 pt-1">
                ⚠ Платено е повече от сумата по документа (ресто / надплащане).
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="mt-2 w-full rounded-xl bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-600 active:bg-slate-500 transition"
          >
            Нова сметка
          </button>
        </section>
      </div>
    </div>
  );
}
