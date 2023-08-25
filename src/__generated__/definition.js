// This is an auto-generated file, do not edit manually
export const definition = {
  models: {
    Attestation: { id: 'kjzl6hvfrbw6c59dxwyumreib2hrtrlwja6u9er1227ykrk9lc6bldk8076588i', accountRelation: { type: 'list' } },
    Confirm: { id: 'kjzl6hvfrbw6c6qryzy4ewol67649tx7ypbw48xolbgf70kf14vn6l5i3ly05d9', accountRelation: { type: 'list' } },
  },
  objects: {
    Attestation: {
      uid: { type: 'string', required: true },
      data: { type: 'string', required: true },
      time: { type: 'string', required: false },
      refUID: { type: 'string', required: false },
      schema: { type: 'string', required: true },
      attester: { type: 'string', required: true, indexed: true },
      recipient: { type: 'string', required: false, indexed: true },
      expirationTime: { type: 'datetime', required: false },
      revocationTime: { type: 'datetime', required: false },
      version: { type: 'view', viewType: 'documentVersion' },
      publisher: { type: 'view', viewType: 'documentAccount' },
      confirm: {
        type: 'view',
        viewType: 'relation',
        relation: { source: 'queryConnection', model: 'kjzl6hvfrbw6c6qryzy4ewol67649tx7ypbw48xolbgf70kf14vn6l5i3ly05d9', property: 'attestationId' },
      },
    },
    Confirm: {
      uid: { type: 'string', required: true },
      data: { type: 'string', required: true },
      time: { type: 'string', required: false },
      refUID: { type: 'string', required: false },
      schema: { type: 'string', required: true },
      attester: { type: 'string', required: true },
      recipient: { type: 'string', required: false },
      attestationId: { type: 'streamid', required: true },
      expirationTime: { type: 'datetime', required: false },
      revocationTime: { type: 'datetime', required: false },
      version: { type: 'view', viewType: 'documentVersion' },
      publisher: { type: 'view', viewType: 'documentAccount' },
      attestation: {
        type: 'view',
        viewType: 'relation',
        relation: { source: 'document', model: 'kjzl6hvfrbw6c59dxwyumreib2hrtrlwja6u9er1227ykrk9lc6bldk8076588i', property: 'attestationId' },
      },
    },
  },
  enums: {},
  accountData: { attestationList: { type: 'connection', name: 'Attestation' }, confirmList: { type: 'connection', name: 'Confirm' } },
}
