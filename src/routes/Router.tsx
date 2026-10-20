import { createBrowserRouter } from "react-router-dom";
import { Suspense } from "react";
import Layout from "../layout/Layout";
import Home from "../Page/home";
import ListingPage from "../Page/listingClinik";
import BlogPage from "../Page/blog";
import ContactPage from "../Page/contact";
import AboutPage from "../Page/about";
import BlogDetails from "../Page/blogDetails";
import AllClinic from "../Page/allClinics";
import SignUp from "../Page/auth/SignUp";
import SignIn from "../Page/auth/SignIn";
import OTPVerification from "../Page/auth/Verification";
import ForgotPassword from "../Page/auth/ForgotPassword";
import ResetPassword from "../Page/auth/ResetPassword";
import ClinicDetails from "../Page/ClinicDetails";
import BookingPage from "../Page/clinicBooking";
import UserAccount from "../Page/userAccount";
import ClinicDashboard from "../Page/clinicDashboard";
import ResourcePage from "../Page/resources";
import { resourceLinks } from "../Page/resources/resourceData";
import LoadingFallback from "../components/common/LoadingFallback";
import RouteErrorBoundary from "../components/common/RouteErrorBoundary";
import ProtectedRoute from "../components/common/ProtectedRoute";
import BillingSuccess from "../Page/billing/BillingSuccess";
import BillingCancel from "../Page/billing/BillingCancel";

/* -------------------- ROUTER -------------------- */
const router = createBrowserRouter([
  {
    /* Layout wraps every route — Navbar + Footer are rendered once */
    element: <Layout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: "/signup",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <SignUp />
          </Suspense>
        ),
      },
      {
        path: "/signin",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <SignIn />
          </Suspense>
        ),
      },
      {
        path: "/forgot-password",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ForgotPassword />
          </Suspense>
        ),
      },
      {
        path: "/varification",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <OTPVerification />
          </Suspense>
        ),
      },
      {
        path: "/verification",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <OTPVerification />
          </Suspense>
        ),
      },
      {
        path: "/reset-password",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ResetPassword />
          </Suspense>
        ),
      },
      {
        path: "/",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "/list-your-clinic",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ListingPage />
          </Suspense>
        ),
      },
      {
        path: "/blog",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <BlogPage />
          </Suspense>
        ),
      },
      {
        path: "/blog/:slug",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <BlogDetails />
          </Suspense>
        ),
      },
      {
        path: "/blog/id/:id",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <BlogDetails />
          </Suspense>
        ),
      },
      {
        path: "/contact",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ContactPage />
          </Suspense>
        ),
      },
      {
        path: "/about-us",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AboutPage />
          </Suspense>
        ),
      },
      {
        path: "/see-all-clinic",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AllClinic />
          </Suspense>
        ),
      },
      ...resourceLinks.map(({ to }) => ({
        path: to,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ResourcePage />
          </Suspense>
        ),
      })),
      {
        path: "/clinic-details/:slug",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ClinicDetails />
          </Suspense>
        ),
      },
      {
        path: "/clinic-details/id/:id",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ClinicDetails />
          </Suspense>
        ),
      },
      {
        path: "/booking-form",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <BookingPage />
          </Suspense>
        ),
      },
      {
        path: "/user-account",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute allowedRoles={["PATIENT", "CLINIC_OWNER"]}>
              <UserAccount />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "/clinic-dashboard",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute allowedRoles={["CLINIC_OWNER"]}>
              <ClinicDashboard />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "/billing/success",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <BillingSuccess />
          </Suspense>
        ),
      },
      {
        path: "/billing/cancel",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <BillingCancel />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
