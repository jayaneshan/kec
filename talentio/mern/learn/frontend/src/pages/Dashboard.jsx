import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const loadBalance = async () => {
    try {
      const res = await api.get("/account/balance", {
        headers: {
          authorization: token,
        },
      });

      setBalance(res.data.balance);
    } catch (err) {
      console.error(err);
      alert("Failed to load balance. Please log in again.");
    }
  };

  useEffect(() => {
    loadBalance();
  }, []);

  const deposit = async () => {
    const res = await api.post(
      "/account/deposit",
      { amount },
      {
        headers: {
          authorization: token,
        },
      }
    );

    setBalance(res.data.balance);
    setAmount("");
  };

  const withdraw = async () => {
    const res = await api.post(
      "/account/withdraw",
      { amount },
      {
        headers: {
          authorization: token,
        },
      }
    );

    setBalance(res.data.balance);
    setAmount("");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow w-96">
        <h1 className="text-2xl font-bold mb-6 text-red-600">
          ATM Dashboard
        </h1>

        <h2 className="text-xl mb-6">
          Balance: ₹{balance}
        </h2>

        <input
          className="w-full border p-3 rounded mb-4"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="flex gap-3">
          <button
            onClick={deposit}
            className="flex-1 bg-green-600 text-white p-3 rounded"
          >
            Deposit
          </button>

          <button
            onClick={withdraw}
            className="flex-1 bg-red-600 text-white p-3 rounded"
          >
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;