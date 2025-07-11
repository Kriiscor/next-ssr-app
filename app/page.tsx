import Link from "next/link";
import type { Metadata } from "next";

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export const metadata: Metadata = {
  title: "Todo List | Next.js SSR",
  description:
    "A list of todos generated using Next.js with Server-Side Rendering.",
};

async function getTodos(): Promise<Todo[]> {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/todos?_limit=20"
  );
  if (!res.ok) {
    throw new Error("API request failed");
  }
  return res.json();
}

export default async function HomePage() {
  let todos: Todo[] = [];
  let error: string | null = null;

  try {
    todos = await getTodos();
  } catch (e) {
    console.error(e);
    error = "Failed to load the tasks. Please try refreshing the page.";
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-5xl font-extrabold mb-8 text-center text-foreground">
        My Todo List
      </h1>

      {error && (
        <div className="p-4 text-center text-red-700 bg-red-100 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      {!error && (
        <ul className="space-y-4">
          {todos.map((todo) => (
            <li key={todo.id}>
              <Link
                href={`/tasks/task/${todo.id}`}
                className="block p-6 bg-card rounded-xl border border-border shadow-sm hover:border-primary transition-all duration-200"
              >
                <span className="text-lg font-medium text-foreground">
                  {todo.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
