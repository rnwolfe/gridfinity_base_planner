"use client";

import { GithubIcon } from "lucide-react";
import { SiDogecoin, SiBitcoin } from "react-icons/si";
import { Button } from "~/components/ui/button";
import GridPlanner from "~/components/GridPlanner";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8 lg:py-12">
      <div className="max-w-[1800px] mx-auto px-4">
        <div className="mb-8 flex flex-row flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Gridfinity Base Unit Planner
            </h1>
            <p className="mt-2 text-gray-600">
              Design and visualize your custom Gridfinity base layout
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <a
              href="https://github.com/N-Argyle/gridfinity_base_planner"
              target="_blank"
            >
              <Button variant={"outline"} size={"sm"}>
                <GithubIcon className="h-4 w-4" />
                View on Github
              </Button>
            </a>
            <div className="flex flex-col lg:items-end gap-2 lg:text-right text-xs text-gray-500">
              <div>
                <strong>Donate:</strong>
                <a
                  href="https://buymeacoffee.com/nargyle"
                  target="_blank"
                  className="ml-1 underline"
                >
                  Buy me a coffee
                </a>
              </div>
              <div className="flex flex-row items-end gap-1">
                <span
                  className="flex flex-row items-start gap-1 text-xs"
                  aria-label="Bitcoin"
                >
                  <Popover>
                    <PopoverTrigger>
                      <SiBitcoin className="inline-block h-6 w-6" />
                    </PopoverTrigger>
                    <PopoverContent className="text-xs">
                      <div>Bitcoin:</div>
                      <div>3Fc8LKQRSd2PHkaiJDycqqVCrRjgkC7MKw</div>
                    </PopoverContent>
                  </Popover>
                </span>
                <span
                  className="flex flex-row items-start gap-1 text-xs"
                  aria-label="Dogecoin"
                >
                  <Popover>
                    <PopoverTrigger>
                      <SiDogecoin className="inline-block h-6 w-6" />
                    </PopoverTrigger>
                    <PopoverContent className="text-xs">
                      <div>Dogecoin:</div>
                      <div>DSrmwvea92hgLTq1vGPcG29JrYNyZepq6Z</div>
                    </PopoverContent>
                  </Popover>
                </span>
              </div>
            </div>
          </div>
        </div>
        <GridPlanner />
      </div>
    </main>
  );
}
