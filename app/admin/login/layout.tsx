import { Metadata } from "next";

export const metadata: Metadata = {
  title: "관리자 로그인",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Simple layout without sidebar for login page
  return <>{children}</>;
}
