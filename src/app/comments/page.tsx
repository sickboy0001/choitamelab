import { getAllRecentComments } from "@/service/comment-service";
import CommentsList from "../../components/pages/comments/comments_list";

export default async function CommentsPage() {
  const comments = await getAllRecentComments();

  return (
    <div className="container mx-auto py-8">
      <CommentsList comments={comments as any} />
    </div>
  );
}
