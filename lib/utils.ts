import { IUser } from "@/models/User";
import bcrypt from "bcryptjs";
import { clsx, type ClassValue } from "clsx";
import jwt from "jsonwebtoken";
import { twMerge } from "tailwind-merge";

const JWT_SECRET = process.env.JWT_SECRET as string; // Defina no .env
const JWT_EXPIRES_IN = "1d"; // 1 dia de validade

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Gera um token JWT para um usuário.
 * @param user - O usuário para o qual gerar o token.
 * @returns O token JWT gerado. 
 */
export const generateToken = (user: IUser): string => {
  return jwt.sign({ user: user }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Formata uma data no padrão brasileiro (dd/MM/yyyy).
 * @param date - A data no formato de string ou objeto Date.
 * @returns A data formatada no padrão brasileiro.
 */
export function formatDate(date: string | Date): string {
  const parsedDate = new Date(date)
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsedDate)
}

/**
 * Formata uma hora no padrão brasileiro (HH:mm).
 * @param date - A data no formato de string ou objeto Date.
 * @returns A hora formatada no padrão brasileiro.
 */
export function formatTime(date: string | Date): string {
  const parsedDate = new Date(date)
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Usar formato 24 horas
  }).format(parsedDate)
}

/**
 * Formata data e hora no padrão brasileiro (dd/MM/yyyy HH:mm).
 * @param date - A data no formato de string ou objeto Date.
 * @returns A data e hora formatadas no padrão brasileiro.
 */
export function formatDateTime(date: string | Date): string {
  const parsedDate = new Date(date)
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Usar formato 24 horas
  }).format(parsedDate)
}

/**
 * Formata uma data no padrão brasileiro com o nome do mês (dd de MMMM de yyyy).
 * @param date - A data no formato de string ou objeto Date.
 * @returns A data formatada com o nome do mês.
 */
export function formatDateWithMonthName(date: string | Date): string {
  const parsedDate = new Date(date)
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long", // Nome completo do mês
    year: "numeric",
  }).format(parsedDate)
}

/**
 * Formata uma data no padrão ISO (yyyy-MM-dd).
 * @param date - A data no formato de string ou objeto Date.
 * @returns A data formatada no padrão ISO.
 */
export function formatDateISO(date: string | Date): string {
  const parsedDate = new Date(date)
  return parsedDate.toISOString().split("T")[0]
}

/**
 * Formata uma data no padrão brasileiro com hora e minutos (dd/MM/yyyy HH:mm:ss).
 * @param date - A data no formato de string ou objeto Date.
 * @returns A data e hora formatadas com segundos.
 */
export function formatDateTimeWithSeconds(date: string | Date): string {
  const parsedDate = new Date(date)
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Usar formato 24 horas
  }).format(parsedDate)
}

/**
 * Retorna a diferença de dias entre duas datas.
 * @param startDate - A data inicial no formato de string ou objeto Date.
 * @param endDate - A data final no formato de string ou objeto Date.
 * @returns A diferença de dias entre as duas datas.
 */
export function getDaysDifference(startDate: string | Date, endDate: string | Date): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const timeDifference = end.getTime() - start.getTime()
  return Math.floor(timeDifference / (1000 * 60 * 60 * 24)) // Converte milissegundos em dias
}

/**
 * Adiciona dias a uma data.
 * @param date - A data no formato de string ou objeto Date.
 * @param days - O número de dias a adicionar.
 * @returns A nova data com os dias adicionados.
 */
export function addDays(date: string | Date, days: number): Date {
  const parsedDate = new Date(date)
  parsedDate.setDate(parsedDate.getDate() + days)
  return parsedDate
}

/**
 * Verifica se duas datas são iguais (ignorando horas, minutos e segundos).
 * @param date1 - A primeira data no formato de string ou objeto Date.
 * @param date2 - A segunda data no formato de string ou objeto Date.
 * @returns `true` se as datas forem iguais, `false` caso contrário.
 */
export function isSameDate(date1: string | Date, date2: string | Date): boolean {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

/**
 * Criptografa uma senha usando bcrypt.
 * @param password - A senha a ser criptografada.
 * @returns A senha criptografada.
 */
export async function encryptPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  const encryptPassword = await bcrypt.hash(password, salt);
  return encryptPassword;
}