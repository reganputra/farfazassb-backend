# Manajemen SSB API

Backend API for a Sports School Management System (SSB - Sekolah Sepak Bola) that provides comprehensive functionality for managing students, coaches, grades, achievements, and more.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Admin Routes](#admin-routes)
  - [User Routes](#user-routes)
  - [Public Routes](#public-routes)
- [File Upload](#file-upload)
- [Authorization Roles](#authorization-roles)
- [Contributors](#contributors)

## Overview

This API serves as the backend for a Sports School Management System, providing endpoints for managing students, coaches, staff, grades, achievements, attendance, and user management. It includes role-based access control, file uploads to AWS S3, and comprehensive data validation.

## Features

- User authentication and authorization with JWT
- Role-based access control (Super Admin, Coach, User, Guest)
- Student management with file uploads (photos, documents)
- Coach and staff management
- Student grading system
- Achievement tracking
- Attendance management
- Test management
- Parent-child relationship management
- File uploads to AWS S3

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Prisma** - ORM for database access
- **PostgreSQL** - Database
- **JWT** - Authentication
- **AWS S3** - File storage
- **Joi** - Data validation
- **Bcrypt** - Password hashing
- **Multer** - File upload handling

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd manajemen_ssb
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the required variables (see [Environment Variables](#environment-variables) section).

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/manajemen_ssb"
DIRECT_URL="postgresql://username:password@localhost:5432/manajemen_ssb"

# Authentication
JWT_SECRET="your-secret-key"
PORT=5000

# AWS S3
AWS_BUCKET_NAME="your-bucket-name"
AWS_BUCKET_REGION="your-bucket-region"
AWS_ACCESS_KEY_ID="your-access-key-id"
AWS_SECRET_ACCESS_KEY="your-secret-access-key"
```

## Database Schema

The database schema includes the following models:

- **User** - System users (admins, coaches, parents)
- **Student** - Student information and relationships
- **Staff** - Staff information
- **Coach** - Coach information
- **Achievement** - Student achievements
- **Grade** - Student grades and assessments
- **Test** - Test information
- **Attendance** - Student attendance records

For detailed schema information, refer to the `prisma/schema.prisma` file.

## API Documentation

### Authentication

- **POST /api/auth/login** - Login and get JWT token
  - Request Body:
    ```json
    {
      "email": "user@example.com",
      "password": "securepassword"
    }
    ```
  - Response (200 OK):
    ```json
    {
      "message": "Login berhasil",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "user@example.com",
        "role": "USER"
      }
    }
    ```

- **POST /api/auth/dev-create-coach** - Create a coach account (Admin only)
  - Headers: `Authorization: Bearer <token>`
  - Request Body:
    ```json
    {
      "email": "coach@example.com",
      "password": "securepassword"
    }
    ```
  - Response (201 Created):
    ```json
    {
      "message": "Coach account created",
      "admin": {
        "id": 2,
        "email": "coach@example.com",
        "role": "COACH"
      }
    }
    ```

### Admin Routes

All admin routes require authentication and appropriate role (SUPER_ADMIN or COACH).

#### Student Management

- **GET /api/admin/students** - Get all students
  - Response (200 OK):
    ```json
    [
      {
        "id": 1,
        "name": "Student Name",
        "photoUrl": "https://s3-bucket-url/photo.jpg",
        "kk": "https://s3-bucket-url/kk.jpg",
        "koperasi": "https://s3-bucket-url/koperasi.jpg",
        "akta": "https://s3-bucket-url/akta.jpg",
        "bpjs": "https://s3-bucket-url/bpjs.jpg",
        "age": 12,
        "gender": "L",
        "kategoriBMI": "NORMAL",
        "level": "Intermediate",
        "tanggalLahir": "2012-05-15T00:00:00.000Z",
        "tempatLahir": "Jakarta",
        "coachId": 1,
        "parentId": 2,
        "grades": [],
        "attendance": [],
        "parent": {
          "id": 2,
          "email": "parent@example.com"
        },
        "coach": {
          "id": 1,
          "email": "coach@example.com"
        }
      }
    ]
    ```

- **GET /api/admin/students/coach/:coachId** - Get all students by coach
  - Response (200 OK):
    ```json
    [
      {
        "id": 1,
        "name": "Student Name",
        "photoUrl": "https://s3-bucket-url/photo.jpg",
        "age": 12,
        "gender": "L",
        "kategoriBMI": "NORMAL",
        "level": "Intermediate",
        "tanggalLahir": "2012-05-15T00:00:00.000Z",
        "tempatLahir": "Jakarta",
        "coachId": 1,
        "parentId": 2
      }
    ]
    ```

- **GET /api/admin/students/:id** - Get student by ID
  - Response (200 OK):
    ```json
    {
      "id": 1,
      "name": "Student Name",
      "photoUrl": "https://s3-bucket-url/photo.jpg",
      "kk": "https://s3-bucket-url/kk.jpg",
      "koperasi": "https://s3-bucket-url/koperasi.jpg",
      "akta": "https://s3-bucket-url/akta.jpg",
      "bpjs": "https://s3-bucket-url/bpjs.jpg",
      "age": 12,
      "gender": "L",
      "kategoriBMI": "NORMAL",
      "level": "Intermediate",
      "tanggalLahir": "2012-05-15T00:00:00.000Z",
      "tempatLahir": "Jakarta",
      "coachId": 1,
      "parentId": 2,
      "grades": [],
      "attendance": [],
      "parent": {
        "id": 2,
        "email": "parent@example.com"
      },
      "coach": {
        "id": 1,
        "email": "coach@example.com"
      }
    }
    ```

- **POST /api/admin/students** - Create a new student (with file uploads)
  - Request Body (multipart/form-data):
    ```
    name: "Student Name"
    parentId: 2
    coachId: 1
    age: 12
    gender: "L"
    level: "Intermediate"
    tanggalLahir: "2012-05-15"
    tempatLahir: "Jakarta"
    kategoriBMI: "NORMAL"
    photo: [file upload]
    kk: [file upload]
    koperasi: [file upload]
    akta: [file upload]
    bpjs: [file upload]
    ```
  - Response (201 Created):
    ```json
    {
      "id": 1,
      "name": "Student Name",
      "photoUrl": "https://s3-bucket-url/photo.jpg",
      "kk": "https://s3-bucket-url/kk.jpg",
      "koperasi": "https://s3-bucket-url/koperasi.jpg",
      "akta": "https://s3-bucket-url/akta.jpg",
      "bpjs": "https://s3-bucket-url/bpjs.jpg",
      "age": 12,
      "gender": "L",
      "kategoriBMI": "NORMAL",
      "level": "Intermediate",
      "tanggalLahir": "2012-05-15T00:00:00.000Z",
      "tempatLahir": "Jakarta",
      "coachId": 1,
      "parentId": 2,
      "parent": {
        "id": 2,
        "email": "parent@example.com"
      },
      "coach": {
        "id": 1,
        "email": "coach@example.com"
      }
    }
    ```

- **PUT /api/admin/students/:id** - Update a student
  - Request Body (multipart/form-data):
    ```
    name: "Updated Student Name"
    parentId: 3
    coachId: 2
    age: 13
    gender: "L"
    level: "Advanced"
    tanggalLahir: "2012-05-15"
    tempatLahir: "Jakarta"
    kategoriBMI: "NORMAL"
    photo: [file upload]
    kk: [file upload]
    koperasi: [file upload]
    akta: [file upload]
    bpjs: [file upload]
    ```
  - Response (200 OK):
    ```json
    {
      "id": 1,
      "name": "Updated Student Name",
      "photoUrl": "https://s3-bucket-url/new-photo.jpg",
      "kk": "https://s3-bucket-url/new-kk.jpg",
      "koperasi": "https://s3-bucket-url/new-koperasi.jpg",
      "akta": "https://s3-bucket-url/new-akta.jpg",
      "bpjs": "https://s3-bucket-url/new-bpjs.jpg",
      "age": 13,
      "gender": "L",
      "kategoriBMI": "NORMAL",
      "level": "Advanced",
      "tanggalLahir": "2012-05-15T00:00:00.000Z",
      "tempatLahir": "Jakarta",
      "coachId": 2,
      "parentId": 3,
      "parent": {
        "id": 3,
        "email": "new-parent@example.com"
      },
      "coach": {
        "id": 2,
        "email": "new-coach@example.com"
      }
    }
    ```

- **DELETE /api/admin/students/:id** - Delete a student
  - Response (200 OK):
    ```json
    {
      "message": "Siswa berhasil dihapus"
    }
    ```
 
#### Coach Management

- **GET /api/admin/coaches** - Get all coaches
  - Response (200 OK):
    ```json
    [
      {
        "id": 1,
        "name": "Coach Name",
        "email": "coach@example.com",
        "telp": "081234567890",
        "gender": "L",
        "photoUrl": "https://s3-bucket-url/coach-photo.jpg"
      },
      {
        "id": 2,
        "name": "Another Coach",
        "email": "coach2@example.com",
        "telp": "081234567891",
        "gender": "P",
        "photoUrl": "https://s3-bucket-url/coach2-photo.jpg"
      }
    ]
    ```

- **GET /api/admin/coaches/:id** - Get coach by ID
  - Response (200 OK):
    ```json
    {
      "id": 1,
      "name": "Coach Name",
      "email": "coach@example.com",
      "telp": "081234567890",
      "gender": "L",
      "photoUrl": "https://s3-bucket-url/coach-photo.jpg",
      "role": "COACH",
      "password": "[hashed password]",
      "createAt": "2023-06-10T07:00:00.000Z"
    }
    ```

- **POST /api/admin/coaches** - Create a new coach (with photo upload)
  - Request Body (multipart/form-data):
    ```
    name: "New Coach"
    email: "newcoach@example.com"
    telp: "081234567892"
    gender: "L"
    password: "securepassword"
    photo: [file upload]
    ```
  - Response (201 Created):
    ```json
    {
      "id": 3,
      "name": "New Coach",
      "email": "newcoach@example.com",
      "telp": "081234567892",
      "gender": "L",
      "photoUrl": "https://s3-bucket-url/new-coach-photo.jpg",
      "role": "COACH",
      "password": "[hashed password]",
      "createAt": "2023-06-15T08:30:00.000Z"
    }
    ```

- **PUT /api/admin/coaches/:id** - Update a coach
  - Request Body (multipart/form-data):
    ```
    name: "Updated Coach Name"
    email: "updatedcoach@example.com"
    telp: "081234567893"
    gender: "L"
    password: "newsecurepassword"
    photo: [file upload]
    ```
  - Response (200 OK):
    ```json
    {
      "id": 1,
      "name": "Updated Coach Name",
      "email": "updatedcoach@example.com",
      "telp": "081234567893",
      "gender": "L",
      "photoUrl": "https://s3-bucket-url/updated-coach-photo.jpg",
      "role": "COACH",
      "password": "[hashed password]",
      "createAt": "2023-06-10T07:00:00.000Z"
    }
    ```

- **DELETE /api/admin/coaches/:id** - Delete a coach
  - Response (200 OK):
    ```json
    {
      "message": "Pelatih berhasil dihapus"
    }
    ```

#### Achievement Management

- **GET /api/admin/achievements** - Get all achievements
  - Response (200 OK):
    ```json
    [
      {
        "id": 1,
        "title": "Juara 1 Turnamen Regional",
        "studentId": 1,
        "date": "2023-05-20T00:00:00.000Z",
        "desc": "Memenangkan turnamen regional tingkat provinsi",
        "level": "Regional",
        "place": 1,
        "event": "Turnamen Sepak Bola U-12 Provinsi",
        "student": {
          "id": 1,
          "name": "Student Name"
        }
      },
      {
        "id": 2,
        "title": "Juara 2 Turnamen Nasional",
        "studentId": 2,
        "date": "2023-06-15T00:00:00.000Z",
        "desc": "Finalis turnamen nasional",
        "level": "Nasional",
        "place": 2,
        "event": "Turnamen Sepak Bola U-14 Nasional",
        "student": {
          "id": 2,
          "name": "Another Student"
        }
      }
    ]
    ```

- **GET /api/admin/achievements/:id** - Get achievement by ID
  - Response (200 OK):
    ```json
    {
      "id": 1,
      "title": "Juara 1 Turnamen Regional",
      "studentId": 1,
      "date": "2023-05-20T00:00:00.000Z",
      "desc": "Memenangkan turnamen regional tingkat provinsi",
      "level": "Regional",
      "place": 1,
      "event": "Turnamen Sepak Bola U-12 Provinsi",
      "student": {
        "id": 1,
        "name": "Student Name"
      }
    }
    ```

- **POST /api/admin/achievements** - Create a new achievement
  - Request Body:
    ```json
    {
      "title": "Juara 3 Turnamen Kota",
      "studentId": 3,
      "date": "2023-07-10",
      "desc": "Mendapatkan posisi ketiga dalam turnamen kota",
      "level": "Kota",
      "place": 3,
      "event": "Turnamen Sepak Bola U-10 Kota"
    }
    ```
  - Response (201 Created):
    ```json
    {
      "id": 3,
      "title": "Juara 3 Turnamen Kota",
      "studentId": 3,
      "date": "2023-07-10T00:00:00.000Z",
      "desc": "Mendapatkan posisi ketiga dalam turnamen kota",
      "level": "Kota",
      "place": 3,
      "event": "Turnamen Sepak Bola U-10 Kota",
      "student": {
        "id": 3,
        "name": "Third Student"
      }
    }
    ```

- **PUT /api/admin/achievements/:id** - Update an achievement
  - Request Body:
    ```json
    {
      "title": "Juara 1 Turnamen Regional Updated",
      "studentId": 1,
      "date": "2023-05-21",
      "desc": "Memenangkan turnamen regional tingkat provinsi (updated)",
      "level": "Regional",
      "place": 1,
      "event": "Turnamen Sepak Bola U-12 Provinsi"
    }
    ```
  - Response (200 OK):
    ```json
    {
      "id": 1,
      "title": "Juara 1 Turnamen Regional Updated",
      "studentId": 1,
      "date": "2023-05-21T00:00:00.000Z",
      "desc": "Memenangkan turnamen regional tingkat provinsi (updated)",
      "level": "Regional",
      "place": 1,
      "event": "Turnamen Sepak Bola U-12 Provinsi",
      "student": {
        "id": 1,
        "name": "Student Name"
      }
    }
    ```

- **DELETE /api/admin/achievements/:id** - Delete an achievement
  - Response (200 OK):
    ```json
    {
      "message": "Prestasi berhasil dihapus"
    }
    ```

#### Test Management

- **GET /api/admin/tests** - Get all tests
  - Response (200 OK):
    ```json
    [
      {
        "id": 1,
        "name": "Tes Fisik Semester 1",
        "date": "2023-06-15T00:00:00.000Z",
        "coach": {
          "id": 1,
          "name": "Coach Name",
          "email": "coach@example.com"
        },
        "grades": [
          {
            "id": 1,
            "date": "2023-06-15T00:00:00.000Z",
            "student": {
              "id": 1,
              "name": "Student Name",
              "gender": "L",
              "age": 12
            }
          },
          {
            "id": 2,
            "date": "2023-06-15T00:00:00.000Z",
            "student": {
              "id": 2,
              "name": "Another Student",
              "gender": "P",
              "age": 13
            }
          }
        ]
      }
    ]
    ```

- **GET /api/admin/tests/:id** - Get test by ID
  - Response (200 OK):
    ```json
    {
      "id": 1,
      "name": "Tes Fisik Semester 1",
      "date": "2023-06-15T00:00:00.000Z",
      "coach": {
        "id": 1,
        "name": "Coach Name",
        "email": "coach@example.com"
      },
      "grades": [
        {
          "id": 1,
          "date": "2023-06-15T00:00:00.000Z",
          "student": {
            "id": 1,
            "name": "Student Name",
            "gender": "L",
            "age": 12,
            "level": "Intermediate"
          }
        }
      ]
    }
    ```

- **POST /api/admin/tests** - Create a new test
  - Request Body:
    ```json
    {
      "name": "Tes Fisik Semester 2",
      "date": "2023-12-10",
      "coachId": 1
    }
    ```
  - Response (201 Created):
    ```json
    {
      "id": 2,
      "name": "Tes Fisik Semester 2",
      "date": "2023-12-10T00:00:00.000Z",
      "coachId": 1
    }
    ```

- **PATCH /api/admin/tests/:id** - Edit a test
  - Request Body:
    ```json
    {
      "name": "Tes Fisik Semester 1 (Updated)",
      "date": "2023-06-20"
    }
    ```
  - Response (200 OK):
    ```json
    {
      "id": 1,
      "name": "Tes Fisik Semester 1 (Updated)",
      "date": "2023-06-20T00:00:00.000Z",
      "coachId": 1
    }
    ```

- **DELETE /api/admin/tests/:id** - Delete a test
  - Response (200 OK):
    ```json
    {
      "message": "Tes berhasil dihapus"
    }
    ```

#### Grade Management

- **GET /api/admin/students/:studentId/grades** - Get grades by student ID
  - Response (200 OK):
    ```json
    [
      {
        "id": 1,
        "date": "2023-06-15T00:00:00.000Z",
        "studentId": 1,
        "coachId": 1,
        "testId": 1,
        "tinggiBadan": 150.5,
        "beratBadan": 45.2,
        "bmi": 19.8,
        "kategoriBMI": "NORMAL",
        "tinggiDuduk": 75.3,
        "panjangTungkai": 80.1,
        "rentangLengan": 152.0,
        "denyutNadiIstirahat": 70.0,
        "saturasiOksigen": 98.0,
        "standingBoardJump": 180.5,
        "kecepatan": 7.2,
        "dayaTahan": 8.5,
        "controllingKanan": 3,
        "controllingKiri": 2,
        "dribbling": 3,
        "longpassKanan": 3,
        "longpassKiri": 2,
        "shortpassKanan": 4,
        "shortpassKiri": 3,
        "shootingKanan": 3,
        "shootingKiri": 2,
        "disiplin": 4,
        "komitmen": 3,
        "percayaDiri": 3,
        "injuryDetail": null,
        "comment": "Performa baik, perlu peningkatan pada kontrol bola dengan kaki kiri",
        "student": {
          "id": 1,
          "name": "Student Name"
        },
        "coach": {
          "id": 1,
          "name": "Coach Name"
        }
      }
    ]
    ```

- **GET /api/admin/grades/:id** - Get grade by ID
  - Response (200 OK):
    ```json
    {
      "id": 1,
      "date": "2023-06-15T00:00:00.000Z",
      "studentId": 1,
      "coachId": 1,
      "testId": 1,
      "tinggiBadan": 150.5,
      "beratBadan": 45.2,
      "bmi": 19.8,
      "kategoriBMI": "NORMAL",
      "tinggiDuduk": 75.3,
      "panjangTungkai": 80.1,
      "rentangLengan": 152.0,
      "denyutNadiIstirahat": 70.0,
      "saturasiOksigen": 98.0,
      "standingBoardJump": 180.5,
      "kecepatan": 7.2,
      "dayaTahan": 8.5,
      "controllingKanan": 3,
      "controllingKiri": 2,
      "dribbling": 3,
      "longpassKanan": 3,
      "longpassKiri": 2,
      "shortpassKanan": 4,
      "shortpassKiri": 3,
      "shootingKanan": 3,
      "shootingKiri": 2,
      "disiplin": 4,
      "komitmen": 3,
      "percayaDiri": 3,
      "injuryDetail": null,
      "comment": "Performa baik, perlu peningkatan pada kontrol bola dengan kaki kiri",
      "student": {
        "id": 1,
        "name": "Student Name"
      },
      "coach": {
        "id": 1,
        "name": "Coach Name"
      }
    }
    ```

- **POST /api/admin/grades** - Add a new grade
  - Request Body:
    ```json
    {
      "studentId": 1,
      "testId": 1,
      "date": "2023-06-15",
      "tinggiBadan": 150.5,
      "beratBadan": 45.2,
      "bmi": 19.8,
      "kategoriBMI": "NORMAL",
      "tinggiDuduk": 75.3,
      "panjangTungkai": 80.1,
      "rentangLengan": 152.0,
      "denyutNadiIstirahat": 70.0,
      "saturasiOksigen": 98.0,
      "standingBoardJump": 180.5,
      "kecepatan": 7.2,
      "dayaTahan": 8.5,
      "controllingKanan": 3,
      "controllingKiri": 2,
      "dribbling": 3,
      "longpassKanan": 3,
      "longpassKiri": 2,
      "shortpassKanan": 4,
      "shortpassKiri": 3,
      "shootingKanan": 3,
      "shootingKiri": 2,
      "disiplin": 4,
      "komitmen": 3,
      "percayaDiri": 3,
      "injuryDetail": null,
      "comment": "Performa baik, perlu peningkatan pada kontrol bola dengan kaki kiri"
    }
    ```
  - Response (201 Created):
    ```json
    {
      "id": 1,
      "date": "2023-06-15T00:00:00.000Z",
      "studentId": 1,
      "coachId": 1,
      "testId": 1,
      "tinggiBadan": 150.5,
      "beratBadan": 45.2,
      "bmi": 19.8,
      "kategoriBMI": "NORMAL",
      "tinggiDuduk": 75.3,
      "panjangTungkai": 80.1,
      "rentangLengan": 152.0,
      "denyutNadiIstirahat": 70.0,
      "saturasiOksigen": 98.0,
      "standingBoardJump": 180.5,
      "kecepatan": 7.2,
      "dayaTahan": 8.5,
      "controllingKanan": 3,
      "controllingKiri": 2,
      "dribbling": 3,
      "longpassKanan": 3,
      "longpassKiri": 2,
      "shortpassKanan": 4,
      "shortpassKiri": 3,
      "shootingKanan": 3,
      "shootingKiri": 2,
      "disiplin": 4,
      "komitmen": 3,
      "percayaDiri": 3,
      "injuryDetail": null,
      "comment": "Performa baik, perlu peningkatan pada kontrol bola dengan kaki kiri",
      "student": {
        "id": 1,
        "name": "Student Name"
      },
      "coach": {
        "id": 1,
        "name": "Coach Name"
      },
      "test": {
        "id": 1,
        "name": "Tes Fisik Semester 1"
      }
    }
    ```

- **PUT /api/admin/grades/:id** - Update a grade
  - Request Body:
    ```json
    {
      "beratBadan": 46.0,
      "bmi": 20.1,
      "kategoriBMI": "NORMAL",
      "controllingKiri": 3,
      "comment": "Performa meningkat, kontrol bola dengan kaki kiri sudah lebih baik"
    }
    ```
  - Response (200 OK):
    ```json
    {
      "id": 1,
      "date": "2023-06-15T00:00:00.000Z",
      "studentId": 1,
      "coachId": 1,
      "testId": 1,
      "tinggiBadan": 150.5,
      "beratBadan": 46.0,
      "bmi": 20.1,
      "kategoriBMI": "NORMAL",
      "tinggiDuduk": 75.3,
      "panjangTungkai": 80.1,
      "rentangLengan": 152.0,
      "denyutNadiIstirahat": 70.0,
      "saturasiOksigen": 98.0,
      "standingBoardJump": 180.5,
      "kecepatan": 7.2,
      "dayaTahan": 8.5,
      "controllingKanan": 3,
      "controllingKiri": 3,
      "dribbling": 3,
      "longpassKanan": 3,
      "longpassKiri": 2,
      "shortpassKanan": 4,
      "shortpassKiri": 3,
      "shootingKanan": 3,
      "shootingKiri": 2,
      "disiplin": 4,
      "komitmen": 3,
      "percayaDiri": 3,
      "injuryDetail": null,
      "comment": "Performa meningkat, kontrol bola dengan kaki kiri sudah lebih baik",
      "student": {
        "id": 1,
        "name": "Student Name"
      },
      "coach": {
        "id": 1,
        "name": "Coach Name"
      }
    }
    ```

- **DELETE /api/admin/grades/:id** - Delete a grade
  - Response (200 OK):
    ```json
    {
      "message": "Nilai berhasil dihapus"
    }
    ```

#### Attendance Management

- **GET /api/admin/students/:studentId/attendance** - Get attendance by student ID
  - Response (200 OK):
    ```json
    [
      {
        "id": 1,
        "date": "2023-06-15T00:00:00.000Z",
        "present": true,
        "studentId": 1,
        "student": {
          "id": 1,
          "name": "Student Name"
        }
      },
      {
        "id": 2,
        "date": "2023-06-10T00:00:00.000Z",
        "present": false,
        "studentId": 1,
        "student": {
          "id": 1,
          "name": "Student Name"
        }
      }
    ]
    ```

- **GET /api/admin/attendance/:id** - Get attendance by ID
  - Response (200 OK):
    ```json
    {
      "id": 1,
      "date": "2023-06-15T00:00:00.000Z",
      "present": true,
      "studentId": 1,
      "student": {
        "id": 1,
        "name": "Student Name",
        "coachId": 1,
        "level": "Intermediate"
      }
    }
    ```

- **GET /api/admin/attendance/date/:date** - Get attendance by date
  - Response (200 OK):
    ```json
    [
      {
        "id": 1,
        "date": "2023-06-15T00:00:00.000Z",
        "present": true,
        "studentId": 1,
        "student": {
          "id": 1,
          "name": "Student Name",
          "gender": "L",
          "coachId": 1,
          "level": "Intermediate"
        }
      },
      {
        "id": 3,
        "date": "2023-06-15T00:00:00.000Z",
        "present": true,
        "studentId": 2,
        "student": {
          "id": 2,
          "name": "Another Student",
          "gender": "P",
          "coachId": 1,
          "level": "Beginner"
        }
      }
    ]
    ```

- **POST /api/admin/attendance** - Create a new attendance record
  - Request Body:
    ```json
    {
      "date": "2023-06-20",
      "present": true,
      "studentId": 1
    }
    ```
  - Response (201 Created):
    ```json
    {
      "id": 4,
      "date": "2023-06-20T00:00:00.000Z",
      "present": true,
      "studentId": 1,
      "student": {
        "id": 1,
        "name": "Student Name",
        "gender": "L",
        "coachId": 1,
        "level": "Intermediate"
      }
    }
    ```

- **PUT /api/admin/attendance/:id** - Update an attendance record
  - Request Body:
    ```json
    {
      "date": "2023-06-20",
      "present": false
    }
    ```
  - Response (200 OK):
    ```json
    {
      "id": 4,
      "date": "2023-06-20T00:00:00.000Z",
      "present": false,
      "studentId": 1,
      "student": {
        "id": 1,
        "name": "Student Name",
        "gender": "L",
        "coachId": 1
      }
    }
    ```

- **DELETE /api/admin/attendance/:id** - Delete an attendance record
  - Response (200 OK):
    ```json
    {
      "message": "Data kehadiran berhasil dihapus"
    }
    ```

#### User Management

- **GET /api/admin/users** - Get all users
  - Response (200 OK):
    ```json
    [
      {
        "id": 1,
        "name": "User Name",
        "email": "user@example.com",
        "role": "USER",
        "telp": "081234567890",
        "status": true,
        "address": "Jl. Example No. 123",
        "createAt": "2023-05-10T07:00:00.000Z",
        "parentOf": [
          {
            "id": 1,
            "name": "Student Name"
          }
        ]
      },
      {
        "id": 2,
        "name": "Another User",
        "email": "user2@example.com",
        "role": "USER",
        "telp": "081234567891",
        "status": true,
        "address": "Jl. Example No. 456",
        "createAt": "2023-05-15T08:30:00.000Z",
        "parentOf": []
      }
    ]
    ```

- **GET /api/admin/users/:id** - Get user by ID
  - Response (200 OK):
    ```json
    {
      "id": 1,
      "email": "user@example.com",
      "name": "User Name",
      "role": "USER",
      "telp": "081234567890",
      "status": true,
      "address": "Jl. Example No. 123",
      "parentOf": [
        {
          "id": 1,
          "name": "Student Name"
        }
      ]
    }
    ```

- **POST /api/admin/users** - Create a new user
  - Request Body:
    ```json
    {
      "name": "New User",
      "email": "newuser@example.com",
      "password": "securepassword",
      "role": "USER",
      "address": "Jl. Example No. 789",
      "telp": "081234567892"
    }
    ```
  - Response (201 Created):
    ```json
    {
      "id": 3,
      "name": "New User",
      "email": "newuser@example.com",
      "role": "USER",
      "address": "Jl. Example No. 789",
      "status": true,
      "telp": "081234567892"
    }
    ```

- **PUT /api/admin/users/:id** - Update a user
  - Request Body:
    ```json
    {
      "email": "updatedemail@example.com",
      "password": "newsecurepassword",
      "role": "USER",
      "status": true,
      "childrenIds": [1, 2]
    }
    ```
  - Response (200 OK):
    ```json
    {
      "id": 1,
      "email": "updatedemail@example.com",
      "role": "USER",
      "parentOf": [
        {
          "id": 1,
          "name": "Student Name"
        },
        {
          "id": 2,
          "name": "Another Student"
        }
      ]
    }
    ```

- **DELETE /api/admin/users/:id** - Delete a user
  - Response (200 OK):
    ```json
    {
      "message": "Pengguna berhasil dihapus"
    }
    ```

### User Routes

All user routes require authentication.

- **GET /api/users/me/:id** - Get current user details
  - Response (200 OK):
    ```json
    {
      "id": 1,
      "email": "user@example.com",
      "name": "User Name",
      "role": "USER",
      "telp": "081234567890",
      "status": true,
      "address": "Jl. Example No. 123",
      "parentOf": [
        {
          "id": 1,
          "name": "Student Name"
        }
      ]
    }
    ```

- **GET /api/users/my-children** - Get children associated with the current user
  - Response (200 OK):
    ```json
    [
      {
        "id": 1,
        "name": "Student Name",
        "gender": "L",
        "age": 12,
        "level": "Intermediate",
        "tanggalLahir": "2012-05-15T00:00:00.000Z",
        "tempatLahir": "Jakarta",
        "kategoriBMI": "NORMAL",
        "photoUrl": "https://s3-bucket-url/photo.jpg"
      }
    ]
    ```

- **GET /api/users/my-children/:childId** - Get details of a specific child
  - Response (200 OK):
    ```json
    {
      "id": 1,
      "name": "Student Name",
      "photoUrl": "https://s3-bucket-url/photo.jpg",
      "kk": "https://s3-bucket-url/kk.jpg",
      "koperasi": "https://s3-bucket-url/koperasi.jpg",
      "akta": "https://s3-bucket-url/akta.jpg",
      "bpjs": "https://s3-bucket-url/bpjs.jpg",
      "age": 12,
      "gender": "L",
      "kategoriBMI": "NORMAL",
      "level": "Intermediate",
      "tanggalLahir": "2012-05-15T00:00:00.000Z",
      "tempatLahir": "Jakarta",
      "coachId": 1,
      "parentId": 1,
      "grades": [
        {
          "id": 1,
          "date": "2023-06-15T00:00:00.000Z",
          "studentId": 1,
          "coachId": 1,
          "testId": 1,
          "tinggiBadan": 150.5,
          "beratBadan": 45.2,
          "bmi": 19.8,
          "kategoriBMI": "NORMAL",
          "tinggiDuduk": 75.3,
          "panjangTungkai": 80.1,
          "rentangLengan": 152.0,
          "denyutNadiIstirahat": 70.0,
          "saturasiOksigen": 98.0,
          "standingBoardJump": 180.5,
          "kecepatan": 7.2,
          "dayaTahan": 8.5,
          "controllingKanan": 3,
          "controllingKiri": 2,
          "dribbling": 3,
          "longpassKanan": 3,
          "longpassKiri": 2,
          "shortpassKanan": 4,
          "shortpassKiri": 3,
          "shootingKanan": 3,
          "shootingKiri": 2,
          "disiplin": 4,
          "komitmen": 3,
          "percayaDiri": 3,
          "injuryDetail": null,
          "comment": "Performa baik, perlu peningkatan pada kontrol bola dengan kaki kiri"
        }
      ],
      "attendance": [
        {
          "id": 1,
          "date": "2023-06-15T00:00:00.000Z",
          "present": true,
          "studentId": 1
        }
      ]
    }
    ```

- **GET /api/users/test/child/:id** - Get tests for a specific child
  - Response (200 OK):
    ```json
    [
      {
        "id": 1,
        "name": "Tes Fisik Semester 1",
        "date": "2023-06-15T00:00:00.000Z",
        "coach": {
          "id": 1,
          "name": "Coach Name"
        },
        "grades": [
          {
            "id": 1,
            "date": "2023-06-15T00:00:00.000Z",
            "kategoriBMI": "NORMAL",
            "bmi": 19.8,
            "disiplin": 4,
            "komitmen": 3,
            "percayaDiri": 3
          }
        ]
      }
    ]
    ```

- **GET /api/users/test/:id/:studentId** - Get test grades for a specific student and test
  - Response (200 OK):
    ```json
    {
      "id": 1,
      "name": "Tes Fisik Semester 1",
      "date": "2023-06-15T00:00:00.000Z",
      "coach": {
        "id": 1,
        "name": "Coach Name",
        "email": "coach@example.com"
      },
      "student": {
        "id": 1,
        "name": "Student Name",
        "gender": "L",
        "age": 12,
        "level": "Intermediate"
      },
      "antropometri": {
        "tinggiBadan": 150.5,
        "beratBadan": 45.2,
        "bmi": 19.8,
        "kategoriBMI": "NORMAL",
        "tinggiDuduk": 75.3,
        "panjangTungkai": 80.1,
        "rentangLengan": 152.0
      },
      "fisiologi": {
        "denyutNadiIstirahat": 70.0,
        "saturasiOksigen": 98.0
      },
      "biomotor": {
        "standingBoardJump": 180.5,
        "kecepatan": 7.2,
        "dayaTahan": 8.5
      },
      "keterampilan": {
        "controllingKanan": 3,
        "controllingKiri": 2,
        "dribbling": 3,
        "longpassKanan": 3,
        "longpassKiri": 2,
        "shortpassKanan": 4,
        "shortpassKiri": 3,
        "shootingKanan": 3,
        "shootingKiri": 2
      },
      "psikologi": {
        "disiplin": 4,
        "komitmen": 3,
        "percayaDiri": 3
      },
      "catatan": {
        "injuryDetail": null,
        "comment": "Performa baik, perlu peningkatan pada kontrol bola dengan kaki kiri"
      }
    }
    ```

### Public Routes

These routes are publicly accessible without authentication.

- **GET /api/public/students** - Get all students (public view)
  - Response (200 OK):
    ```json
    [
      {
        "id": 1,
        "name": "Student Name",
        "photoUrl": "https://s3-bucket-url/photo.jpg"
      },
      {
        "id": 2,
        "name": "Another Student",
        "photoUrl": "https://s3-bucket-url/photo2.jpg"
      }
    ]
    ```

- **GET /api/public/coaches** - Get all coaches
  - Response (200 OK):
    ```json
    [
      {
        "id": 1,
        "name": "Coach Name",
        "email": "coach@example.com",
        "telp": "081234567890",
        "gender": "L",
        "photoUrl": "https://s3-bucket-url/coach-photo.jpg"
      },
      {
        "id": 2,
        "name": "Another Coach",
        "email": "coach2@example.com",
        "telp": "081234567891",
        "gender": "P",
        "photoUrl": "https://s3-bucket-url/coach2-photo.jpg"
      }
    ]
    ```

- **GET /api/public/achievements** - Get all achievements
  - Response (200 OK):
    ```json
    [
      {
        "id": 1,
        "title": "Juara 1 Turnamen Regional",
        "studentId": 1,
        "date": "2023-05-20T00:00:00.000Z",
        "desc": "Memenangkan turnamen regional tingkat provinsi",
        "level": "Regional",
        "place": 1,
        "event": "Turnamen Sepak Bola U-12 Provinsi",
        "student": {
          "id": 1,
          "name": "Student Name"
        }
      },
      {
        "id": 2,
        "title": "Juara 2 Turnamen Nasional",
        "studentId": 2,
        "date": "2023-06-15T00:00:00.000Z",
        "desc": "Finalis turnamen nasional",
        "level": "Nasional",
        "place": 2,
        "event": "Turnamen Sepak Bola U-14 Nasional",
        "student": {
          "id": 2,
          "name": "Another Student"
        }
      }
    ]
    ```

## File Upload

The API supports file uploads for:

- Student photos
- Student documents (KK, Koperasi, Akta, BPJS)
- Coach photos

Files are uploaded to AWS S3 using the multer-s3 middleware.

## Authorization Roles

The API implements role-based access control with the following roles:

- **SUPER_ADMIN** - Full access to all endpoints
- **COACH** - Access to coach-specific endpoints and student management
- **USER** - Limited access to view their own data and their children's data
- **GUEST** - Access to public endpoints only

## Contributors

- Kelompok 1
