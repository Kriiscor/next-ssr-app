import Link from "next/link";
import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

interface TaskDetailPageProps {
  params: {
    id: string;
  };
}

async function getTodo(id: string): Promise<Todo> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch todo");
  }
  return res.json();
}

export async function generateMetadata({
  params,
}: TaskDetailPageProps): Promise<Metadata> {
  const id = params.id;
  const todo = await getTodo(id);

  return {
    title: `${todo.title} | Task Details`,
    description: `Details for task: ${todo.title}`,
  };
}

async function deleteTask(formData: FormData) {
  "use server";

  const id = formData.get("id");

  try {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to delete the task");
    }
  } catch (e) {
    console.error(e);
  }

  revalidatePath("/");
  redirect("/");
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const todo = await getTodo(params.id);

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="bg-card p-8 rounded-xl border border-border shadow-lg max-w-2xl mx-auto">
        <div className="flex justify-between items-start">
          <h1 className="text-4xl font-extrabold mb-6 text-foreground flex-1 pr-4">
            {todo.title}
          </h1>
          <form action={deleteTask}>
            <input type="hidden" name="id" value={todo.id} />
            <button
              type="submit"
              className="bg-red-500/10 text-red-700 hover:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30 font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Delete
            </button>
          </form>
        </div>
        <div className="space-y-4 text-lg">
          <p>
            <span className="font-semibold text-foreground/80">User ID:</span>{" "}
            {todo.userId}
          </p>
          <p>
            <span className="font-semibold text-foreground/80">Task ID:</span>{" "}
            {todo.id}
          </p>
        </div>
        <div className="mt-8 border-t border-border pt-6">
          <Link href="/" className="text-primary hover:underline font-semibold">
            &larr; Back to list
          </Link>
        </div>
      </div>
    </main>
  );
}
