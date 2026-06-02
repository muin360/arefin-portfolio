import type { Metadata } from "next";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Messages",
};

export default function MessagesPage() {
  // TODO: Fetch messages from database
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white">Contact Messages</h1>
        <p className="text-slate-400 mt-2">
          View and manage contact form submissions
        </p>
      </div>

      {/* Messages List */}
      <div className="bg-slate-700 border border-slate-600 rounded-lg p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Mail className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">
              Messages will be displayed here once received
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
