<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ModuleController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\QuizController;
use App\Http\Controllers\Api\QuizQuestionController;
use App\Http\Controllers\Api\SimulationTransactionController;
use App\Http\Controllers\Api\FaqController;

// Modules
Route::get('/modules',        [ModuleController::class, 'index']);
Route::post('/modules',       [ModuleController::class, 'store']);
Route::put('/modules/{id}',   [ModuleController::class, 'update']);
Route::delete('/modules/{id}',[ModuleController::class, 'destroy']);

// Users
Route::get('/users',        [UserController::class, 'index']);
Route::post('/users',       [UserController::class, 'store']);
Route::put('/users/{id}',   [UserController::class, 'update']);
Route::delete('/users/{id}',[UserController::class, 'destroy']);
Route::post('/login',       [UserController::class, 'login']);
Route::post('/register',    [UserController::class, 'register']);
Route::post('/change-password', [UserController::class, 'changePassword']);
Route::post('/change-profile', [UserController::class, 'changeProfile']);

// FAQs
Route::get('/faqs',         [FaqController::class, 'index']);
Route::post('/faqs',        [FaqController::class, 'store']);
Route::put('/faqs/{id}',    [FaqController::class, 'update']);
Route::delete('/faqs/{id}', [FaqController::class, 'destroy']);

// Quizzes
Route::get('/quizzes',          [QuizController::class, 'index']);
Route::get('/quizzes/{id}',     [QuizController::class, 'show']);
Route::post('/quizzes',         [QuizController::class, 'store']);
Route::put('/quizzes/{id}',     [QuizController::class, 'update']);
Route::delete('/quizzes/{id}',  [QuizController::class, 'destroy']);

// Quiz Questions (nested)
Route::get('/quizzes/{quizId}/questions',                  [QuizQuestionController::class, 'index']);
Route::post('/quizzes/{quizId}/questions',                 [QuizQuestionController::class, 'store']);
Route::put('/quizzes/{quizId}/questions/{questionId}',     [QuizQuestionController::class, 'update']);
Route::delete('/quizzes/{quizId}/questions/{questionId}',  [QuizQuestionController::class, 'destroy']);

// Simulation Transactions
Route::get('/simulation-transactions',        [SimulationTransactionController::class, 'index']);
Route::post('/simulation-transactions',       [SimulationTransactionController::class, 'store']);
Route::put('/simulation-transactions/{id}',   [SimulationTransactionController::class, 'update']);
Route::delete('/simulation-transactions/{id}',[SimulationTransactionController::class, 'destroy']);