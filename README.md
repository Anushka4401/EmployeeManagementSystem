# EmployeeManagementSystem
This is a full stack project which is made using React.js for frontend and Spring Boot for backend
Here's a **README.md** file for your **Employee Management System** project based on the provided requirements:  

---

### **Employee Management System** 🏢

#### **Overview**
The **Employee Management System (EMS)** is a web-based application designed to manage employees efficiently. It provides authentication, role-based access, user management, document handling, messaging, and notification features.

---

## **Features**

### 🔐 **Authentication & Security**
- JWT Token-based authentication for secure login.
- Password encryption for user credentials.
- Session management with access, refresh, and ID tokens.

### 🏢 **User Roles & Functionalities**
#### **👑 Admin User**
1. **User Management**  
   - View, add, and manage users.  
   - Import users via Excel.  
   - Approve registration requests.  
   - Assign roles (Admin/User).  
   - Activate/deactivate accounts.  

2. **Financial Documents**  
   - Upload financial documents for employees.  

3. **Notifications**  
   - Send notifications for registration approvals.  

4. **Messaging**  
   - Internal communication between users.  

5. **Schedulers**  
   - Auto-approve user registration requests at midnight.  

6. **Login History**  
   - Track and maintain user login records.  

#### **👤 Normal User**
1. **Profile Management**  
   - Edit and update personal details.  

2. **Financial Documents**  
   - View assigned financial documents.  

3. **Messaging**  
   - Communicate with admins.  

4. **Notifications**  
   - Receive system notifications.  

---

## **💡 Tech Stack**
- **Frontend**: React.js  
- **Backend**: Spring Boot  
- **Database**: PostgreSQL 
- **Security**: JWT Authentication, Role-based Authorization  
- **Other**: Excel Import, Background Job Scheduling  

---

## **🚀 How to Run the Project**
### **1️⃣ Backend (Spring Boot)**
1. Clone the repository:  
   ```sh
   git clone https://github.com/your-repo/ems.git
   ```
2. Navigate to the backend folder:  
   ```sh
   cd ems-backend
   ```
3. Configure database settings in `application.properties`.  
4. Run the application:  
   ```sh
   mvn spring-boot:run
   ```

### **2️⃣ Frontend (React)**
1. Navigate to the frontend folder:  
   ```sh
   cd ems-frontend
   ```
2. Install dependencies:  
   ```sh
   npm install
   ```
3. Start the development server:  
   ```sh
   npm start
   ```

---



