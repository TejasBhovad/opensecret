"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { motion } from "motion/react";
import { useUser } from "@/hooks/user";
import {
  Check,
  Clock,
  Eye,
  Globe,
  Lock,
  Plus,
  X,
  ArrowLeft,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Capsule = () => {
  const { user } = useUser();
  const [step, setStep] = useState("initial");
  const [selectedVisibility, setSelectedVisibility] = useState(null);
  const [userPods, setUserPods] = useState([]);
  const [timeCapsules, setTimeCapsules] = useState([]);
  const [selectedPod, setSelectedPod] = useState(null);
  const [newCapsule, setNewCapsule] = useState({
    content: "",
    revealDate: "",
    triggerType: "automatic",
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Mock data and functions
  useEffect(() => {
    // Simulate fetching user's pods
    const mockPods = [
      {
        pod_id: 1,
        title: "Personal Growth",
        is_public: true,
        domain: "Self Improvement",
      },
      {
        pod_id: 2,
        title: "Work Projects",
        is_public: false,
        domain: "Professional",
      },
    ];

    // Simulate fetching time capsules
    const mockCapsules = [
      {
        id: 1,
        content: "My future goals",
        reveal_date: new Date(2024, 5, 15),
        is_revealed: false,
      },
    ];

    setUserPods(mockPods);
    setTimeCapsules(mockCapsules);
  }, []);

  // Reset process
  const resetProcess = () => {
    setStep("initial");
    setSelectedVisibility(null);
    setSelectedPod(null);
    setNewCapsule({
      content: "",
      revealDate: "",
      triggerType: "automatic",
    });
    setNotification(null);
  };

  // Show notification
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Create time capsule
  const handleCreateCapsule = async (e) => {
    e.preventDefault();

    if (!selectedPod) {
      showNotification("error", "Please select a pod");
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      const newCapsuleData = {
        id: timeCapsules.length + 1,
        content: newCapsule.content,
        reveal_date: new Date(newCapsule.revealDate),
        is_revealed: false,
      };

      // Update local state
      setTimeCapsules((prev) => [...prev, newCapsuleData]);

      // Show success message
      showNotification("success", "Time capsule created successfully");

      // Reset form and navigation
      setTimeout(() => {
        resetProcess();
      }, 2000);
    } catch (err) {
      console.error("Failed to create time capsule", err);
      showNotification("error", "Failed to create time capsule");
    } finally {
      setLoading(false);
    }
  };

  // Render visibility selection step
  const renderVisibilitySelection = () => {
    return (
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Choose Capsule Visibility</CardTitle>
          <CardDescription>
            Select whether your capsule will be public or private
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={selectedVisibility === "public" ? "default" : "outline"}
              onClick={() => {
                setSelectedVisibility("public");
                setStep("pods");
              }}
              className="h-20"
            >
              <Globe className="mr-2 h-5 w-5" /> Public
            </Button>
            <Button
              variant={selectedVisibility === "private" ? "default" : "outline"}
              onClick={() => {
                setSelectedVisibility("private");
                setStep("pods");
              }}
              className="h-20"
            >
              <Lock className="mr-2 h-5 w-5" /> Private
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" onClick={resetProcess} className="w-full">
            Cancel
          </Button>
        </CardFooter>
      </Card>
    );
  };

  // Render pod selection step
  const renderPodSelection = () => {
    const filteredPods = userPods.filter((pod) =>
      selectedVisibility === "public" ? pod.is_public : !pod.is_public,
    );

    return (
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Select a Pod</CardTitle>
          <CardDescription>
            Choose which pod to add your time capsule to
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPods.length === 0 ? (
            <div className="rounded-lg bg-muted py-4 text-center">
              <p className="text-muted-foreground">
                No {selectedVisibility} pods available
              </p>
            </div>
          ) : (
            <div className="grid gap-2">
              {filteredPods.map((pod) => (
                <Button
                  key={pod.pod_id}
                  variant={
                    selectedPod?.pod_id === pod.pod_id ? "default" : "outline"
                  }
                  onClick={() => {
                    setSelectedPod(pod);
                    setStep("create");
                  }}
                  className="h-auto justify-start py-3"
                >
                  <div className="flex w-full justify-between">
                    <div className="text-left">
                      <p className="font-medium">{pod.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {pod.domain}
                      </p>
                    </div>
                    {pod.is_public ? (
                      <Globe className="h-4 w-4" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </div>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            onClick={() => setStep("visibility")}
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </CardFooter>
      </Card>
    );
  };

  // Render capsule creation step
  const renderCapsuleCreation = () => {
    return (
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Create Time Capsule</CardTitle>
          <CardDescription>Write a message to your future self</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="capsule-form"
            onSubmit={handleCreateCapsule}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="content">Capsule Content</Label>
              <Textarea
                id="content"
                value={newCapsule.content}
                onChange={(e) =>
                  setNewCapsule((prev) => ({
                    ...prev,
                    content: e.target.value,
                  }))
                }
                placeholder="Write your message..."
                required
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="revealDate">Reveal Date</Label>
              <Input
                id="revealDate"
                type="date"
                value={newCapsule.revealDate}
                onChange={(e) =>
                  setNewCapsule((prev) => ({
                    ...prev,
                    revealDate: e.target.value,
                  }))
                }
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Trigger Type</Label>
              <RadioGroup
                value={newCapsule.triggerType}
                onValueChange={(value) =>
                  setNewCapsule((prev) => ({
                    ...prev,
                    triggerType: value,
                  }))
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="automatic" id="automatic" />
                  <Label htmlFor="automatic">Automatic</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="manual" id="manual" />
                  <Label htmlFor="manual">Manual</Label>
                </div>
              </RadioGroup>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col space-y-2">
          <Button
            type="submit"
            form="capsule-form"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Time Capsule"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setStep("pods")}
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </CardFooter>
      </Card>
    );
  };

  // Render capsule cards
  const renderCapsuleCards = () => {
    if (timeCapsules.length === 0) {
      return (
        <div className="rounded-lg bg-muted py-6 text-center">
          <p className="text-muted-foreground">No time capsules created yet</p>
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {timeCapsules.map((capsule) => (
          <Card key={capsule.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Time Capsule</CardTitle>
                {capsule.is_revealed ? (
                  <Eye className="h-4 w-4 text-green-500" />
                ) : (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-2">{capsule.content}</p>
            </CardContent>
            <CardFooter className="border-t pt-2 text-xs text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              {capsule.is_revealed ? "Revealed on" : "Will reveal on"}{" "}
              {capsule.reveal_date.toLocaleDateString()}
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-4"
        >
          <Alert
            variant={
              notification.type === "success" ? "default" : "destructive"
            }
          >
            <AlertTitle>
              {notification.type === "success" ? "Success" : "Error"}
            </AlertTitle>
            <AlertDescription>{notification.message}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <h1 className="flex items-center text-2xl font-bold">
          <Clock className="mr-2 h-5 w-5" /> Time Capsules
        </h1>
        {step === "initial" && (
          <Button onClick={() => setStep("visibility")}>
            <Plus className="mr-2 h-4 w-4" /> Create Capsule
          </Button>
        )}
      </div>

      {/* Render steps */}
      {step === "visibility" && renderVisibilitySelection()}
      {step === "pods" && renderPodSelection()}
      {step === "create" && renderCapsuleCreation()}

      {/* Render existing time capsules when not in creation flow */}
      {step === "initial" && (
        <>
          <Separator className="my-6" />
          <div className="my-6">
            <h2 className="mb-4 text-xl font-semibold">Your Time Capsules</h2>
            {renderCapsuleCards()}
          </div>
        </>
      )}
    </div>
  );
};

export default Capsule;
