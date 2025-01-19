"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/user";
import {
  Calendar,
  Folder,
  Globe,
  Lock,
  Plus,
  Tag,
  Users,
  X
} from "lucide-react";
import React from "react";
import { getUserPods } from "../../../utils/db/action";

// Pod Card Component
const PodCard = ({ pod, onOpenPod }) => {
  return (
    <div 
      className="bg-white shadow-lg rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-all"
      onClick={() => onOpenPod(pod)}
    >
      <div className="p-4 bg-gray-800 text-white flex justify-between items-center">
        <h3 className="text-xl font-bold truncate">
          {pod.title || 'Untitled Pod'}
        </h3>
        {pod.is_public ? (
          <Globe className="w-5 h-5 text-green-500" />
        ) : (
          <Lock className="w-5 h-5 text-red-500" />
        )}
      </div>
      <div className="p-4">
        <p className="text-gray-600 mb-4 line-clamp-3">
          {pod.description}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {pod.followers_count} Followers
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {pod.domain}
          </span>
        </div>
      </div>
    </div>
  );
};

// Detailed Pod View Component
const PodDetailView = ({ pod, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <div className="container mx-auto p-6 relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-all"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        {/* Pod Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            {pod.is_public ? (
              <Globe className="w-8 h-8 text-green-500" />
            ) : (
              <Lock className="w-8 h-8 text-red-500" />
            )}
            <h1 className="text-3xl font-bold">{pod.title || 'Untitled Pod'}</h1>
          </div>
          <p className="text-gray-600">{pod.description}</p>
        </div>

        {/* Pod Details Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Basic Information */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Tag className="mr-2 text-gray-500" />
              Basic Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Domain</p>
                <p className="font-medium">{pod.domain}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Subtag</p>
                <p className="font-medium">{pod.subtag}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Visibility</p>
                <p className="font-medium">
                  {pod.is_public ? 'Public' : 'Private'}
                </p>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Folder className="mr-2 text-gray-500" />
              Statistics
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Total Stories</p>
                <p className="font-medium">{pod.total_stories}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Followers</p>
                <p className="font-medium">{pod.followers_count}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Popularity Score</p>
                <p className="font-medium">{pod.popularity_score}</p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="mr-2 text-gray-500" />
              Timestamps
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Created At</p>
                <p className="font-medium">
                  {new Date(pod.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Admin ID</p>
                <p className="font-medium">{pod.admin_id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex space-x-4">
          <Button variant="outline">Edit Pod</Button>
          <Button variant="destructive">Delete Pod</Button>
        </div>
      </div>
    </div>
  );
};

const JournalPage = () => {
  const { error: userError, loading: userLoading, user } = useUser();
  const [pods, setPods] = React.useState([]);
  const [errorPods, setErrorPods] = React.useState(null);
  const [loadingPods, setLoadingPods] = React.useState(true);
  const [selectedPod, setSelectedPod] = React.useState(null);
  const [filter, setFilter] = React.useState('all');

  React.useEffect(() => {
    const fetchPods = async () => {
      if (!user) return;

      try {
        setLoadingPods(true);
        const fetchedPods = await getUserPods(user.user_id);
        setPods(fetchedPods);
        setErrorPods(null);
      } catch (err) {
        setErrorPods(err.message);
      } finally {
        setLoadingPods(false);
      }
    };

    fetchPods();
  }, [user]);

  // Filter pods
  const filteredPods = React.useMemo(() => {
    return pods.filter(pod => {
      if (filter === 'all') return true;
      return filter === 'public' ? pod.is_public : !pod.is_public;
    });
  }, [pods, filter]);

  if (userLoading) {
    return <div className="text-center py-8">Loading user data...</div>;
  }

  if (userError) {
    return <div className="text-center text-red-500 py-8">{userError}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Pods</h1>
        <Button variant="default">
          <Plus className="mr-2" /> Create Pod
        </Button>
      </div>

      <div className="flex space-x-4 mb-6">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All Pods
        </Button>
        <Button 
          variant={filter === 'public' ? 'default' : 'outline'}
          onClick={() => setFilter('public')}
        >
          Public
        </Button>
        <Button 
          variant={filter === 'private' ? 'default' : 'outline'}
          onClick={() => setFilter('private')}
        >
          Private
        </Button>
      </div>

      {loadingPods ? (
        <div className="text-center py-8">Loading pods...</div>
      ) : errorPods ? (
        <div className="text-center text-red-500 py-8">{errorPods}</div>
      ) : filteredPods.length === 0 ? (
        <div className="text-center py-8">No pods found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredPods.map(pod => (
            <PodCard 
              key={pod.pod_id} 
              pod={pod} 
              onOpenPod={setSelectedPod} 
            />
          ))}
        </div>
      )}

      {selectedPod && (
        <PodDetailView 
          pod={selectedPod} 
          onClose={() => setSelectedPod(null)} 
        />
      )}
    </div>
  );
};

export default JournalPage;