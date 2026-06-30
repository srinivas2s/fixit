// ============================================================
// FixIt — TypeScript Type Definitions
// ============================================================

// ---- Enums ----

export type UserRole = 'citizen' | 'department_admin' | 'super_admin';

export type IssueCategory =
  | 'pothole'
  | 'water_leak'
  | 'broken_streetlight'
  | 'garbage'
  | 'fallen_tree'
  | 'damaged_sign'
  | 'other';

export type IssueStatus =
  | 'reported'
  | 'verified'
  | 'in_progress'
  | 'resolved'
  | 'rejected';

// ---- Database Models ----

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  department: string | null;
  reputation_score: number;
  total_reports: number;
  confirmed_reports: number;
  badges: string[];
  created_at: string;
}

export interface Report {
  id: string;
  citizen_id: string;
  title: string;
  description: string | null;
  category: IssueCategory;
  status: IssueStatus;
  severity: number;         // 1-10 from AI
  urgency_score: number;    // 0-100 computed
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  // Flat fields returned by Supabase (PostGIS stores as geography but queries can return flat)
  latitude: number;
  longitude: number;
  address: string | null;
  photo_url: string;
  photo_embedding: number[] | null;
  confirmation_count: number;
  confirmations: number;    // Alias used in some components
  assigned_department: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields (optional)
  citizen?: Profile;
  authority_report?: AuthorityReport;
}

export interface Confirmation {
  id: string;
  report_id: string;
  citizen_id: string;
  created_at: string;
  // Joined
  citizen?: Profile;
}

export interface AuthorityReport {
  id: string;
  report_id: string;
  compiled_at: string;
  department: string;
  content: AuthorityReportContent;
}

export interface AuthorityReportContent {
  issueType: IssueCategory;
  location: string;
  gps: {
    latitude: number;
    longitude: number;
  };
  photoUrl: string;
  severity: number;
  citizensAffected: number;
  urgencyScore: number;
  category: IssueCategory;
  recommendedPriority: 'URGENT' | 'HIGH' | 'NORMAL';
  generatedAt: string;
  reportId: string;
  aiSummary?: string;
}

// ---- API Request / Response Types ----

// POST /api/classify
export interface ClassifyRequest {
  imageBase64: string;
  mimeType: string;
}

export interface ClassifyResponse {
  category: IssueCategory;
  severity: number;
  confidence: number;
  description: string;
}

// POST /api/duplicates
export interface DuplicateCheckRequest {
  imageBase64: string;
  latitude: number;
  longitude: number;
}

export interface DuplicateCheckResponse {
  isDuplicate: boolean;
  matchedReportId?: string;
  similarity?: number;
  matchedReport?: Report;
}

// POST /api/urgency
export interface UrgencyRequest {
  reportId: string;
}

export interface UrgencyResponse {
  urgencyScore: number;
}

// POST /api/authority-report
export interface AuthorityReportRequest {
  reportId: string;
}

export interface AuthorityReportResponse {
  id: string;
  report_id: string;
  compiled_at: string;
  department: string;
  content: AuthorityReportContent;
}

// POST /api/reports
export interface CreateReportRequest {
  title: string;
  description?: string;
  category: IssueCategory;
  severity: number;
  latitude: number;
  longitude: number;
  address?: string;
  photoBase64: string;
  photoMimeType: string;
}

// GET /api/reports query params
export interface ReportFilters {
  category?: IssueCategory;
  status?: IssueStatus;
  department?: string;
  minUrgency?: number;
  maxUrgency?: number;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  citizenId?: string;
  limit?: number;
  offset?: number;
}

// ---- UI Types ----

export interface MapViewport {
  latitude: number;
  longitude: number;
  zoom: number;
}

export interface ReportStep {
  id: 'photo' | 'classification' | 'location' | 'details';
  label: string;
  completed: boolean;
}

// Category metadata for UI rendering
export interface CategoryMeta {
  value: IssueCategory;
  label: string;
  icon: string; // Lucide icon name
  color: string;
}

export const CATEGORY_META: CategoryMeta[] = [
  { value: 'pothole', label: 'Pothole', icon: 'Circle', color: '#ef4444' },
  { value: 'water_leak', label: 'Water Leak', icon: 'Droplets', color: '#3b82f6' },
  { value: 'broken_streetlight', label: 'Broken Streetlight', icon: 'Lightbulb', color: '#eab308' },
  { value: 'garbage', label: 'Garbage', icon: 'Trash2', color: '#a855f7' },
  { value: 'fallen_tree', label: 'Fallen Tree', icon: 'TreePine', color: '#22c55e' },
  { value: 'damaged_sign', label: 'Damaged Sign', icon: 'SignpostBig', color: '#f97316' },
  { value: 'other', label: 'Other', icon: 'AlertCircle', color: '#6b7280' },
];

// Status metadata for UI rendering
export interface StatusMeta {
  value: IssueStatus;
  label: string;
  color: string;
  bgColor: string;
}

export const STATUS_META: StatusMeta[] = [
  { value: 'reported', label: 'Reported', color: '#9ca3af', bgColor: '#1f2937' },
  { value: 'verified', label: 'Verified', color: '#3b82f6', bgColor: '#1e3a5f' },
  { value: 'in_progress', label: 'In Progress', color: '#eab308', bgColor: '#422006' },
  { value: 'resolved', label: 'Resolved', color: '#22c55e', bgColor: '#052e16' },
  { value: 'rejected', label: 'Rejected', color: '#ef4444', bgColor: '#450a0a' },
];

// Badge definitions
export interface BadgeDef {
  id: string;
  name: string;
  emoji: string;
  description: string;
  condition: string;
}

export const BADGES: BadgeDef[] = [
  {
    id: 'neighborhood_guardian',
    name: 'Neighborhood Guardian',
    emoji: '🏠',
    description: '10+ verified reports',
    condition: 'confirmed_reports >= 10',
  },
  {
    id: 'first_responder',
    name: 'First Responder',
    emoji: '⚡',
    description: 'First to report an issue that gets verified',
    condition: 'first_verified_report',
  },
  {
    id: 'hotspot_hunter',
    name: 'Hotspot Hunter',
    emoji: '🔥',
    description: 'Reports from 3+ different areas',
    condition: 'unique_areas >= 3',
  },
  {
    id: 'truth_teller',
    name: 'Truth Teller',
    emoji: '✅',
    description: '90%+ report accuracy',
    condition: 'accuracy >= 90',
  },
  {
    id: 'community_hero',
    name: 'Community Hero',
    emoji: '🌟',
    description: '50+ confirmations given',
    condition: 'confirmations_given >= 50',
  },
];

// Department list
export const DEPARTMENTS = [
  'Roads & Infrastructure',
  'Water Supply',
  'Electricity',
  'Sanitation',
  'Parks & Recreation',
  'Traffic Management',
  'General Administration',
] as const;

export type Department = (typeof DEPARTMENTS)[number];
