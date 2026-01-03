import { redirect } from "next/navigation";

// Redirect to the main recipes admin page
// Individual recipe editing is handled via dialog
export default function AdminRecipeDetailPage() {
  redirect("/admin/recipes");
}
