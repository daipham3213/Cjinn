export class SIGNAL_CONST {
  static registrationId: string = 'registrationId'
  static curve: string = '25519'
  static preKey: string = this.curve + 'preKey'
  static signedKey: string = this.curve + 'signedPreKey'
  static identityKey: string = 'identityKey'
  static identifyKey_me: string = 'identityKey:me'
  static session: string = 'session'
}

export class MESSAGE_CONST {
  static thread: string = 'thread'
  static message: string = 'message'
}
