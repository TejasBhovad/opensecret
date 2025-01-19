"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/user";
import {
  Check,
  Clock,
  Eye,
  Globe,
  Lock,
  Plus,
  X
} from "lucide-react";
import { useEffect, useState } from "react";

const Capsule = () => {
  const { user } = useUser();
  const [step, setStep] = useState('initial');
  const [selectedVisibility, setSelectedVisibility] = useState(null);
  const [userPods, setUserPods] = useState([]);
  const [timeCapsules, setTimeCapsules] = useState([]);
  const [selectedPod, setSelectedPod] = useState(null);
  const [newCapsule, setNewCapsule] = useState({
    content: "",
    revealDate: "",
    triggerType: "automatic"
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);

  // Mock data and functions
  useEffect(() => {
    // Simulate fetching user's pods
    const mockPods = [
      { 
        pod_id: 1, 
        title: "Personal Growth", 
        is_public: true, 
        domain: "Self Improvement" 
      },
      { 
        pod_id: 2, 
        title: "Work Projects", 
        is_public: false, 
        domain: "Professional" 
      }
    ];

    // Simulate fetching time capsules
    const mockCapsules = [
      {
        id: 1,
        content: "My future goals",
        reveal_date: new Date(2024, 5, 15),
        is_revealed: false
      }
    ];

    setUserPods(mockPods);
    setTimeCapsules(mockCapsules);
  }, []);

  // Reset process
  const resetProcess = () => {
    setStep('initial');
    setSelectedVisibility(null);
    setSelectedPod(null);
    setNewCapsule({
      content: "",
      revealDate: "",
      triggerType: "automatic"
    });
    setSuccessMessage(null);
    setError(null);
  };

  // Create time capsule
  const handleCreateCapsule = async (e) => {
    e.preventDefault();
    
    if (!selectedPod) {
      setError("Please select a pod");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      const newCapsuleData = {
        id: timeCapsules.length + 1,
        content: newCapsule.content,
        reveal_date: new Date(newCapsule.revealDate),
        is_revealed: false
      };

      // Update local state
      setTimeCapsules(prev => [...prev, newCapsuleData]);
      
      // Show success message
      setSuccessMessage("Time capsule created successfully!");
      
      // Reset form and navigation
      setTimeout(() => {
        resetProcess();
      }, 2000);
    } catch (err) {
      console.error("Failed to create time capsule", err);
      setError("Failed to create time capsule");
    } finally {
      setLoading(false);
    }
  };

  // Render time capsules list
  const renderTimeCapsules = () => {
    if (timeCapsules.length === 0) {
      return (
        <div className="text-center py-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No time capsules created yet</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {timeCapsules.map(capsule => (
          <div 
            key={capsule.id} 
            className="bg-white border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{capsule.content.slice(0, 50)}...</p>
              <p className="text-sm text-gray-500">
                Reveal Date: {capsule.reveal_date.toLocaleDateString()}
              </p>
            </div>
            <div>
              {capsule.is_revealed ? (
                <Eye className="text-green-500" />
              ) : (
                <Lock className="text-gray-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render visibility selection step
  const renderVisibilitySelection = () => {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Choose Capsule Visibility</h2>
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant={selectedVisibility === 'public' ? 'default' : 'outline'}
            onClick={() => {
              setSelectedVisibility('public');
              setStep('pods');
            }}
            className="flex items-center justify-center space-x-2"
          >
            <Globe className="mr-2" /> Public Capsule
          </Button>
          <Button 
            variant={selectedVisibility === 'private' ? 'default' : 'outline'}
            onClick={() => {
              setSelectedVisibility('private');
              setStep('pods');
            }}
            className="flex items-center justify-center space-x-2"
          >
            <Lock className="mr-2" /> Private Capsule
          </Button>
        </div>
        <Button 
          variant="ghost" 
          onClick={resetProcess}
          className="w-full mt-4"
        >
          Cancel
        </Button>
      </div>
    );
  };

  // Render pod selection step
  const renderPodSelection = () => {
    const filteredPods = userPods.filter(pod => 
      selectedVisibility === 'public' ? pod.is_public : !pod.is_public
    );

    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Select a Pod</h2>
        {filteredPods.length === 0 ? (
          <div className="text-center py-4">
            <p>No {selectedVisibility} pods available</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredPods.map(pod => (
              <Button
                key={pod.pod_id}
                variant={selectedPod?.pod_id === pod.pod_id ? 'default' : 'outline'}
                onClick={() => {
                  setSelectedPod(pod);
                  setStep('create');
                }}
                className="h-auto text-left flex flex-col items-start"
              >
                <div className="flex justify-between w-full">
                  <span>{pod.title}</span>
                  {pod.is_public ? <Globe className="text-green-500" /> : <Lock className="text-red-500" />}
                </div>
                <p className="text-sm text-gray-500">{pod.domain}</p>
              </Button>
            ))}
          </div>
        )}
        <Button 
          variant="ghost" 
          onClick={() => setStep('visibility')}
          className="w-full mt-4"
        >
          Back
        </Button>
      </div>
    );
  };

  // Render capsule creation step
  const renderCapsuleCreation = () => {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Create Time Capsule</h2>
        <form onSubmit={handleCreateCapsule}>
           <div className="mb-4">
            <label className="block text-gray-700 mb-2">Capsule Content</label>
            <textarea
              value={newCapsule.content}
              onChange={(e) => setNewCapsule(prev => ({
                ...prev,
                content: e.target.value
              }))}
              className="w-full border rounded p-2"
              rows="4"
              placeholder="Write your message..."
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Reveal Date</label>
            <input
              type="date"
              value={newCapsule.revealDate}
              onChange={(e) => setNewCapsule(prev => ({
                ...prev,
                revealDate: e.target.value
              }))}
              className="w-full border rounded p-2"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Trigger Type</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="automatic"
                  checked={newCapsule.triggerType === "automatic"}
                  onChange={() => setNewCapsule(prev => ({
                    ...prev,
                    triggerType: "automatic"
                  }))}
                />
                <span>Automatic</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="manual"
                  checked={newCapsule.triggerType === "manual"}
                  onChange={() => setNewCapsule(prev => ({
                    ...prev,
                    triggerType: "manual"
                  }))}
                />
                <span>Manual</span>
              </label>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Time Capsule"}
          </Button>
        </form>
        {successMessage && (
          <div className="mt-4 text-green-600">
            <Check className="inline mr-2" /> {successMessage}
          </div>
        )}
        {error && (
          <div className="mt-4 text-red-600">
            <X className="inline mr-2" /> {error}
          </div>
        )}
        <Button 
          variant="ghost" 
          onClick={() => setStep('pods')}
          className="w-full mt-2"
        >
          Back
        </Button>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Clock className="mr-2" /> Time Capsules
        </h1>
        <Button 
          onClick={() => setStep('visibility')}
        >
          <Plus className="mr-2" /> Create Capsule
        </Button>
      </div>

      {/* Render steps based on current state */}
      {step === 'initial' && (
        <div className="text-center py-4">
          <p>Select "Create Capsule" to begin.</p>
        </div>
      )}
      {step === 'visibility' && renderVisibilitySelection()}
      {step === 'pods' && renderPodSelection()}
      {step === 'create' && renderCapsuleCreation()}

      {/* Render existing time capsules */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Time Capsules</h2>
        {renderTimeCapsules()}
      </div>
    </div>
  );
};

export default Capsule;