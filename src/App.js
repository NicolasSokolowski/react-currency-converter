// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

import { useState, useEffect } from "react";

export default function App() {
  const [amount, setAmount] = useState(0);
  const [fromCurr, setFromCurr] = useState("USD");
  const [toCurr, setToCurr] = useState("EUR");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rate, setRate] = useState(0);

  function handleValue(value) {
    setAmount(value);
  }

  function handleFromCurr(curr) {
    setFromCurr(curr);
  }

  function handleToCurr(curr) {
    setToCurr(curr);
  }

  useEffect(function () {
    const controller = new AbortController();

    async function fetchCurrency() {
      try {
        setIsLoading(true);
        setError("");

        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurr}&to=${toCurr}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error("Something went wrong with fetching currencies");

        const data = await res.json();

        if (data.Response === "False") throw new Error("Currency not found");

        console.log(data);

        setRate(data.rates[toCurr]);
        setError("");

      } catch (err) {
        
        if (err.name !== "AbortError") {
          console.log(err.message);
          setError(err.message);
        }
        
      } finally {
        setIsLoading(false);
      }
    }
    if (fromCurr === toCurr) return setRate(amount);
    amount === 0 || fetchCurrency();
    amount === 0 && setRate(0);

    return function () {
      controller.abort();
    }
  }, [amount, fromCurr, toCurr])

  return (
    <div>
      <input type="text" value={amount} onChange={(e) => handleValue(+e.target.value)} />
      <select value={fromCurr} onChange={(e) => handleFromCurr(e.target.value)}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select value={toCurr} onChange={(e) => handleToCurr(e.target.value)}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      {isLoading
        ? <Loader />
        : <p>{rate} {toCurr}</p>
      }
    </div>
  );
}

function Loader() {
  return (
    <div>
      Converting...
    </div>
  )
}