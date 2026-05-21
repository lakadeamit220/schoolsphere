# SchoolSphere

SchoolSphere is a comprehensive School Management ERP System. This project is built to learn Next.js deeply by developing a real-world, full-stack application from scratch. It handles core school operations including user authentication, student and teacher management, attendance tracking, and fee management.

## Getting Started

To run this project locally on your machine:

1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Setup Database:**
   Ensure you have your `.env` file configured with your PostgreSQL connection string, then run:
   ```bash
   npx prisma db push
   ```
3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Development Roadmap

### Phase 1: Database Modeling and Setup (In Progress)
- Step 1: Connect to Local PostgreSQL via environment variables.
- Step 2: Define the `User` Model.
- Step 3: Define `Student` and `Teacher` Models.
- Step 4: Define `Attendance` and `Fee` Models.
- Step 5: Push the Schema to the Database.

### Phase 2: Custom Authentication System
- Step 1: Implement Registration UI (`app/register/page.js`).
- Step 2: Implement password hashing using `bcryptjs` and user persistence via Server Actions.
- Step 3: Implement Login UI (`app/login/page.js`).
- Step 4: Implement credential verification and JWT token generation via Server Actions.
- Step 5: Implement secure HTTP-only cookie storage for the JWT token.
- Step 6: Implement Logout functionality and cookie invalidation.

### Phase 3: Route Protection and Middleware
- Step 1: Initialize `middleware.js` in the project root.
- Step 2: Implement JWT token verification logic.
- Step 3: Enforce unauthenticated user redirection from protected routes (e.g., `/dashboard`) to the login page.
- Step 4: Enforce authenticated user redirection from authentication routes to the dashboard.

### Phase 4: Dashboard Layout and UI
- Step 1: Develop a responsive Sidebar component using Tailwind CSS and Lucide React.
- Step 2: Develop a Top Header component.
- Step 3: Integrate components into the root layout (`app/layout.js`).
- Step 4: Implement dynamic navigation rendering based on Role-Based Access Control (RBAC).

### Phase 5: Student and Teacher Management (CRUD)
- Step 1: Develop an administrative view for the Student directory.
- Step 2: Develop an administrative view for the Teacher directory.
- Step 3: Develop the Student Registration form utilizing React state management.
- Step 4: Implement data persistence via Server Actions and UI invalidation via `revalidatePath`.
- Step 5: Implement modification (Edit) and deletion (Delete) workflows for Students and Teachers.

### Phase 6: Attendance Module
- Step 1: Develop a class and date selection interface for Teachers.
- Step 2: Fetch and render the Student roster.
- Step 3: Implement attendance status selection controls.
- Step 4: Implement bulk attendance data persistence via Server Actions.

### Phase 7: Fees Module (MVP)
- Step 1: Develop an administrative view for Student financial records.
- Step 2: Develop a form to record fee transactions and due dates.
- Step 3: Implement financial status indicators (Pending vs. Paid) on the Student directory.

---

## Database Relationships Example

To understand how the data flows between tables, consider a real-life example of our school management system in action.

### 1. The User Table (The Core Identity)
Every person who logs into the system (Admin, Teacher, Student, Parent) starts here.
| id (UUID) | name | email | password | role |
| :--- | :--- | :--- | :--- | :--- |
| `user-101` | Shruti Kulkarni | shruti@school.com | `hashed_pwd` | `ADMIN` |
| `user-102` | Sandeep Deshmukh | sandeep@school.com | `hashed_pwd` | `TEACHER` |
| `user-103` | Amit Lakade | amit@example.com | `hashed_pwd` | `STUDENT` |
| `user-104` | Neha Joshi | neha@example.com | `hashed_pwd` | `STUDENT` |

### 2. The Teacher Table (One-to-One with User)
Because Sandeep is a teacher, he gets an academic profile here. The `userId` links exactly to his record in the User table.
| id (UUID) | userId | subject |
| :--- | :--- | :--- |
| `tch-001` | `user-102` | Mathematics |

### 3. The Student Table (One-to-One with User)
Because Amit and Neha are students, they get academic profiles here.
| id (UUID) | userId | grade | rollNumber |
| :--- | :--- | :--- | :--- |
| `stu-001` | `user-103` | 10th Grade | 10A-45 |
| `stu-002` | `user-104` | 10th Grade | 10A-46 |

### 4. The Attendance Table (One-to-Many with Student)
Students attend school over many days. The `studentId` links back to the Student table.
| id (UUID) | studentId | date | status |
| :--- | :--- | :--- | :--- |
| `att-001` | `stu-001` | 2026-05-20 | `PRESENT` |
| `att-002` | `stu-002` | 2026-05-20 | `ABSENT` |
| `att-003` | `stu-001` | 2026-05-21 | `PRESENT` |
| `att-004` | `stu-002` | 2026-05-21 | `LATE` |

### 5. The Fee Table (One-to-Many with Student)
Students have multiple fee records over the year.
| id (UUID) | studentId | amount | dueDate | status |
| :--- | :--- | :--- | :--- | :--- |
| `fee-001` | `stu-001` | 500.00 | 2026-06-01 | `PAID` |
| `fee-002` | `stu-002` | 500.00 | 2026-06-01 | `PENDING` |
| `fee-003` | `stu-001` | 500.00 | 2026-07-01 | `PENDING` |
| `fee-004` | `stu-002` | 500.00 | 2026-07-01 | `OVERDUE` |
