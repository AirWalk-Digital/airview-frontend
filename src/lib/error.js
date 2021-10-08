export class AirviewApiError extends Error {
  status;
  constructor(message, status) {
    super(message);
    this.message = message;
    this.status = status;
  }
}
