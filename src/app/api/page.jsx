'use client';

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState(''); // Input for all types of prompts
  const [output, setOutput] = useState(null); // Output from the API
  const [mode, setMode] = useState('story'); // Mode to determine which function to use ('story', 'array', 'week')

  // Function to handle a single story
  const handleSingleStory = (story) => {
    return `Extract the key information and feeling that a person is experiencing when reading the following paragraph. Only give keywords, don't use any other words: ${story}`;
  };

  // Function to handle an array of stories
  const handleArrayOfStories = (stories) => {
    return `Summarize the feelings expressed in the following stories. Only use keywords and categorize them: ${JSON.stringify(stories)}`;
  };

  // Function to handle a week's summary
  const handleWeeklySummary = (weekData) => {
    return `Summarize the emotional journey of the week based on the following readings. Only use concise keywords for each day: ${JSON.stringify(weekData)}`;
  };

  const generateText = async () => {
    let prompt;
    if (mode === 'story') {
      prompt = handleSingleStory(input);
    } else if (mode === 'array') {
      try {
        const stories = JSON.parse(input); // Input must be a JSON array
        prompt = handleArrayOfStories(stories);
      } catch (error) {
        setOutput('Invalid input: Please provide a valid JSON array.');
        return;
      }
    } else if (mode === 'week') {
      try {
        const weekData = JSON.parse(input); // Input must be a JSON object representing a week's data
        prompt = handleWeeklySummary(weekData);
      } catch (error) {
        setOutput('Invalid input: Please provide a valid JSON object.');
        return;
      }
    }

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
        setOutput(data.output);
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
        {!output ? (
          <>
            {/* Dropdown to select the mode */}
            <select
              className="border mb-4 p-2"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="story">Single Story</option>
              <option value="array">Array of Stories</option>
              <option value="week">Weekly Summary</option>
            </select>

            {/* Text area for input */}
            <textarea
              className="border p-2 w-full mb-4"
              rows={5}
              placeholder={
                mode === 'story'
                  ? 'Paste your story here...'
                  : mode === 'array'
                  ? 'Enter a JSON array of stories...'
                  : 'Enter a JSON object for the week...'
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <button
              onClick={generateText}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Generate
            </button>
          </>
        ) : (
          <p className="text-center">{output}</p>
        )}
      </div>
    </main>
  );
}
