import CommentsList from "../../components/pages/comments/comments_list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "コメント一覧 | ChoitameLab",
};

export default async function CommentsPage() {
  return (
    <div className="container mx-auto py-8">
      <CommentsList />
    </div>
  );
}
