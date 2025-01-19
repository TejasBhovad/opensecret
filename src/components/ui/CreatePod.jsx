"use client";
import { motion } from "motion/react";
import { useState } from "react";
import { createPod } from "../../../utils/db/action.js";

// Custom Alert Component
const Alert = ({ type, message, onClose }) => {
  const alertStyles = {
    success: "bg-green-500 border-green-700",
    error: "bg-red-500 border-red-700",
    warning: "bg-yellow-500 border-yellow-700",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed right-4 top-4 z-50 flex items-center justify-between rounded-lg p-4 text-white shadow-xl ${alertStyles[type]} transform transition-all duration-300`}
    >
      <div className="flex items-center">
        {type === "success" && (
          <svg
            className="mr-2 h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
        {type === "error" && (
          <svg
            className="mr-2 h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
        <span className="font-bold">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="ml-4 rounded-full p-1 transition hover:bg-white/20"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </motion.div>
  );
};

const CreatePod = () => {
  // State Management
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [subtag, setSubtag] = useState("");
  const [customSubtag, setCustomSubtag] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [alert, setAlert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");

  // Validation Function
  const validateForm = () => {
    if (!description.trim()) {
      showAlert("error", "Describe your pod, Chad!");
      return false;
    }
    if (!domain && !customDomain.trim()) {
      showAlert("error", "Choose a domain, Legend!");
      return false;
    }
    if (!subtag && !customSubtag.trim()) {
      showAlert("error", "Pick a subtag, Warrior!");
      return false;
    }
    if (!isPublic) {
      showAlert("warning", "Private pods are for the weak!");
    }
    if (domain === "Other" && !customDomain.trim()) {
      showAlert("error", "Enter your custom domain, Ninja!");
      return false;
    }
    if (subtag === "Other" && !customSubtag.trim()) {
      showAlert("error", "Enter your custom vibe, Ninja!");
      return false;
    }
    if (name.length < 3) {
      showAlert("error", "Name must be at least 3 characters long, Ninja!");
      return false;
    }
    return true;
  };

  // Alert Handler
  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const newPod = await createPod({
        admin_id: 3,
        is_public: isPublic,
        subtag: subtag === "Other" ? customSubtag : subtag,
        domain: domain === "Other" ? customDomain : domain,
        description,
        name: name,
      });

      showAlert("success", "Pod Created like a BOSS! 💪");

      // Reset form
      setDescription("");
      setDomain("");
      setCustomDomain("");
      setSubtag("");
      setCustomSubtag("");
      setIsPublic(true);
      setName("");
    } catch (error) {
      showAlert("error", "Pod Creation Failed. Try Again, Warrior!");
      console.error("Pod Creation Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      {/* Alert Render */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md rounded-xl bg-secondary p-8 shadow-2xl"
      >
        <h1 className="mb-6 text-center text-2xl font-bold text-foreground">
          Create Your Epic Pod 🚀
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Description Input */}
          <textarea
            placeholder="Describe your pod's vibe..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg bg-foreground/10 p-3 text-foreground transition focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          {/* Name Input */}
          <input
            type="text"
            placeholder="Enter your pod name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-lg bg-foreground/10 p-3 text-foreground transition focus:ring-2 focus:ring-blue-500"
          />

          {/* Domain Selection */}
          <div>
            <p className="mb-2 text-foreground">Choose Your Domain</p>
            <div className="grid grid-cols-4 gap-2">
              {["Tech", "Anime", "Music", "Other"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setDomain(item);
                    if (item !== "Other") setCustomDomain(""); // Reset custom domain if not "Other"
                  }}
                  className={`rounded-lg py-2 transition ${
                    domain === item
                      ? "bg-foreground text-background"
                      : "bg-foreground/10 text-foreground hover:bg-foreground/20"
                  } `}
                >
                  {item}
                </button>
              ))}
            </div>
            {domain === "Other" && (
              <input
                type="text"
                placeholder="Enter your custom domain"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                className="mt-2 w-full rounded-lg bg-foreground/10 p-3 text-foreground transition focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          {/* Subtag Selection */}
          <div>
            <p className="mb-2 text-foreground">Pick Your Vibe</p>
            <div className="grid grid-cols-4 gap-2">
              {["Happy", "Sad", "Fun", "Other"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setSubtag(item);
                    if (item !== "Other") setCustomSubtag(""); // Reset custom subtag if not "Other"
                  }}
                  className={`rounded-lg py-2 transition ${
                    subtag === item
                      ? "bg-foreground text-background"
                      : "bg-foreground/10 text-foreground hover:bg-foreground/20"
                  } `}
                >
                  {item}
                </button>
              ))}
            </div>
            {subtag === "Other" && (
              <input
                type="text"
                placeholder="Enter your custom vibe"
                value={customSubtag}
                onChange={(e) => setCustomSubtag(e.target.value)}
                className="mt-2 w-full rounded-lg bg-foreground/10 p-3 text-foreground transition focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          {/* Public Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={() => setIsPublic(!isPublic)}
              className="mr-2 text-foreground focus:ring-foreground"
            />
            <span className="text-foreground"> Public</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full rounded-lg py-2 transition ${
              isSubmitting
                ? "cursor-not-allowed bg-background"
                : "bg-foreground text-background hover:bg-foreground/90"
            }`}
          >
            {isSubmitting ? "Creating..." : "Create Pod"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreatePod;
