"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTodos() {
      const res = await fetch(
        "https://jsonplaceholder.typicode.com/todos?_limit=20"
      );
      const data = await res.json();
      setTodos(data);
      setIsLoading(false);
    }
    fetchTodos();
  }, []);

  const handleDelete = async (idToDelete: number) => {
    setTodos((currentTodos) =>
      currentTodos.filter((todo) => todo.id !== idToDelete)
    );

    try {
      await fetch(`https://jsonplaceholder.typicode.com/todos/${idToDelete}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to delete task from API:", error);
    }
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-extrabold mb-8 text-center text-foreground">
          My Todo List
        </h1>
        <p className="text-center">Loading tasks...</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-5xl font-extrabold mb-8 text-center text-foreground">
        My Todo List
      </h1>
      <ul className="space-y-4">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between p-6 bg-card rounded-xl border border-border shadow-sm"
          >
            <Link
              href={`/tasks/task/${todo.id}`}
              className="text-lg font-medium text-foreground hover:text-primary transition-colors pr-4"
            >
              {todo.title}
            </Link>
            <button
              onClick={() => handleDelete(todo.id)}
              className="bg-red-500/10 text-red-700 hover:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30 font-bold py-2 px-4 rounded-lg transition-colors flex-shrink-0"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
