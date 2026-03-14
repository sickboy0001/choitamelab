import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  Users,
  Zap,
  ShieldCheck,
} from "lucide-react";

export default async function Home() {
  const session = await auth();

  // ログイン済みの場合はダッシュボードへリダイレクト
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <span className="px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-orange-600 uppercase bg-orange-100 rounded-full">
              新時代のコラボレーションツール
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight">
              あなたの「ちょっと」を、
              <br />
              <span className="text-orange-600">誰かの力に変える。</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl">
              ChoitameLab（ちょいためらぼ）は、小さな依頼と報告を通じて、
              コミュニティの成果を可視化し、価値を高めるプラットフォームです。
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth/signin"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-orange-600 rounded-full hover:bg-orange-700 transition-all shadow-lg shadow-orange-200"
              >
                今すぐ始める
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                href="/requests"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-700 bg-white border-2 border-slate-200 rounded-full hover:bg-slate-50 transition-all"
              >
                依頼を見る
              </Link>
            </div>
          </div>
        </div>

        {/* Background decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-300 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-200 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Choitameでできること
            </h2>
            <div className="w-20 h-1.5 bg-orange-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-slate-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">かんたん依頼作成</h3>
              <p className="text-slate-600">
                誰かに手伝ってほしいこと、共有してほしい情報を「依頼」としてすぐに投稿できます。
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-slate-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">スムーズな報告</h3>
              <p className="text-slate-600">
                依頼に対する成果をテンプレートに沿って報告。進捗管理も一目でわかります。
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-slate-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">活動の可視化</h3>
              <p className="text-slate-600">
                これまでの貢献や依頼の履歴が蓄積され、コミュニティ内での信頼に繋がります。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold mb-6">
                <ShieldCheck size={16} />
                <span>信頼のプラットフォーム</span>
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                安全で透明性の高い
                <br />
                やり取りをサポート
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                ChoitameLabは、ユーザー同士が安心して協力し合えるよう、認証機能と履歴管理を徹底しています。誰がどのような貢献をしたかが明確になるため、健全なコミュニティ運営が可能です。
              </p>
              <ul className="space-y-4">
                {[
                  "Google認証による安心のログイン",
                  "依頼・報告の全履歴を保存",
                  "公開範囲の柔軟な設定",
                  "コメント機能での活発な議論",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-slate-700 font-medium"
                  >
                    <CheckCircle2 className="text-orange-600" size={20} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 relative">
              <div className="aspect-square bg-orange-200 rounded-3xl rotate-3 absolute inset-0 -z-10" />
              <div className="aspect-square bg-white rounded-3xl shadow-2xl border border-slate-100 flex items-center justify-center p-12 relative overflow-hidden">
                <div className="text-orange-600 font-black text-8xl opacity-10 absolute -right-4 -bottom-4 select-none">
                  CHOI
                </div>
                <div className="text-center relative z-10">
                  <div className="w-24 h-24 bg-orange-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-6 shadow-xl shadow-orange-200">
                    C
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    Your Value
                  </p>
                  <p className="text-slate-500 italic">Created by Actions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 bg-orange-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            さあ、新しい体験を始めましょう
          </h2>
          <p className="text-xl text-orange-100 mb-12 max-w-2xl mx-auto">
            面倒な登録は不要です。Googleアカウントですぐに使い始めることができます。
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center justify-center px-10 py-5 text-xl font-extrabold text-orange-600 bg-white rounded-full hover:bg-orange-50 transition-all shadow-2xl"
          >
            無料で登録・ログイン
          </Link>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-orange-600">Choitame</span>
            <span className="text-slate-400 text-sm">
              © 2026 Choitame Team.
            </span>
          </div>
          <div className="flex gap-8 text-sm text-slate-600 font-medium">
            <Link
              href="/requests"
              className="hover:text-orange-600 transition-colors"
            >
              依頼一覧
            </Link>
            <Link
              href="/auth/signin"
              className="hover:text-orange-600 transition-colors"
            >
              ログイン
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
