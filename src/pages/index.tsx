import React, { useState } from "react";

const Home: React.FC = () => {
  const [text, setText] = useState("");
  const [action, setAction] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [targetLevel, setTargetLevel] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setText(e.target.value);
  };

  const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAction(e.target.value);
  };

  const handleTargetLanguageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTargetLanguage(e.target.value);
  };

  const handleTargetLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTargetLevel(e.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResponse("");
    setError("");

    try {
      const response = await fetch("/api/lingo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, action, targetLanguage, targetLevel }),
      });
      const parsedResponse = await response.json();
      setResponse(parsedResponse.response.replaceAll("\n", "<br>"));
    } catch (error: any) {
      setError(error.message);
    }
    setText("");
    setAction("");
    setTargetLanguage("");
    setTargetLevel("");
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold">ChatGPT Lingo</h1>
      <form className="w-full max-w-lg mt-6" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="text" className="text-lg font-bold">
            Text
          </label>
          <textarea
            id="text"
            value={text}
            onChange={handleTextChange}
            className="p-2 border border-gray-400"
          />
        </div>
        <div className="flex flex-col mt-4">
          <label htmlFor="action" className="text-lg font-bold">
            Action
          </label>
          <select
            id="action"
            value={action}
            onChange={handleActionChange}
            className="p-2 border border-gray-400"
          >
            <option value="" disabled>
              Choose an action
            </option>
            <option value="Correct">Correct</option>
            <option value="Translate">Translate</option>
            <option value="Simplify">Simplify</option>
          </select>
        </div>
        {action === "Translate" && (
          <div className="flex flex-col mt-4">
            <label htmlFor="targetLanguage" className="text-lg font-bold">
              Target Language
            </label>
            <input
              type="text"
              id="targetLanguage"
              value={targetLanguage}
              onChange={handleTargetLanguageChange}
              className="p-2 border border-gray-400"
            />
          </div>
        )}
        {action === "Simplify" && (
          <div className="flex flex-col mt-4">
            <label htmlFor="targetLevel" className="text-lg font-bold">
              Target Level
            </label>
            <select
              id="targetLevel"
              value={targetLevel}
              onChange={handleTargetLevelChange}
              className="p-2 border border-gray-400"
            >
              <option value="" disabled>
                Choose a level
              </option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C1">C1</option>
            </select>
          </div>
        )}
        <button
          type="submit"
          disabled={
            !text ||
            !action ||
            (action === "Translate" && !targetLanguage) ||
            (action === "Simplify" && !targetLevel)
          }
          className={`mt-6 p-2 rounded hover:bg-indigo-700 ${
            !text ||
            !action ||
            (action === "Translate" && !targetLanguage) ||
            (action === "Simplify" && !targetLevel)
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 text-white"
          }`}
        >
          Submit
        </button>
      </form>
      <div className="mt-8 max-w-xl overflow-scroll">
        {error && (
          <div className="text-red-500 p-4 bg-red-100 border border-red-400">
            {error}
          </div>
        )}

        {response && (
          <div className="p-4 border border-gray-400">
            <h3 className="text-lg font-medium">Response:</h3>
            <p dangerouslySetInnerHTML={{ __html: response }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
