import {
  AvailableFile,
  ExamMetadata,
  Exam,
  ParsePDFResponse,
  GlossaryTerm,
  ExamSubmitResponse,
  Question,
  AITranslateResponse,
} from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

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

export async function submitExamAttempt(
  examId: string,
  answers: Record<string, string>,
  timeSpentSeconds: number
): Promise<ExamSubmitResponse> {
  const res = await fetch(`${API_BASE}/exams/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      exam_id: examId,
      answers,
      time_spent_seconds: timeSpentSeconds,
    }),
  });
  if (!res.ok) throw new Error("Failed to submit exam");
  return await res.json();
}

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
