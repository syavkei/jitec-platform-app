import {
  AvailableFile,
  ExamMetadata,
  Exam,
  ParsePDFResponse,
  GlossaryTerm,
  ExamSubmitResponse,
  Question,
  AITranslateResponse,
  AppSettings,
  SystemStats,
  AuthResponse,
  UserAttemptHistory,
} from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// --- AUTH APIS ---

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Login gagal. Periksa kembali email dan password Anda.");
  }
  return await res.json();
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  country = "Indonesia",
  targetExam = "FE"
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/user/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, country, target_exam: targetExam }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Registrasi gagal. Silakan coba lagi.");
  }
  return await res.json();
}

export async function loginAdmin(username: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Kredensial admin tidak valid. Akses ditolak.");
  }
  return await res.json();
}

export async function fetchUserHistory(userId: string): Promise<UserAttemptHistory[]> {
  try {
    const res = await fetch(`${API_BASE}/auth/user/${userId}/history`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// --- Extractor & Ingestion ---

export async function fetchAvailableFiles(): Promise<AvailableFile[]> {
  try {
    const res = await fetch(`${API_BASE}/extractor/files`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch available kakomon files");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function parsePdf(
  qsPath: string,
  ansPath?: string,
  cmntPath?: string
): Promise<ParsePDFResponse> {
  const res = await fetch(`${API_BASE}/extractor/parse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      qs_file_path: qsPath,
      ans_file_path: ansPath || null,
      cmnt_file_path: cmntPath || null,
    }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to parse PDF");
  }
  return await res.json();
}

export async function aiTranslateQuestion(
  question: Question,
  targetLanguages: string[] = ["en", "id", "vi"]
): Promise<AITranslateResponse> {
  const res = await fetch(`${API_BASE}/extractor/ai-translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      target_languages: targetLanguages,
    }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "AI translation failed");
  }
  return await res.json();
}

export async function batchAiTranslateExam(
  exam: Exam,
  targetLanguages: string[] = ["en", "id", "vi"]
): Promise<Exam> {
  const res = await fetch(`${API_BASE}/extractor/batch-ai-translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      exam,
      target_languages: targetLanguages,
    }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Batch AI translation failed");
  }
  return await res.json();
}

export async function publishExam(exam: Exam): Promise<{ status: string; message: string }> {
  const res = await fetch(`${API_BASE}/extractor/publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(exam),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to publish exam");
  }
  return await res.json();
}

// --- Exams CRUD ---

export async function fetchExams(): Promise<ExamMetadata[]> {
  try {
    const res = await fetch(`${API_BASE}/exams`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch exams");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function fetchExamById(id: string): Promise<Exam | null> {
  try {
    const res = await fetch(`${API_BASE}/exams/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function createExam(exam: Exam): Promise<Exam> {
  const res = await fetch(`${API_BASE}/exams`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(exam),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to create exam");
  }
  return await res.json();
}

export async function updateExam(examId: string, exam: Exam): Promise<Exam> {
  const res = await fetch(`${API_BASE}/exams/${examId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(exam),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to update exam");
  }
  return await res.json();
}

export async function deleteExam(examId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/exams/${examId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to delete exam");
  }
}

export async function saveQuestionToExam(examId: string, question: Question): Promise<Exam> {
  const res = await fetch(`${API_BASE}/exams/${examId}/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(question),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to save question");
  }
  return await res.json();
}

export async function deleteQuestionFromExam(examId: string, questionId: string): Promise<Exam> {
  const res = await fetch(`${API_BASE}/exams/${examId}/questions/${questionId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to delete question");
  }
  return await res.json();
}

export async function submitExamAttempt(
  examId: string,
  answers: Record<string, string>,
  timeSpentSeconds: number,
  userId?: string
): Promise<ExamSubmitResponse> {
  const res = await fetch(`${API_BASE}/exams/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      exam_id: examId,
      answers,
      time_spent_seconds: timeSpentSeconds,
      user_id: userId || null,
    }),
  });
  if (!res.ok) throw new Error("Failed to submit exam");
  return await res.json();
}

// --- Glossary CRUD ---

export async function fetchGlossary(category?: string): Promise<GlossaryTerm[]> {
  try {
    const url = category
      ? `${API_BASE}/glossary?category=${encodeURIComponent(category)}`
      : `${API_BASE}/glossary`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch glossary");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function createGlossaryTerm(term: GlossaryTerm): Promise<GlossaryTerm> {
  const res = await fetch(`${API_BASE}/glossary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(term),
  });
  if (!res.ok) throw new Error("Failed to create glossary term");
  return await res.json();
}

export async function updateGlossaryTerm(termId: string, term: GlossaryTerm): Promise<GlossaryTerm> {
  const res = await fetch(`${API_BASE}/glossary/${termId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(term),
  });
  if (!res.ok) throw new Error("Failed to update glossary term");
  return await res.json();
}

export async function deleteGlossaryTerm(termId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/glossary/${termId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete glossary term");
}

export async function searchGlossary(q: string): Promise<GlossaryTerm[]> {
  try {
    const res = await fetch(`${API_BASE}/glossary/search?q=${encodeURIComponent(q)}`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// --- Settings & Stats ---

export async function fetchAppSettings(): Promise<AppSettings> {
  const res = await fetch(`${API_BASE}/settings`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch app settings");
  return await res.json();
}

export async function updateAppSettings(settings: AppSettings): Promise<AppSettings> {
  const res = await fetch(`${API_BASE}/settings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error("Failed to update app settings");
  return await res.json();
}

export async function fetchSystemStats(): Promise<SystemStats> {
  const res = await fetch(`${API_BASE}/settings/stats`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch system stats");
  return await res.json();
}
