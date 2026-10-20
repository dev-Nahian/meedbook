"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { rating: number; review: string }) => void;
}

const ReviewModal = ({ open, onClose, onSubmit }: Props) => {
  const [rating, setRating] = useState(3);
  const [review, setReview] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-[500px] p-8">

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Rate your experience
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          Share your experience to help others make informed decisions
        </p>

        {/* Rating */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-xl text-gray-600">Rating</span>

          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onClick={() => setRating(star)}
                className={`w-8 h-8 cursor-pointer transition ${
                  star <= rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-yellow-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Textarea */}
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your experience..."
          className="w-full h-28 border border-gray-200 rounded-xl p-4 text-sm text-gray-600 outline-none mb-6"
        />

        {/* Actions */}
        <div className="flex justify-between items-center">
          <button
            onClick={onClose}
            className="text-sm text-gray-400"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onSubmit({ rating, review });
              onClose();
            }}
            className="bg-sky-400 hover:bg-sky-500 text-white px-6 py-2 rounded-xl text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;