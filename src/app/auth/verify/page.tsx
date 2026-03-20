import Link from "next/link";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { success, error } = await searchParams;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        {success ? (
          <>
            <h1 className="text-4xl font-bold text-green-600">
              メール承認が完了しました
            </h1>
            <p className="mt-3 text-2xl">
              アカウントが有効化されました。ログインして利用を開始してください。
            </p>
            <div className="mt-6">
              <Link
                href="/auth/signin"
                className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                ログイン画面へ
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-red-600">
              エラーが発生しました
            </h1>
            <p className="mt-3 text-2xl">
              {error || "無効なトークンか、期限が切れています。"}
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="px-6 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700"
              >
                トップページへ
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
