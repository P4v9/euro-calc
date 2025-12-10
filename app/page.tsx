"use client";

import { useMemo, useState } from "react";

type Currency = "BGN" | "EUR";

type Payment = {
  id: number;
  currency: Currency;
  amount: number;
};

const EUR_RATE = 1.95583; // ФИКСИРАН КУРС: 1 EUR = 1.95583 лв

export default function EuroCalculatorPage() {
  const [documentAmountEUR, setDocumentAmountEUR] = useState<string>("");

  const [newPaymentCurrency, setNewPaymentCurrency] = useState<Currency>("EUR");
  const [newPaymentAmount, setNewPaymentAmount] = useState<string>("");

  const [payments, setPayments] = useState<Payment[]>([]);

  // Парсване на документа
  const parsedDocumentAmountEUR = useMemo(
    () => parseFloat(documentAmountEUR.replace(",", ".")) || 0,
    [documentAmountEUR]
  );

  const documentAmountBGN = useMemo(
    () => parsedDocumentAmountEUR * EUR_RATE,
    [parsedDocumentAmountEUR]
  );

  function round2(num: number): number {
    return Math.round(num * 100) / 100;
  }

  function paymentToEUR(payment: Payment): number {
    if (payment.currency === "EUR") return payment.amount;
    // BGN -> EUR
    return payment.amount / EUR_RATE;
  }

  function paymentToBGN(payment: Payment): number {
    return paymentToEUR(payment) * EUR_RATE;
  }

  const totalPaidEUR = useMemo(() => {
    return round2(
      payments.reduce((sum, p) => sum + paymentToEUR(p), 0)
    );
  }, [payments]);

  const totalPaidBGN = useMemo(
    () => round2(totalPaidEUR * EUR_RATE),
    [totalPaidEUR]
  );

  const remainingEUR = useMemo(
    () => round2(parsedDocumentAmountEUR - totalPaidEUR),
    [parsedDocumentAmountEUR, totalPaidEUR]
  );

  const remainingBGN = useMemo(
    () => round2(remainingEUR * EUR_RATE),
    [remainingEUR]
  );

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
    parseFloat(newPaymentAmount.replace(",", ".")) <= 0;

  const remainingIsNegative = remainingEUR < 0;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center px-3 py-4">
      <div className="w-full max-w-md space-y-4">
        <header className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Евро / лев калкулатор
          </h1>
          <p className="text-xs text-slate-400">
            Сума по документа в евро. Плащания в EUR и BGN по фиксиран курс.
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
                Сума (EUR)
              </label>
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                value={documentAmountEUR}
                onChange={(e) => setDocumentAmountEUR(e.target.value)}
                className="w-full rounded-xl border border-slate-600 bg-slate-900/60 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs text-slate-300">
                Еквивалент (лв)
              </label>
              <div className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm flex items-center justify-end">
                <span className="font-semibold">
                  {documentAmountBGN.toFixed(2)} лв
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 text-[11px] text-slate-400">
            <span>Фиксиран курс: 1 EUR = {EUR_RATE.toFixed(5)} лв</span>
            <span>* Курсът е зададен в системата и не се променя.</span>
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
                <option value="EUR">EUR</option>
                <option value="BGN">BGN</option>
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
                  newPaymentCurrency === "EUR" ? "напр. 20" : "напр. 50"
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
                      В евро:{" "}
                      <span className="text-slate-100">
                        {paymentToEUR(p).toFixed(2)} €
                      </span>
                      {" · "}
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
              <span className="text-right font-semibold text-slate-100">
                {parsedDocumentAmountEUR.toFixed(2)} €<br />
                <span className="text-xs text-slate-400">
                  ({documentAmountBGN.toFixed(2)} лв)
                </span>
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-300">Общо платено:</span>
              <span className="text-right font-semibold text-slate-100">
                {totalPaidEUR.toFixed(2)} €<br />
                <span className="text-xs text-slate-400">
                  ({totalPaidBGN.toFixed(2)} лв)
                </span>
              </span>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-slate-300">Остава за плащане:</span>
              <span
                className={`text-right font-semibold ${
                  remainingIsNegative ? "text-amber-300" : "text-emerald-300"
                }`}
              >
                {remainingEUR.toFixed(2)} €<br />
                <span className="text-xs">
                  ({remainingBGN.toFixed(2)} лв)
                </span>
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
