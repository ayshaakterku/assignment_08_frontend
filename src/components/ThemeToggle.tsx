
"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="theme-toggle"
        checked={theme === "dark"}
        onCheckedChange={(checked) =>
          setTheme(checked ? "dark" : "light")
        }
      />
      <Label htmlFor="theme-toggle">
        {theme === "dark" ? "Dark Mode" : "Light Mode"}
      </Label>
    </div>
  );
}



// "use client";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";

// import { useTheme } from "next-themes";

// export default function ThemeToggle() {
//   const { theme, setTheme } = useTheme();
//   return (
//     <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
//       <div className="flex items-center space-x-2">
//         <Switch id="airplane-mode" />
//         <Label htmlFor="airplane-mode">Toggle Theme</Label>        
//       </div>
//     </button>
//   );
// }
