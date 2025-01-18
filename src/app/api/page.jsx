'use client';

import { useState } from "react";

export default function Home() {
  // State to store the input from the textbox
  const [story, setStory] = useState('');
  const [output, setOutput] = useState(null); // Null to track when no output is present

  // The prompt dynamically updates based on the "story"
  const prompt = `extract the key information and feeling that a person is experiencing such that they would read the following paragraph only give keyword dont use any other word: ${story}`;

  const generateText = async () => {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body: prompt }),
      });

      const data = await response.json();

      if (response.ok) {
        setOutput(data.output); // Display Gemini API output
      } else {
        setOutput(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setOutput('An error occurred while generating text.');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full font-serif text-2xl lg:flex flex-col items-center">
        {/* Conditionally render the text box or the output */}
        {!output ? (
          <>
            <textarea
              className="border p-2 w-full mb-4"
              rows={5}
              placeholder="Paste your story here..."
              value={story}
              onChange={(e) => setStory(e.target.value)}
            />
            <button
              onClick={generateText}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Generate Keywords
            </button>
          </>
        ) : (
          // Display the API output after the story is processed
          <p className="text-center">{output}</p>
        )}
      </div>
    </main>
  );
}
