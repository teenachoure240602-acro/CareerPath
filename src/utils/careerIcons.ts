import {
  Code2,
  BrainCircuit,
  Database,
  Cloud,
  Shield,
  Smartphone,
  Server,
  BarChart3,
  Layout,
  Cpu,
  Lock,
  Globe,
  Bot,
  Network,
  PenTool,
  Boxes,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export const CAREER_ICONS: Record<string, LucideIcon> = {
  Code2,
  BrainCircuit,
  Database,
  Cloud,
  Shield,
  Smartphone,
  Server,
  BarChart3,
  Layout,
  Cpu,
  Lock,
  Globe,
  Bot,
  Network,
  PenTool,
  Boxes,
  Sparkles,
};

export function getCareerIcon(iconName: string): LucideIcon {
  return CAREER_ICONS[iconName] ?? Sparkles;
}

export function iconForCareerName(careerName: string): string {
  const lower = careerName.toLowerCase();
  if (lower.includes("full stack") || lower.includes("web") || lower.includes("frontend") || lower.includes("backend") || lower.includes("software")) return "Code2";
  if (lower.includes("ai") || lower.includes("ml") || lower.includes("machine learning") || lower.includes("deep learning")) return "BrainCircuit";
  if (lower.includes("data scientist") || lower.includes("data analyst")) return "BarChart3";
  if (lower.includes("data engineer") || lower.includes("database") || lower.includes("etl")) return "Database";
  if (lower.includes("cloud") || lower.includes("devops") || lower.includes("sre")) return "Cloud";
  if (lower.includes("security") || lower.includes("cyber")) return "Shield";
  if (lower.includes("mobile") || lower.includes("android") || lower.includes("ios") || lower.includes("flutter")) return "Smartphone";
  if (lower.includes("backend") || lower.includes("api")) return "Server";
  if (lower.includes("product")) return "Layout";
  if (lower.includes("blockchain") || lower.includes("web3")) return "Boxes";
  if (lower.includes("network")) return "Network";
  if (lower.includes("ux") || lower.includes("design")) return "PenTool";
  if (lower.includes("iot") || lower.includes("embedded")) return "Cpu";
  if (lower.includes("chatbot") || lower.includes("nlp")) return "Bot";
  return "Sparkles";
}
