"use client";

import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUser } from "@/hooks/user";
import { OnboardedUser } from "../../../utils/db/action";

const usernameCategories = [
  { value: "mystical_scribe", label: "Mystical Scribe" },
  { value: "word_weaver", label: "Word Weaver" },
  { value: "plot_twister", label: "Plot Twister" },
  { value: "prose_pioneer", label: "Prose Pioneer" },
  { value: "narrative_nomad", label: "Narrative Nomad" },
  { value: "literary_legend", label: "Literary Legend" },
];

export function OnBoarding() {
  const { user, loading, error, refreshUser } = useUser();
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState("");

  useEffect(() => {
    if (user && !user.onboarded) {
      setIsOpen(true);
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleOnboard = async () => {
    if (!selectedUsername) return;

    try {
      setIsOnboarding(true);
      await OnboardedUser(user.user_id, { username: selectedUsername });
      await refreshUser();
      setIsOnboarding(false);
      setIsOpen(false);
    } catch (error) {
      console.error("Onboarding error:", error);
      setIsOnboarding(false);
    }
  };

  const handleSkip = () => {
    setIsOpen(false);
  };

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Welcome to Our Writing Community
            </AlertDialogTitle>
            <AlertDialogDescription>
              Choose your writer persona to get started. You can always change
              this later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <RadioGroup
              value={selectedUsername}
              onValueChange={setSelectedUsername}
            >
              {usernameCategories.map((category) => (
                <div
                  key={category.value}
                  className="flex items-center space-x-2"
                >
                  <RadioGroupItem value={category.value} id={category.value} />
                  <Label htmlFor={category.value}>{category.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleSkip}>
              Skip for now
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleOnboard}
              disabled={isOnboarding || !selectedUsername}
            >
              {isOnboarding ? "Setting up..." : "Complete Setup"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {user && !user.onboarded && !isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          className="fixed bottom-4 right-4"
        >
          Choose Your Writer Persona
        </Button>
      )}
    </>
  );
}
