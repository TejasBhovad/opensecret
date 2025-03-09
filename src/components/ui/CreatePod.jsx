"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { createPod, sharePod } from "../../../utils/db/action.js";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const CreatePod = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    domain: "",
    customDomain: "",
    subtag: "",
    customSubtag: "",
    isPublic: true,
    emails: "",
  });

  const [alert, setAlert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectOption = (field, value) => {
    setFormData((prev) => {
      // Reset custom fields when selecting non-custom options
      if (field === "domain" && value !== "Other") {
        return { ...prev, domain: value, customDomain: "" };
      }
      if (field === "subtag" && value !== "Other") {
        return { ...prev, subtag: value, customSubtag: "" };
      }
      return { ...prev, [field]: value };
    });
  };

  const togglePublic = () => {
    setFormData((prev) => ({ ...prev, isPublic: !prev.isPublic }));
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const validateForm = () => {
    const {
      name,
      description,
      domain,
      customDomain,
      subtag,
      customSubtag,
      isPublic,
    } = formData;

    if (!description.trim()) {
      showAlert("error", "Please provide a description");
      return false;
    }

    if (name.length < 3) {
      showAlert("error", "Name must be at least 3 characters");
      return false;
    }

    if (!domain && !customDomain.trim()) {
      showAlert("error", "Please select or enter a domain");
      return false;
    }

    if (!subtag && !customSubtag.trim()) {
      showAlert("error", "Please select or enter a subtag");
      return false;
    }

    if (domain === "Other" && !customDomain.trim()) {
      showAlert("error", "Please enter your custom domain");
      return false;
    }

    if (subtag === "Other" && !customSubtag.trim()) {
      showAlert("error", "Please enter your custom subtag");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const {
        name,
        description,
        domain,
        customDomain,
        subtag,
        customSubtag,
        isPublic,
        emails,
      } = formData;

      const newPod = await createPod({
        admin_id: 3,
        is_public: isPublic,
        subtag: subtag === "Other" ? customSubtag : subtag,
        domain: domain === "Other" ? customDomain : domain,
        description,
        name,
      });

      if (!isPublic && emails.trim()) {
        await sharePod({
          pod_id: newPod.pod_id,
          emails,
        });
      }

      showAlert("success", "Pod created successfully");

      // Reset form
      setFormData({
        name: "",
        description: "",
        domain: "",
        customDomain: "",
        subtag: "",
        customSubtag: "",
        isPublic: true,
        emails: "",
      });
    } catch (error) {
      showAlert("error", "Failed to create pod");
      console.error("Pod Creation Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Domain and Subtag options
  const domainOptions = ["Tech", "Anime", "Music", "Other"];
  const subtagOptions = ["Happy", "Sad", "Fun", "Other"];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4"
          >
            <Alert
              variant={alert.type === "success" ? "default" : "destructive"}
            >
              <AlertTitle>
                {alert.type === "success" ? "Success" : "Error"}
              </AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <Card>
          <CardHeader>
            <h2 className="text-center text-xl font-semibold">Create Pod</h2>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Pod Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter pod name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your pod..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Domain</Label>
                <div className="grid grid-cols-4 gap-2">
                  {domainOptions.map((option) => (
                    <Button
                      key={option}
                      type="button"
                      variant={
                        formData.domain === option ? "default" : "outline"
                      }
                      onClick={() => selectOption("domain", option)}
                      className="h-9"
                    >
                      {option}
                    </Button>
                  ))}
                </div>

                {formData.domain === "Other" && (
                  <Input
                    name="customDomain"
                    placeholder="Enter custom domain"
                    value={formData.customDomain}
                    onChange={handleChange}
                    className="mt-2"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label>Subtag</Label>
                <div className="grid grid-cols-4 gap-2">
                  {subtagOptions.map((option) => (
                    <Button
                      key={option}
                      type="button"
                      variant={
                        formData.subtag === option ? "default" : "outline"
                      }
                      onClick={() => selectOption("subtag", option)}
                      className="h-9"
                    >
                      {option}
                    </Button>
                  ))}
                </div>

                {formData.subtag === "Other" && (
                  <Input
                    name="customSubtag"
                    placeholder="Enter custom subtag"
                    value={formData.customSubtag}
                    onChange={handleChange}
                    className="mt-2"
                  />
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={togglePublic}
                />
                <Label htmlFor="isPublic">Public pod</Label>
              </div>

              {!formData.isPublic && (
                <div className="space-y-2">
                  <Label htmlFor="emails">Share with (emails)</Label>
                  <Input
                    id="emails"
                    name="emails"
                    placeholder="comma-separated emails"
                    value={formData.emails}
                    onChange={handleChange}
                  />
                </div>
              )}
            </form>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Creating..." : "Create Pod"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CreatePod;
