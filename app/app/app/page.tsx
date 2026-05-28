"use client";
import { useState } from "react";

type Question = {
  question: string;
  options: string[];
  correct: string;
  explanation: string;
};

const TOPICS = [
  "Encrypted Mempool",
  "Confidential Smart Contracts",
  "TEE Architecture",
  "Seismic vs Ethereum",
  "Private State",
];

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

export default function Home() {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [difficulty, setDifficulty] = useState("Beginner");
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  async function fetchQuestion() {
    setLoading(true);
    setSelected(null);
    setQuestion(null);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty }),
      });
      const data = await res.json();
      setQuestion(data.question);
    } catch {
      alert("Error! Check API key.");
    }
    setLoading(false);
  }

  function handleAnswer(opt: string) {
    if (selected) return;
    setSelected(opt);
    setScore((s) => ({
      correct: s.correct + (opt === question?.correct ? 1 : 0),
      total: s.total + 1,
    }));
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-center mb-1 text-cyan-400">
        Seismic Quiz Bot
      </h1>
      <p className="text-center text-gray-400 text-sm mb-6">
        Blockchain knowledge test
      </p>

      <div className="bg-gray-900 rounded-xl p-4 mb-4">
        <label className="text-xs text-gray-400 block mb-1">Topic</label>
        <select
          className="w-full bg-gray-800 text-white rounded-lg p-2 text-sm mb-3"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        >
          {TOPICS.map((t) => <option key={t}>{t}</option>)}
        </select>

        <label className="text-xs text-gray-400 block mb-1">Difficulty</label>
        <div className="flex gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`flex-1 py-1.5 rounded-lg text-sm ${
                difficulty === d
                  ? "bg-cyan-500 text-white"
                  : "bg-gray-800 text-gray-400"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between text-sm text-gray-400 mb-3">
        <span>Score: {score.correct}/{score.total}</span>
        <button onClick={() => setScore({ correct: 0, total: 0 })} className="text-xs text-gray-600">Reset</button>
      </div>

      <button
        onClick={fetchQuestion}
        disabled={loading}
        className="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-semibold py-3 rounded-xl mb-4 disabled:opacity-50 transition-colors"
      >
        {loading ? "Loading..." : "New Question"}
      </button>

      {question && (
        <div className="bg-gray-900 rounded-xl p-4">
          <p className="font-medium mb-4 leading-relaxed">{question.question}</p>
          <div className="flex flex-col gap-2">
            {question.options.map((opt) => {
              const isCorrect = opt === question.correct;
              const isSelected = opt === selected;
              let cls = "bg-gray-800 text-gray-200";
              if (selected) {
                if (isCorrect) cls = "bg-green-700 text-white";
                else if (isSelected) cls = "bg-red-700 text-white";
              }
              return (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  className={`text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${cls}`}
                >
