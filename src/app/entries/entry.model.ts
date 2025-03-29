export interface Entry {
    _id?: string;
    title: string;
    content: string;
    category: string;
    imageUrl: string;
    createdAt?: Date;
    updatedAt?: Date;
  }