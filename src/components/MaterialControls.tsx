"use client";

import { useAtom } from "jotai";
import { materialSettingsAtom } from "~/atoms/grid";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { type MaterialSettings } from "~/types";

export default function MaterialControls() {
  const [settings, setSettings] = useAtom(materialSettingsAtom);

  const finishOptions = ["matte", "semi-gloss", "glossy"] as const;
  const environmentOptions = [
    "apartment",
    "city",
    "dawn",
    "forest",
    "lobby",
    "night",
    "park",
    "studio",
    "sunset",
    "warehouse",
  ] as const;

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Appearance Settings
      </h2>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Surface Finish</Label>
          <Select
            value={settings.finish}
            onValueChange={(value) =>
              setSettings({
                ...settings,
                finish: value as MaterialSettings["finish"],
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {finishOptions.map((finish) => (
                <SelectItem key={finish} value={finish}>
                  {finish.charAt(0).toUpperCase() + finish.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Color Mode</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={settings.useRandomColors ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setSettings({ ...settings, useRandomColors: true })
              }
              className="w-full"
            >
              Random Colors
            </Button>
            <Button
              variant={!settings.useRandomColors ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setSettings({ ...settings, useRandomColors: false })
              }
              className="w-full"
            >
              Custom Colors
            </Button>
          </div>
        </div>

        {/* Color Picker */}
        {!settings.useRandomColors && (
          <div className="space-y-2">
            <Label>Grid Colors</Label>
            <div className="flex flex-col gap-2">
              {settings.selectedColors.map((color, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={color}
                    onChange={(e) => {
                      const newColors = [...settings.selectedColors];
                      newColors[index] = e.target.value;
                      setSettings({
                        ...settings,
                        selectedColors: newColors,
                      });
                    }}
                    className="h-8 w-full"
                  />
                  {index > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newColors = settings.selectedColors.filter(
                          (_, i) => i !== index,
                        );
                        setSettings({
                          ...settings,
                          selectedColors: newColors,
                        });
                      }}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
              {settings.selectedColors.length < 5 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSettings({
                      ...settings,
                      selectedColors: [...settings.selectedColors, "#000000"],
                    });
                  }}
                >
                  Add Color
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Environment Selection */}
        <div className="space-y-2">
          <Label>Environment</Label>
          <Select
            value={settings.environment}
            onValueChange={(value) =>
              setSettings({
                ...settings,
                environment: value as MaterialSettings["environment"],
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {environmentOptions.map((env) => (
                <SelectItem key={env} value={env}>
                  {env.charAt(0).toUpperCase() + env.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Plane Color */}
        <div className="space-y-2">
          <Label>Base Color</Label>
          <Input
            type="color"
            value={settings.planeColor}
            onChange={(e) =>
              setSettings({ ...settings, planeColor: e.target.value })
            }
            className="h-8 w-full"
          />
        </div>
      </div>
    </div>
  );
}
