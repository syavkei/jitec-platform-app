"use client";

import { create } from "zustand";
import { SupportedLang } from "@/types";

export interface I18nTranslations {
  navExams: string;
  navDrill: string;
  navGlossary: string;
  navAdmin: string;
  startSimulation: string;
  heroBadge: string;
  heroTitle: string;
  heroTitleGradient: string;
  heroDesc: string;
  btnStartCBT: string;
  btnOpenStudio: string;
  levelsHeading: string;
  levelsSubheading: string;
  viewQuestionBank: string;
  featuresHeading: string;
  timerLabel: string;
  questionPalette: string;
  answered: string;
  flagged: string;
  unanswered: string;
  submitExam: string;
  nextQuestion: string;
  prevQuestion: string;
  practiceInstant: string;
  correctAnswer: string;
  wrongAnswer: string;
  explanation: string;
  kanjiHoverHint: string;
}

export const UI_TRANSLATIONS: Record<SupportedLang, I18nTranslations> = {
  id: {
    navExams: "Bank Soal & CBT",
    navDrill: "Latihan Tematik",
    navGlossary: "Glosarium Kanji IT",
    navAdmin: "Admin Extractor Studio",
    startSimulation: "Mulai Simulasi",
    heroBadge: "Platform Latihan JITEC & IPA 過去問題 Indonesia",
    heroTitle: "Kuasai Ujian Sertifikasi IT Nasional Jepang",
    heroTitleGradient: "(情報処理技術者試験)",
    heroDesc: "Persiapkan diri Anda untuk karier IT di Jepang. Latihan soal resmi dari Level 1 (IT Passport) hingga Level 4 (Database Specialist) dengan simulasi CBT interaktif dan kamus kanji teknis bilingual.",
    btnStartCBT: "Mulai Simulasi Ujian",
    btnOpenStudio: "Buka PDF Extractor Studio",
    levelsHeading: "Hierarki Sertifikasi JITEC (Skill Level 1–4)",
    levelsSubheading: "Pilih tingkatan ujian yang sesuai dengan target kompetensi dan jalur karier profesional Anda di industri teknologi Jepang.",
    viewQuestionBank: "Lihat Bank Soal",
    featuresHeading: "Fitur Lengkap Platform Latihan",
    timerLabel: "Waktu Tersisa",
    questionPalette: "Palet Soal",
    answered: "Dijawab",
    flagged: "Ragu",
    unanswered: "Belum",
    submitExam: "Selesai & Kumpulkan",
    nextQuestion: "Selanjutnya",
    prevQuestion: "Sebelumnya",
    practiceInstant: "Latihan Santai (Instant Review)",
    correctAnswer: "Jawaban Benar!",
    wrongAnswer: "Jawaban Belum Tepat",
    explanation: "💡 Pembahasan Teknis:",
    kanjiHoverHint: "Arahkan kursor pada istilah kanji untuk melihat cara baca dan artinya",
  },
  en: {
    navExams: "Exam Bank & CBT",
    navDrill: "Topic Drills",
    navGlossary: "IT Kanji Glossary",
    navAdmin: "Admin Extractor Studio",
    startSimulation: "Start Exam",
    heroBadge: "JITEC & IPA Past Exams Preparation Platform",
    heroTitle: "Master Japan's National IT Certification Exams",
    heroTitleGradient: "(Information Technology Engineers Exam)",
    heroDesc: "Prepare for your tech career in Japan. Practice official exam papers from Level 1 (IT Passport) to Level 4 (Database Specialist) with interactive CBT simulation and multilingual IT terminology support.",
    btnStartCBT: "Start Exam Simulator",
    btnOpenStudio: "Open PDF Extractor Studio",
    levelsHeading: "JITEC Certification Hierarchy (Levels 1–4)",
    levelsSubheading: "Choose the certification level matching your professional IT career goals in the Japanese tech industry.",
    viewQuestionBank: "View Question Bank",
    featuresHeading: "Platform Key Features",
    timerLabel: "Time Left",
    questionPalette: "Question Palette",
    answered: "Answered",
    flagged: "Flagged",
    unanswered: "Unanswered",
    submitExam: "Submit & Finish",
    nextQuestion: "Next",
    prevQuestion: "Previous",
    practiceInstant: "Practice Mode (Instant Review)",
    correctAnswer: "Correct Answer!",
    wrongAnswer: "Incorrect Answer",
    explanation: "💡 Technical Explanation:",
    kanjiHoverHint: "Hover over technical Kanji terms to view readings and definitions",
  },
  ja: {
    navExams: "過去問題・CBT模試",
    navDrill: "分野別演習",
    navGlossary: "IT用語・漢字辞典",
    navAdmin: "PDF抽出スタジオ",
    startSimulation: "試験開始",
    heroBadge: "情報処理技術者試験 対策プラットフォーム",
    heroTitle: "日本の国家資格・情報処理技術者試験を完全攻略",
    heroTitleGradient: "（JITEC / IPA 過去問題）",
    heroDesc: "日本でのITエンジニア就職・キャリアアップを支援。ITパスポートからデータベーススペシャリストまで、CBTシミュレーションと多言語解説で学習できます。",
    btnStartCBT: "CBT模擬試験を開始",
    btnOpenStudio: "PDF抽出スタジオを開く",
    levelsHeading: "情報処理技術者試験のスキル体系（レベル1〜4）",
    levelsSubheading: "エンジニアとしてのスキルアップや日本就労目標に合わせた資格区分を選択してください。",
    viewQuestionBank: "問題一覧を見る",
    featuresHeading: "学習プラットフォームの主な機能",
    timerLabel: "残り時間",
    questionPalette: "問題パレット",
    answered: "回答済",
    flagged: "見直し",
    unanswered: "未回答",
    submitExam: "試験終了・採点",
    nextQuestion: "次の問題",
    prevQuestion: "前の問題",
    practiceInstant: "解説モード（即時判定）",
    correctAnswer: "正解です！",
    wrongAnswer: "不正解です",
    explanation: "💡 技術解説・採点講評:",
    kanjiHoverHint: "漢字の上にマウスを置くと読み仮名と意味が表示されます",
  },
  vi: {
    navExams: "Ngân Hàng Đề & CBT",
    navDrill: "Luyện Theo Chủ Đề",
    navGlossary: "Từ Điển Kanji IT",
    navAdmin: "Admin Trích Xuất PDF",
    startSimulation: "Bắt Đầu Thi",
    heroBadge: "Nền Tảng Luyện Thi JITEC / FE / AP Nhật Bản",
    heroTitle: "Chinh Phục Kỳ Thi Kỹ Sư CNTT Quốc Gia Nhật Bản",
    heroTitleGradient: "(Kỳ Thi Kỹ Sư Xử Lý Thông Tin)",
    heroDesc: "Chuẩn bị cho sự nghiệp CNTT tại Nhật Bản. Luyện đề thi chính thức từ Level 1 (IT Passport) đến Level 4 (Database Specialist) với mô phỏng CBT và từ điển Kanji kỹ thuật đa ngôn ngữ.",
    btnStartCBT: "Bắt Đầu Thi Thử CBT",
    btnOpenStudio: "Mở PDF Extractor Studio",
    levelsHeading: "Hệ Thống Chứng Chỉ JITEC (Cấp Độ 1–4)",
    levelsSubheading: "Chọn cấp độ chứng chỉ phù hợp với định hướng nghề nghiệp kỹ sư phần mềm tại Nhật Bản.",
    viewQuestionBank: "Xem Danh Sách Đề Thi",
    featuresHeading: "Tính Năng Nổi Bật",
    timerLabel: "Thời Gian Còn Lại",
    questionPalette: "Bảng Câu Hỏi",
    answered: "Đã Trả Lời",
    flagged: "Đánh Dấu",
    unanswered: "Chưa Trả Lời",
    submitExam: "Nộp Bài & Kết Thúc",
    nextQuestion: "Câu Tiếp Theo",
    prevQuestion: "Câu Trước Đó",
    practiceInstant: "Chế Độ Luyện Tập (Xem Giải Thích)",
    correctAnswer: "Đáp Án Chính Xác!",
    wrongAnswer: "Đáp Án Chưa Đúng",
    explanation: "💡 Giải Thích Chi Tiết:",
    kanjiHoverHint: "Rê chuột vào từ Kanji IT để xem phiên âm Furigana và ý nghĩa",
  },
};

export const translations = UI_TRANSLATIONS;

interface I18nState {
  lang: SupportedLang;
  setLang: (lang: SupportedLang) => void;
}

export const useI18nStore = create<I18nState>((set) => ({
  lang: "id",
  setLang: (lang) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("jitec_lang", lang);
    }
    set({ lang });
  },
}));
