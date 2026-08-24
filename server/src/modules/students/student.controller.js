// ─── Student Controller ─────────────────────────────────────
// Purpose: Handles all student HTTP requests, delegating business logic to the Service Layer.
// ────────────────────────────────────────────────────────────

const studentService = require('./student.service');
const ApiResponse = require('../../utils/apiResponse');

const getAll = async (req, res, next) => {
  try {
    const result = await studentService.getAllStudents(req.query);
    new ApiResponse(200, 'Students fetched successfully', result.data, result.pagination).send(res);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const student = await studentService.getStudentById(req.params.id);
    new ApiResponse(200, 'Student fetched successfully', student).send(res);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const student = await studentService.createStudent(req.body);
    const message = student.plainPassword
      ? `Student created successfully. Temporary password: ${student.plainPassword}`
      : 'Student created successfully.';
    new ApiResponse(201, message, student).send(res);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const updated = await studentService.updateStudent(req.params.id, req.body);
    new ApiResponse(200, 'Student updated successfully.', updated).send(res);
  } catch (error) {
    next(error);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    await studentService.deleteStudent(req.params.id);
    new ApiResponse(200, 'Student deleted successfully.').send(res);
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const stats = await studentService.getStats();
    new ApiResponse(200, 'Student stats fetched successfully', stats).send(res);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, delete: deleteStudent, getStats };
