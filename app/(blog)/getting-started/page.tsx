"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import InterestSelection from "@/components/interestSelection";
import { useRouter } from "next/navigation";
interface Topic {
  _id: string;
  title: string;
  color: string;
  icon: any;
}
export default function OnboardingPage() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch("/api/topics");
        if (!response.ok) throw new Error("Failed to fetch topics");
        const data = await response.json();
        setTopics(data.topics || []);
      } catch (error) {
        console.error("Failed to fetch topics:", error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchTopics();
  }, []);

  const handleInterestToggle = async (interest: string) => {
    setSelectedInterests((prev) => {
      if (prev.length === 3) {
        return prev;
      }
      if (prev.includes(interest)) {
        return prev.filter((id) => id !== interest);
      }
      const newSelected = [...prev, interest];
      if (newSelected.length === 3) {
        saveInterests(newSelected);
      }
      return newSelected;
    });
  };

  const saveInterests = async (interests: string[]) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interests }),
      });
      if (!response.ok) throw new Error("Failed to save interests");
      router.push("/");
    } catch (error) {
      console.error("Failed to save interests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading topics...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Dark overlay when saving interests */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-background rounded-lg p-6 shadow-xl flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-foreground font-medium">Saving your interests...</p>
          </div>
        </div>
      )}
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-10"
        >
          <div className="space-y-4 text-center max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold tracking-tight">
              Personalize your experience
            </h2>
            <p className="text-sm text-muted-foreground">
              Select three topics you&apos;re interested in to help us customize your
              content feed.
            </p>
          </div>

          <div className="space-y-6">
            <InterestSelection
              selectedInterests={selectedInterests}
              onToggle={handleInterestToggle}
              setIsFetching={setIsFetching}
              topics={topics}
            />
          </div>
        </motion.div>
        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-xs">
            Select 3 interests to get started
          </p>
        </div>
      </main>
    </div>
  );
}
