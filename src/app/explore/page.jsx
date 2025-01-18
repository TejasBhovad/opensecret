"use client";
import { getPopularStories } from "../../../utils/db/action";
import React from "react";
import { getPods } from "../../../utils/db/action";
const page = () => {
  const [pods, setPods] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  React.useEffect(() => {
    const fetchPods = async () => {
      try {
        setLoading(true);
        const fetchedPods = await getPods();
        setPods(fetchedPods);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPods();
  }, []);

  const [stories, setStories] = React.useState([]);
  const [loadingStories, setLoadingStories] = React.useState(true);
  const [errorStories, setErrorStories] = React.useState(null);
  React.useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoadingStories(true);
        const fetchedStories = await getPopularStories();
        setStories(fetchedStories);
      } catch (err) {
        setErrorStories(err.message);
      } finally {
        setLoadingStories(false);
      }
    };
    fetchStories();
  }, []);
  return (
    <div>
      Explore
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {pods.map((pod) => (
          <li key={pod.pod_id}>
            <h2>{pod.subtag}</h2>
            <p>{pod.description}</p>
          </li>
        ))}
      </ul>
      <h1>Popular Stories</h1>
      {loadingStories && <p>Loading...</p>}
      {errorStories && <p style={{ color: "red" }}>{errorStories}</p>}
      <ul>
        {stories.map((story) => (
          <li key={story.story_id}>
            <h2>{story.title}</h2>
            <p>{story.content}</p>
          </li>
        ))}
      </ul>
      <pre>
        <code>{JSON.stringify(pods, null, 2)}</code>
        <code>{JSON.stringify(stories, null, 2)}</code>
      </pre>
    </div>
  );
};

export default page;
