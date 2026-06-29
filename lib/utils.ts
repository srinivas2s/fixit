import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { IssueCategory, IssueStatus } from '@/types';

/**
 * Merge Tailwind CSS classes with clsx + tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get urgency color based on score (0-100)
 */
export function getUrgencyColor(score: number): string {
  if (score >= 75) return '#ef4444'; // red
  if (score >= 50) return '#f97316'; // orange
  if (score >= 25) return '#eab308'; // yellow
  return '#22c55e'; // green
}

/**
 * Get urgency label
 */
export function getUrgencyLabel(score: number): string {
  if (score >= 75) return 'Critical';
  if (score >= 50) return 'High';
  if (score >= 25) return 'Medium';
  return 'Low';
}

/**
 * Get status badge color classes
 */
export function getStatusColor(status: IssueStatus): {
  text: string;
  bg: string;
  border: string;
} {
  const map: Record<IssueStatus, { text: string; bg: string; border: string }> = {
    reported: { text: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/20' },
    verified: { text: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
    in_progress: { text: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
    resolved: { text: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
    rejected: { text: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
  };
  return map[status];
}

/**
 * Get category icon name (Lucide)
 */
export function getCategoryIcon(category: IssueCategory): string {
  const map: Record<IssueCategory, string> = {
    pothole: 'Circle',
    water_leak: 'Droplets',
    broken_streetlight: 'Lightbulb',
    garbage: 'Trash2',
    fallen_tree: 'TreePine',
    damaged_sign: 'SignpostBig',
    other: 'AlertCircle',
  };
  return map[category];
}

/**
 * Get category label
 */
export function getCategoryLabel(category: IssueCategory): string {
  const map: Record<IssueCategory, string> = {
    pothole: 'Pothole',
    water_leak: 'Water Leak',
    broken_streetlight: 'Broken Streetlight',
    garbage: 'Garbage',
    fallen_tree: 'Fallen Tree',
    damaged_sign: 'Damaged Sign',
    other: 'Other',
  };
  return map[category];
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffDay > 30) return date.toLocaleDateString();
  if (diffDay > 0) return `${diffDay}d ago`;
  if (diffHr > 0) return `${diffHr}h ago`;
  if (diffMin > 0) return `${diffMin}m ago`;
  return 'Just now';
}

/**
 * Format date for display
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format date+time for display
 */
export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Convert file to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:mime;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Truncate text to max length with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Generate a random urgency score for demo/seed purposes
 */
export function randomUrgency(severity: number, confirmations: number): number {
  const base = severity * 10;
  const confirmBonus = confirmations * 5;
  const timeFactor = Math.floor(Math.random() * 15);
  return Math.min(100, base + confirmBonus + timeFactor);
}
