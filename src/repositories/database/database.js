const { DatabaseBucket } = require('./bucket');
const { DatabaseCollection } = require('./collection');

module.exports.Database = class Database {
  constructor(logger) {
    this.logger = logger;
    this._buckets = new Map();
    this._collections = new Map();
  }
  createBucket(name) {
    if (this._buckets.has(name)) {
      throw new Error(`Bucket [${name}] already exists`);
    }
    const bucket = new DatabaseBucket(name, this.logger.getLogger(name), this);
    this._buckets.set(name, bucket);
    return bucket;
  }
  getBucket(name) {
    if (!this._buckets.has(name)) {
      throw new Error(`Bucket [${name}] is not created`);
    }
    return this._buckets.get(name);
  }
  createCollection(name, model) {
    if (this._collections.has(name)) {
      throw new Error(`Collection [${name}] already exists`);
    }
    const bucket = !this._buckets.has(name)
      ? this.createBucket(name)
      : this.getBucket(name);

    this.logger.debug(`Creating collection [${name}]`);
    try {
      const collection = new DatabaseCollection(
        name,
        this.logger.getLogger(name),
        bucket,
        model
      );
      this._collections.set(name, collection);
      this.logger.debug(`Collection added [${name}]`);

      return collection;
    } catch (error) {
      this.logger.error(`Error adding collection [${name}]: ${error.message}`);
    }
  }
  getCollection(name) {
    if (!this._collections.has(name)) {
      throw new Error(`Collection [${name}] is not created`);
    }
    return this._collections.get(name);
  }
  async connect() {
    try {
      this.logger.info('Connecting database');

      const firebase = require('firebase-admin');
      const firebaseConfig = {
        type: 'service_account',
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://accounts.google.com/o/oauth2/token',
        auth_provider_x509_cert_url:
          'https://www.googleapis.com/oauth2/v1/certs'
      };
      firebase.initializeApp({
        credential: firebase.credential.cert(firebaseConfig),
        databaseURL: process.env.FIREBASE_DB_URL,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
      });
      this.db = firebase.database().ref();

      this.logger.info('Connected database');
    } catch (error) {
      this.logger.error(error.message);
    }
  }
};
