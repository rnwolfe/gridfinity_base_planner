"use client";

import GridPlanner from "~/components/GridPlanner";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Gridfinity Base Planner
          </h1>
          <p className="mt-2 text-gray-600">
            Design and visualize your custom Gridfinity base layout
          </p>
        </div>
        <GridPlanner />
      </div>
    </main>
  );
}
