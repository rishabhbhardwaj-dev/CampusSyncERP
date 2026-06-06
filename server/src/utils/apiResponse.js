// ─── Standardized API Response ──────────────────────────────
// Purpose: Every API endpoint returns the SAME response shape.
// Why: Consistency. The frontend always knows what to expect:
//      { success: true/false, message: "...", data: {...} }
//      This makes frontend error handling predictable and clean.

class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.statusCode = statusCode;
    this.success = statusCode >= 200 && statusCode < 300;
    this.message = message;
    this.data = data;
  }

  send(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data,
    });
  }
}

module.exports = ApiResponse;
