Resume Builder (Create React App + Express + MySQL) - Realistic Starter

This project is scaffolded to match the UI flow you provided (login, landing, templates, job details, builder, my CVs).

Backend:
- Express server at /backend
- MySQL connection using mysql2
- Auth endpoints: /api/auth/register, /api/auth/login
- Resume CRUD endpoints: /api/resumes

Frontend:
- Create React App under /frontend
- React Router for navigation
- Axios for API calls

Setup:
1) Import database:
   mysql -u root -p < backend/db.sql
2) Backend:
   cd backend
   cp .env.example .env
   # edit .env with DB credentials and JWT_SECRET
   npm install
   npm start
3) Frontend:
   cd frontend
   npm install
   npm start

Notes:
- Enter your MySQL password in backend/.env before starting the backend.
- This is a starter — expand templates, PDF export, and AI generation as needed.


//i need to drag them like education and experience like top buttom and thoese sections all these sections
//swappable section i can drag and drop to change order and position according to that the resume will be generated
//and user can add more sections also like these extra sections
//modify the code accordingly and give me the full code making those changes
// i need code for that.full resume builder code with those changes
//with the responsive design also..real time drag and drop feature for those sections

## Final Assistant Changes
- Full client-side drag-and-drop ordering and print fixes implemented. See frontend/README.md for details.
