export interface Password {
    userId: string;
    hash: string;
    salt: string;
  enabled: boolean;
createdAt: Date;
}