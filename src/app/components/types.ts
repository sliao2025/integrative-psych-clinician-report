// app/report/components/types.ts
export type Patient = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  profile: unknown;
};

export type ProfileJson = Record<string, any>; // keep loose to match evolving intake JSON

export type ModalState = {
  title: React.ReactNode;
  content: React.ReactNode;
  maxWidth?: string;
} | null;

export type Option = { label: string; value: string };
