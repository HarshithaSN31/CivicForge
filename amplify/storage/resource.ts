import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'civicforgeEvidenceBucket',
  access: (allow) => ({
    'evidence/{entity_id}/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
      allow.guest.to(['read']),
    ],
  }),
});
