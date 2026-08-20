export type SupportedLang = "ja" | "en" | "id" | "vi";

export interface Option {
  key: string; // "ア", "イ", "ウ", "エ"
  text_ja: string;
  text_en?: string | null;
  text_id?: string | null;
  text_vi?: string | null;
}

export interface Question {
  id: string;
  question_number: number;
  context_text_ja?: string | null;
  context_text_en?: string | null;
  context_text_id?: string | null;
  context_text_vi?: string | null;
  question_text_ja: string;
  question_text_en?: string | null;
  question_text_id?: string | null;
  question_text_vi?: string | null;
  diagram_urls?: string[];
  options: Option[];
  correct_answer?: string | null;
  category?: string | null;
  field_code?: string | null;
  explanation_ja?: string | null;
  explanation_en?: string | null;
  explanation_id?: string | null;
  explanation_vi?: string | null;
  examiner_commentary?: string | null;
  source_page?: number | null;
}

export interface ExamMetadata {
  id: string;
  title: string;
  level: "level1" | "level2" | "level3" | "level4";
  level_name: string;
  exam_code: "IP" | "FE" | "SG" | "AP" | "DB" | "KOUDO";
  year: number;
  session: string;
  section: string;
  total_questions: number;
  duration_minutes: number;
  passing_score: number;
}

export interface Exam extends ExamMetadata {
  questions: Question[];
}

export interface AvailableFile {
  id: string;
  level: string;
  filename: string;
  relative_path: string;
  file_type: string;
  year: number;
  code: string;
  section: string;
  matched_ans_file?: string | null;
  matched_cmnt_file?: string | null;
}

export interface ParsePDFResponse {
  success: boolean;
  exam: Exam;
  message: string;
  warnings: string[];
}

export interface AITranslateResponse {
  success: boolean;
  question: Question;
  message: string;
}

export interface GlossaryTerm {
  id: string;
  term_ja: string;
  reading_furigana: string;
  romaji: string;
  term_en: string;
  term_id: string;
  term_vi?: string | null;
  category: string;
  definition_ja: string;
  definition_en?: string | null;
  definition_id: string;
  definition_vi?: string | null;
  example_sentence_ja?: string | null;
  example_sentence_en?: string | null;
  example_sentence_id?: string | null;
  example_sentence_vi?: string | null;
}

export interface AppSettings {
  app_name: string;
  gemini_api_key?: string | null;
  openai_api_key?: string | null;
  ai_translation_provider: string;
  default_languages: string[];
  default_passing_score: number;
  default_fe_duration_minutes: number;
  default_ap_duration_minutes: number;
  enable_public_registration: boolean;
  enable_furigana_tooltips: boolean;
}

export interface SystemStats {
  total_exams: number;
  total_questions: number;
  total_glossary_terms: number;
  total_diagrams: number;
  tesseract_ocr_available: boolean;
  tesseract_languages: string[];
  storage_size_kb: number;
  system_version: string;
}

// --- AUTH TYPES ---

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  country?: string | null;
  target_exam?: string | null;
  created_at?: string | null;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message: string;
}

export interface UserAttemptHistory {
  id: string;
  user_id: string;
  exam_id: string;
  exam_title: string;
  scaled_score: number;
  score_percentage: number;
  is_passed: boolean;
  correct_count: number;
  total_questions: number;
  time_spent_seconds: number;
  completed_at: string;
}

export interface QuestionResult {
  question_number: number;
  selected_answer?: string | null;
  correct_answer: string;
  is_correct: boolean;
  explanation_id?: string | null;
  explanation_en?: string | null;
}

export interface ExamSubmitResponse {
  exam_id: string;
  total_questions: number;
  correct_count: number;
  incorrect_count: number;
  unanswered_count: number;
  score_percentage: number;
  scaled_score: number;
  is_passed: boolean;
  time_spent_seconds: number;
  results: QuestionResult[];
}
