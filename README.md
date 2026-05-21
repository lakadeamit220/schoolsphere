This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

# SchoolSphere: Development Roadmap

## Phase 1: Database Modeling and Setup (In Progress)
- Step 1: Connect to Local PostgreSQL via environment variables.
- Step 2: Define the `User` Model.
- Step 3: Define `Student` and `Teacher` Models.
- Step 4: Define `Attendance` and `Fee` Models.
- Step 5: Push the Schema to the Database.

## Phase 2: Custom Authentication System
- Step 1: Implement Registration UI (`app/register/page.js`).
- Step 2: Implement password hashing using `bcryptjs` and user persistence via Server Actions.
- Step 3: Implement Login UI (`app/login/page.js`).
- Step 4: Implement credential verification and JWT token generation via Server Actions.
- Step 5: Implement secure HTTP-only cookie storage for the JWT token.
- Step 6: Implement Logout functionality and cookie invalidation.

## Phase 3: Route Protection and Middleware
- Step 1: Initialize `middleware.js` in the project root.
- Step 2: Implement JWT token verification logic.
- Step 3: Enforce unauthenticated user redirection from protected routes (e.g., `/dashboard`) to the login page.
- Step 4: Enforce authenticated user redirection from authentication routes to the dashboard.

## Phase 4: Dashboard Layout and UI
- Step 1: Develop a responsive Sidebar component using Tailwind CSS and Lucide React.
- Step 2: Develop a Top Header component.
- Step 3: Integrate components into the root layout (`app/layout.js`).
- Step 4: Implement dynamic navigation rendering based on Role-Based Access Control (RBAC).

## Phase 5: Student and Teacher Management (CRUD)
- Step 1: Develop an administrative view for the Student directory.
- Step 2: Develop an administrative view for the Teacher directory.
- Step 3: Develop the Student Registration form utilizing React state management.
- Step 4: Implement data persistence via Server Actions and UI invalidation via `revalidatePath`.
- Step 5: Implement modification (Edit) and deletion (Delete) workflows for Students and Teachers.

## Phase 6: Attendance Module
- Step 1: Develop a class and date selection interface for Teachers.
- Step 2: Fetch and render the Student roster.
- Step 3: Implement attendance status selection controls.
- Step 4: Implement bulk attendance data persistence via Server Actions.

## Phase 7: Fees Module (MVP)
- Step 1: Develop an administrative view for Student financial records.
- Step 2: Develop a form to record fee transactions and due dates.
- Step 3: Implement financial status indicators (Pending vs. Paid) on the Student directory.

---

## Database Relationships Example

To understand how the data flows between tables, consider a real-life example of a student named Amit Lakade.

### 1. The User Table (The Core Identity)
Every person who logs into the system starts here.
| id (UUID) | name | email | password | role |
| :--- | :--- | :--- | :--- | :--- |
| `user-123` | Amit Lakade | amit@example.com | `hashed_pwd` | `STUDENT` |

### 2. The Student Table (The Academic Profile)
Because Amit is a student, he gets a profile here. The `userId` links exactly to the User table.
| id (UUID) | userId | grade | rollNumber |
| :--- | :--- | :--- | :--- |
| `stu-456` | `user-123` | 10th Grade | 10A-45 |

### 3. The Attendance Table (One-to-Many)
Amit attends school over many days. The `studentId` links back to the Student table.
| id (UUID) | studentId | date | status |
| :--- | :--- | :--- | :--- |
| `att-001` | `stu-456` | 2026-05-20 | `PRESENT` |
| `att-002` | `stu-456` | 2026-05-21 | `ABSENT` |

### 4. The Fee Table (One-to-Many)
Amit has multiple fee records over the year. The `studentId` links back to the Student table.
| id (UUID) | studentId | amount | dueDate | status |
| :--- | :--- | :--- | :--- | :--- |
| `fee-001` | `stu-456` | 500.00 | 2026-06-01 | `PAID` |
| `fee-002` | `stu-456` | 500.00 | 2026-07-01 | `PENDING` |
