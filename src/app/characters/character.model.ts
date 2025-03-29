export interface Character {
    _id?: string;
    name: string;
    description: string;
    traits: string[];
    imageUrl: string;
    createdAt?: Date;
    updatedAt?: Date;
  }