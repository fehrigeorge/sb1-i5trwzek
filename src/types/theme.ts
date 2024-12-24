export interface Theme {
  id: string;
  name: string;
  colors: {
    bg: string;
    'bg-secondary': string;
    'bg-hover': string;
    text: string;
    'text-secondary': string;
    border: string;
    primary: string;
    'primary-hover': string;
  };
}