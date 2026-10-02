export interface Telephone {
  id: number;
  namaUser: string;
  alamat: string;
  noTelp: string;
  kodePost: string;
  dateTime: string | null;
}

export type TelephoneRequest = Omit<Telephone, 'id'>;
