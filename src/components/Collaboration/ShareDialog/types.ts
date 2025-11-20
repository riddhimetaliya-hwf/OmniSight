
export interface SharedUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'viewer' | 'editor' | 'admin';
}

export type AccessLevel = 'private' | 'team' | 'organization' | 'public';

export interface ShareDialogProps {
  title: string;
  type: 'dashboard' | 'report' | 'insight';
  id: string;
  onShare: (users: SharedUser[], accessLevel: AccessLevel) => void;
  sharedWith?: SharedUser[];
  currentAccessLevel?: AccessLevel;
  uniqueLink?: string;
}
