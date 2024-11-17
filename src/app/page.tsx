"use client";

import { GithubIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import GridPlanner from "~/components/GridPlanner";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8 lg:py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-row items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Gridfinity Base Unit Planner
            </h1>
            <p className="mt-2 text-gray-600">
              Design and visualize your custom Gridfinity base layout
            </p>
          </div>
          <div>
            <a
              href="https://github.com/N-Argyle/gridfinity_base_planner"
              target="_blank"
            >
              <Button variant={"outline"} size={"sm"}>
                <GithubIcon className="h-4 w-4" />
                View on Github
              </Button>
            </a>
          </div>
        </div>
        <GridPlanner />
      </div>
    </main>
  );
}
