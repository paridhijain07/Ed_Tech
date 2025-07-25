import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import OpenRoute from "./components/core/Auth/OpenRoute";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Settings from "./components/core/Dashboard/Settings/index";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor";
import Cart from "./components/core/Dashboard/Cart/index";
import Catalog from "./pages/Catalog";
import { useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "./utils/constants";
import MyCourses from "./components/core/Dashboard/MyCourses/index";
import AddCourse from "./components/core/Dashboard/AddCourse";
import EditCourse from "./components/core/Dashboard/EditCourse";
import ContactUs from "./pages/ContactUs";
import DummyPayment from "./pages/Payments";
import CourseDetails from "./pages/CourseDetails";
import About from "./pages/About";

import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";

function App() {
  const { user } = useSelector((state) => state.profile);

  return (
    <div className="w-screen min-h-screen bg-[#000814] flex flex-col overflow-y-auto">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/category/:categoryId" element={<Catalog />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/contact"
          element={
            <OpenRoute>
              <ContactUs />
            </OpenRoute>
          }
        />
        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />

        {/* ✅ View Course Route */}
        <Route
          path="/view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          <Route path="" element={<VideoDetails />} />
        </Route>

        {/* Dashboard Routes */}
        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard/my-profile" element={<MyProfile />} />
          <Route path="/dashboard/settings" element={<Settings />} />

          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="/dashboard/enrolled-courses"
                element={<EnrolledCourses />}
              />
              <Route path="/dashboard/cart" element={<Cart />} />
              <Route path="/dashboard/dummy-payment" element={<DummyPayment />} />
            </>
          )}

          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="/dashboard/my-courses" element={<MyCourses />} />
              <Route path="/dashboard/add-course" element={<AddCourse />} />
              <Route
                path="/dashboard/edit-course/:courseId"
                element={<EditCourse />}
              />
              <Route path="/dashboard/instructor" element={<Instructor />} />
            </>
          )}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
