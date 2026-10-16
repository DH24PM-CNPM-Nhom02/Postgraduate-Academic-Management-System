/**
 * lib/schemas — Zod validation schemas
 *
 * Tách riêng schema theo từng phân hệ:
 * - student.ts: Nghiên cứu sinh (Student Dossier & Excel/CSV import)
 * - supervisor.ts: Giảng viên hướng dẫn (Supervisor Quota & Excel/CSV import)
 */

export * from "./student";
export * from "./supervisor";
