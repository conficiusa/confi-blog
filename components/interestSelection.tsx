"use client";

import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import TopicIcon from "./TopicIcon";

interface InterestSelectionProps {
  selectedInterests: string[];
  onToggle: (interest: string) => void;
  setIsFetching: (isFetching: boolean) => void;
  topics: Topic[];
}

interface Topic {
  _id: string;
  title: string;
  color: string;
  icon: any;
}

export default function InterestSelection({
  selectedInterests,
  onToggle,
  topics,
}: InterestSelectionProps) {
  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  // Animation variants for each item
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {topics.map((topic) => {
        const isSelected = selectedInterests.includes(topic._id);

        return (
          <motion.div
            key={topic._id}
            variants={itemVariants}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative rounded-xl overflow-hidden transition-all duration-200
              ${
                isSelected
                  ? "ring-2 ring-primary ring-offset-2 bg-primary/5"
                  : "border hover:border-primary/50 hover:bg-muted/50"
              }
            `}
            onClick={() => onToggle(topic._id)}
            tabIndex={0}
            role="checkbox"
            aria-checked={isSelected}
            aria-label={`Select ${topic.title} as an topic`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onToggle(topic._id);
              }
            }}
          >
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                  <TopicIcon icon={topic.icon} title={topic.title} size={24} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-lg">{topic.title}</h4>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="h-6 w-6 rounded-full bg-primary flex items-center justify-center"
                      >
                        <Check className="h-4 w-4 text-white" />
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Visually hidden input for accessibility */}
            <input
              type="checkbox"
              className="sr-only"
              checked={isSelected}
              onChange={() => onToggle(topic._id)}
              aria-hidden="true"
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
