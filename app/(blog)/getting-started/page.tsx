"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn, getStyles } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Intro } from "@/components/intro";

interface Topic {
  _id: string;
  title: string;
  color: string;
}
interface InterestPillProps {
  interest: { id: string; name: string; color: string };
  isSelected: boolean;
  onToggle: (id: string) => void;
}

const InterestPill: React.FC<InterestPillProps> = ({
  interest,
  isSelected,
  onToggle,
}) => {
  return (
    <Button
      style={!isSelected ? getStyles(interest.color) : undefined}
      variant={isSelected ? "default" : "outline"}
      className={`rounded-full px-10 py-2 text-sm font-medium transition-colors ${
        isSelected
          ? "bg-primary text-primary-foreground"
          : "bg-background hover:bg-accent hover:text-accent-foreground"
      }`}
      onClick={() => onToggle(interest.id)}
      aria-pressed={isSelected}
    >
      {interest.name}
    </Button>
  );
};
export default function InterestSelection() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [settings, setSettings] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch("/api/topics");
        if (!response.ok) throw new Error("Failed to fetch topics");
        const data = await response.json();
        setTopics(data.topics || []);
        setSettings(data.settings || []);
      } catch (error) {
        console.error("Failed to fetch topics:", error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchTopics();
  }, []);

  const handleTopicClick = async (topicId: string) => {
    setSelectedTopics((prev) => {
      if (prev.includes(topicId)) {
        return prev.filter((id) => id !== topicId);
      }
      const newSelected = [...prev, topicId];
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
    <div className="min-h-screen bg-muted rounded-xl p-8 flex items-center justify-center max-md:flex-col">
      <Intro title={settings?.title} description={settings?.description} />
      <div className="max-w-4xl mx-auto bg-white dark:bg-card p-8 rounded-lg shadow-md">
        <h1 className="text-xl  text-center text-primary">
          Choose Your Interests
        </h1>
        <p className="text-muted-foreground mb-8 text-center text-sm">
          Select at least 5 topics that interest you to personalize your
          experience
        </p>

        <div
          className={cn(
            "topics-container flex flex-wrap gap-4 justify-center",
            isLoading ? "opacity-50 pointer-events-none" : ""
          )}
        >
          {topics.map((topic) => (
            <InterestPill
              key={topic._id}
              interest={{
                id: topic._id,
                name: topic.title,
                color: topic.color,
              }}
              isSelected={selectedTopics.includes(topic._id)}
              onToggle={handleTopicClick}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="w-4 h-4 animate-spin " />
              Saving your selections...
            </div>
          ) : (
            <p className="text-muted-foreground text-xs">
              Select 3 interests to get started
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
