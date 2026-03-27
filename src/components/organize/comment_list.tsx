"use client";

import { useState } from "react";
import CommentForm from "./comment_form";
import { formatDateToJst } from "@/lib/date";
import { UserTooltip } from "./user_tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteCommentAction } from "@/app/comments/actions";

interface Comment {
  id: string;
  user_id: string | null;
  author_name: string | null;
  guest_name: string | null;
  content: string;
  created_at: string;
}

interface CommentListProps {
  comments: Comment[];
  targetType: "request" | "report";
  targetId: string;
  currentUserId?: string | null;
  isAdmin?: boolean;
}

export default function CommentList({
  comments,
  targetType,
  targetId,
  currentUserId,
  isAdmin = false,
}: CommentListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const canDelete = (comment: Comment) => {
    if (isAdmin) return true;
    if (!currentUserId) return false;
    return comment.user_id === currentUserId;
  };

  const handleDeleteClick = (comment: Comment) => {
    if (canDelete(comment)) {
      setCommentToDelete(comment);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!commentToDelete) return;

    setIsDeleting(true);
    try {
      const formData = new FormData();
      formData.append("comment_id", commentToDelete.id);
      await deleteCommentAction(formData);
      // ページを再読み込みして最新の状態を表示
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete comment:", error);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-slate-500 italic">
            まだコメントはありません。
          </p>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 bg-slate-50 border border-slate-100 rounded-lg space-y-1"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">
                      {comment.author_name && comment.user_id ? (
                        <UserTooltip
                          userId={comment.user_id}
                          name={comment.author_name}
                        />
                      ) : (
                        comment.guest_name || "ゲスト"
                      )}
                    </span>
                    {canDelete(comment) && (
                      <button
                        onClick={() => handleDeleteClick(comment)}
                        className="text-xs text-red-500 hover:text-red-700 hover:underline"
                      >
                        削除
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {formatDateToJst(comment.created_at)}
                  </span>
                </div>
                <div className="text-sm text-slate-800 whitespace-pre-wrap">
                  {comment.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-sm font-bold text-slate-700 mb-3">
          コメントを投稿する
        </h4>
        <CommentForm targetType={targetType} targetId={targetId} />
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>コメントを削除しますか？</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">この操作は取り消せません。</p>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              キャンセル
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "削除中..." : "削除"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
