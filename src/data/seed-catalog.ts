/**
 * Single source of truth for the initial catalog, transcribed from the supplied
 * "Electro Project Items" shop catalog PDF (60 items, prices in INR).
 * Admins can change every field from the dashboard after seeding — this file is
 * only used once, to populate the database (see supabase/seed.sql and
 * src/lib/demo/store.ts).
 */

export const CATEGORY_NAMES = [
  "Microcontrollers",
  "Motors & Drivers",
  "Sensors",
  "LEDs & Displays",
  "Switches & Controls",
  "Capacitors",
  "Resistors",
  "Diodes",
  "Transistors",
  "ICs",
  "Wires & Jumper Wires",
  "PCBs & Breadboards",
  "Soldering & Tools",
  "Batteries & Power",
  "Modules",
  "Other Components",
] as const;

export const CATEGORY_ICONS: Record<string, string> = {
  Microcontrollers: "cpu",
  "Motors & Drivers": "cog",
  Sensors: "radar",
  "LEDs & Displays": "lightbulb",
  "Switches & Controls": "toggle-left",
  Capacitors: "battery",
  Resistors: "zap",
  Diodes: "git-commit-horizontal",
  Transistors: "component",
  ICs: "microchip",
  "Wires & Jumper Wires": "cable",
  "PCBs & Breadboards": "layout-grid",
  "Soldering & Tools": "wrench",
  "Batteries & Power": "battery-charging",
  Modules: "box",
  "Other Components": "package",
};

export interface SeedProduct {
  name: string;
  price: number;
  category: (typeof CATEGORY_NAMES)[number];
  featured?: boolean;
}

export const SEED_PRODUCTS: SeedProduct[] = [
  { name: "7 Segment Display", price: 20, category: "LEDs & Displays" },
  { name: "Buzzer", price: 35, category: "Modules" },
  { name: "IR Receiver", price: 15, category: "Sensors" },
  { name: "Laser Module", price: 50, category: "Modules" },

  { name: "Capacitor 10µF 35V", price: 5, category: "Capacitors" },
  { name: "Capacitor 100µF 35V", price: 5, category: "Capacitors" },
  { name: "Capacitor 220µF 35V", price: 5, category: "Capacitors" },
  { name: "ESP32 (38 Pin)", price: 500, category: "Microcontrollers", featured: true },

  { name: "Multimeter Wire", price: 50, category: "Soldering & Tools" },
  { name: "12V Coin Light", price: 10, category: "LEDs & Displays" },
  { name: "Tiptop Switch", price: 10, category: "Switches & Controls" },
  { name: "Iron Stand", price: 100, category: "Soldering & Tools" },

  { name: "10K Potentiometer", price: 15, category: "Switches & Controls" },
  { name: "Crocodile Clip", price: 15, category: "Wires & Jumper Wires" },
  { name: "Potentiometer Knob", price: 5, category: "Switches & Controls" },
  { name: "DC Male/Female Wire Set", price: 30, category: "Wires & Jumper Wires" },

  { name: "Male-to-Female Jumper Wire (1 pc)", price: 8, category: "Wires & Jumper Wires" },
  { name: "9V NIPPO Battery", price: 50, category: "Batteries & Power" },
  { name: "LDR", price: 10, category: "Sensors" },
  { name: "775 Motor", price: 250, category: "Motors & Drivers", featured: true },

  { name: "Cutter", price: 60, category: "Soldering & Tools" },
  { name: "4×4 PCB", price: 50, category: "PCBs & Breadboards" },
  { name: "2×6 PCB", price: 70, category: "PCBs & Breadboards" },
  { name: "1-Core Black Wire (1 m)", price: 20, category: "Wires & Jumper Wires" },

  { name: "1-Core Red Wire (1 m)", price: 20, category: "Wires & Jumper Wires" },
  { name: "Soldering Wire Set", price: 150, category: "Soldering & Tools" },
  { name: "Soldering Wire (1 m)", price: 30, category: "Soldering & Tools" },
  { name: "Soldering Iron", price: 150, category: "Soldering & Tools" },

  { name: "Mini Resistor Box", price: 60, category: "Resistors" },
  { name: "0–12V Transformer", price: 125, category: "Batteries & Power" },
  { name: "9V Battery Cap", price: 5, category: "Batteries & Power" },
  { name: "1N4007 Diode", price: 5, category: "Diodes" },

  { name: "5V1 Diode", price: 5, category: "Diodes" },
  { name: "8V2 Diode", price: 5, category: "Diodes" },
  { name: "Micro Push Button", price: 5, category: "Switches & Controls" },
  { name: "Slide Switch", price: 10, category: "Switches & Controls" },

  { name: "Normal Switch", price: 7, category: "Switches & Controls" },
  { name: "SG90 Micro Servo Motor", price: 150, category: "Motors & Drivers", featured: true },
  { name: "L298N Motor Driver / Servo Shield", price: 250, category: "Motors & Drivers", featured: true },
  { name: "2N2222A Transistor", price: 5, category: "Transistors" },

  { name: "BC547 Transistor", price: 5, category: "Transistors" },
  { name: "BC557 Transistor", price: 5, category: "Transistors" },
  { name: "IC 741", price: 20, category: "ICs" },
  { name: "IC 746", price: 20, category: "ICs" },

  { name: "IC 7485", price: 30, category: "ICs" },
  { name: "IC 7486", price: 20, category: "ICs" },
  { name: "IC 7432", price: 20, category: "ICs" },
  { name: "IC 7408", price: 20, category: "ICs" },

  { name: "IC 7404", price: 20, category: "ICs" },
  { name: "IC 7402", price: 20, category: "ICs" },
  { name: "IC 7400", price: 20, category: "ICs" },
  { name: "Big Breadboard", price: 100, category: "PCBs & Breadboards", featured: true },

  { name: "Mid Breadboard", price: 70, category: "PCBs & Breadboards" },
  { name: "Small Breadboard", price: 30, category: "PCBs & Breadboards" },
  { name: "Preset 5K", price: 10, category: "Resistors" },
  { name: "Preset 10K", price: 10, category: "Resistors" },

  { name: "Multimeter", price: 200, category: "Soldering & Tools", featured: true },
  { name: "All Type Resistor", price: 2, category: "Resistors" },
  { name: "All Type LED", price: 2, category: "LEDs & Displays" },
  { name: "Male-to-Male Jumper Wire (1 pc)", price: 3, category: "Wires & Jumper Wires" },
];
