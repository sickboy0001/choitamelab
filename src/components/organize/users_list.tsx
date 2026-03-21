"use client";

import { useEffect, useState } from "react";
import { UserTooltip } from "@/components/organize/user_tooltip";
import {
  getRecentUpdatedUsersAction,
  getPublicUserProfile,
} from "@/service/user-actions";
import { formatDateToJst } from "@/lib/date";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { Markdown } from "@/components/ui/markdown";

interface UserItem {
  id: string;
  display_name: string;
  updated_at: string;
}

interface UserProfile {
  id: string;
  display_name: string;
  self_intro_markdown: string | null;
}

interface UsersListProps {
  limit?: number;
}

export default function UsersList({ limit = 3 }: UsersListProps) {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getRecentUpdatedUsersAction(limit);
        setUsers(fetchedUsers as any);
      } catch (error) {
        console.error("Failed to fetch recent users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [limit]);

  const handleOpenModal = async (userId: string) => {
    setIsProfileLoading(true);
    setIsModalOpen(true);
    try {
      const profile = await getPublicUserProfile(userId);
      setSelectedUser(profile);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    } finally {
      setIsProfileLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin h-5 w-5 border-2 border-orange-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {users.length === 0 ? (
        <p className="text-slate-400 text-xs text-center py-4">
          ユーザーはいません。
        </p>
      ) : (
        users.map((user) => (
          <div
            key={user.id}
            className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <UserTooltip userId={user.id} name={user.display_name} />
              <button
                onClick={() => handleOpenModal(user.id)}
                className="p-1 text-slate-400 hover:text-orange-600 transition-colors"
                title="プロフィール詳細"
              >
                <Info size={14} />
              </button>
            </div>
            <span className="text-[10px] text-slate-400">
              {formatDateToJst(user.updated_at, "MM-dd")}
            </span>
          </div>
        ))
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isProfileLoading ? "読み込み中..." : selectedUser?.display_name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {isProfileLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-orange-500 rounded-full border-t-transparent"></div>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                {selectedUser?.self_intro_markdown ? (
                  <Markdown content={selectedUser.self_intro_markdown} />
                ) : (
                  <p className="text-slate-500 italic text-center py-4">
                    自己紹介はありません。
                  </p>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
