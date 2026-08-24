// ─── Standardized API Response ──────────────────────────────
// Purpose: Every API endpoint returns the SAME response shape.
// Why: Consistency. The frontend always knows what to expect:
//      { success: true/false, message: "...", data: {...} }
//      This makes frontend error handling predictable and clean.

class ApiResponse {
  constructor(statusCode, message, data = null, pagination = null) {
    this.statusCode = statusCode;
    this.success = statusCode >= 200 && statusCode < 300;
    this.message = message;
    this.data = data;
    this.pagination = pagination;
  }

  send(res) {
    const body = {
      success: this.success,
      message: this.message,
      data: this.data,
    };

    if (this.pagination) {
      body.pagination = this.pagination;
    }

    return res.status(this.statusCode).json(body);
  }
}

module.exports = ApiResponse;