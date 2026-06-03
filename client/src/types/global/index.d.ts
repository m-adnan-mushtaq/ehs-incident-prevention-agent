declare type GenericObject = Record<string, any>;

declare type IButtonVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "link"
  | "ghost"
  | null
  | undefined;

declare type IFormLabel = {
  label: string;
  value: string | number;
};

declare type IStrFormLabel<T> = {
  value: string | number;
  label: string;
  original: T;
};
