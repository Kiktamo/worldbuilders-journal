export interface Comment {
    _id?: string;
    entryId: string;
    characterId: string;
    characterName?: string;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
  }