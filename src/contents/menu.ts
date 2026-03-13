import {
  ClipboardList,
  FileText,
  MessageSquare,
  PlusCircle,
  LucideIcon,
} from "lucide-react";

export interface MenuItem {
  title: string;
  label: string;
  href: string;
  icon: LucideIcon;
  colorClass: string;
  bgColorClass: string;
  isAdminOnly?: boolean;
  isLoginOnly?: boolean;
}

export const menuDashboard: MenuItem[] = [
  {
    title: "依頼",
    label: "依頼一覧",
    href: "/requests",
    icon: ClipboardList,
    colorClass: "text-blue-600",
    bgColorClass: "bg-blue-100",
    isLoginOnly: false,
  },
  {
    title: "報告",
    label: "報告一覧",
    href: "/reports",
    icon: FileText,
    colorClass: "text-green-600",
    bgColorClass: "bg-green-100",
    isLoginOnly: true,
  },
  {
    title: "コメント",
    label: "コメント一覧",
    href: "/comments",
    icon: MessageSquare,
    colorClass: "text-purple-600",
    bgColorClass: "bg-purple-100",
    isLoginOnly: true,
  },
  {
    title: "新規作成",
    label: "新しい依頼",
    href: "/requests/new",
    icon: PlusCircle,
    colorClass: "text-orange-600",
    bgColorClass: "bg-orange-100",
    isLoginOnly: true,
  },
  {
    title: "Twittterテスト",
    label: "Twittterテスト",
    href: "/test/twitterPost",
    icon: PlusCircle,
    colorClass: "text-orange-600",
    bgColorClass: "bg-orange-100",
    isLoginOnly: true,
    isAdminOnly: true,
  },
];
