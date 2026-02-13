import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "./context/UserContext";
import { ProtectedRoute, AuthRoute } from "./components/RouteGaurds";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";

import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import APICredentials from "./pages/Crediential";
import WalletTransactions from "./pages/Tables/MainWallet";
import EWalletTransactions from "./pages/Tables/EWallet";
import PayinRecords from "./pages/Payin/PayinGenerated";
import PayoutReports from "./pages/payout/payoutRecords";
import CallbackUrls from "./pages/CallbackWhitelist";
import IpWhitelist from "./pages/IpWhitelist";
import { ToastContainer } from "react-toastify";
import PayInApisTable from "./pages/Apis/PayinApis";
import UserListPage from "./pages/userList";
import PayoutApisTable from "./pages/Apis/PayoutApis";
import CommissionPackages from "./pages/package";
import ApiSwitchManagement from "./pages/Apis/ApiManagement";
import PayInAPIDocs from "./pages/PayinDocs";
import PayoutAPIDocs from "./pages/PayoutDocs";
import EWalletToBankSettlement from "./pages/settlement";
import EWalletToMainWalletSettlement from "./pages/WalletSettlement";
import CreateQuery from "./pages/OtherPage/Queries";
import QueryDetail from "./pages/OtherPage/QueryDetail";
import QueryList from "./pages/OtherPage/QueriesList";
import MainWalletToEWalletTransfer from "./pages/MainToEwallet";
import ChargebacksTable from "./pages/Tables/ChargeBacks";
import SettingsPage from "./pages/OtherPage/Settings";
import BalanceEnquiryDocs from "./pages/BalanceDocs";
import SignUp from "./pages/AuthPages/SignUp";

// Define roles
export const ROLES = {
  ADMIN: 'Admin',
  USER: 'User',
  EDITOR: 'editor'
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer
          style={{ zIndex: 999999 }}
        />
        <ScrollToTop />
        <Routes>
          <Route element={<AuthRoute />}>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/forgot-password" element={<SignUp />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/credential" element={< APICredentials />} />
              <Route path="/mainwallet/report" element={<WalletTransactions />} />
              <Route path="/ewallet/report" element={<EWalletTransactions />} />
              <Route path="/payin/report" element={<PayinRecords model={"report"}/>} />
              <Route path="/payin/success" element={<PayinRecords model={"success"}/>} />
              <Route path="/payout/report" element={<PayoutReports model={"Payout"} />} />
              <Route path="/settlements" element={<PayoutReports model={"Settlements"} />} />
              <Route path="/chargeback" element={<ChargebacksTable />} />
              <Route path="/settings" element={<SettingsPage />} />

              <Route path="/callbackurls" element={<CallbackUrls />} />
              <Route path="/ipwhitelist" element={<IpWhitelist />} />
              <Route path="/docs/payin" element={<PayInAPIDocs />} />
              <Route path="/docs/payout" element={<PayoutAPIDocs />} />
              <Route path="/docs/balance-inquiry" element={<BalanceEnquiryDocs />} />
              <Route path="/query" element={<CreateQuery/>} />
              <Route path="/queries" element={<QueryList/>} />
              <Route path="/queries/:id" element={<QueryDetail />} />


              <Route element={<ProtectedRoute roles={[ROLES.ADMIN]} />}>
                <Route path="/payin/apis" element={<PayInApisTable />} />
                <Route path="/payout/apis" element={<PayoutApisTable />} />
                <Route path="/packages" element={<CommissionPackages />} />
                <Route path="/apis" element={<ApiSwitchManagement />} />
                <Route path="/users" element={<UserListPage />} />
                <Route path="/etomain" element={<EWalletToMainWalletSettlement />} />
                <Route path="/settlement" element={<EWalletToBankSettlement />} />
                <Route path="/maintoEwallet" element={<MainWalletToEWalletTransfer />} />

              </Route>
              <Route element={<ProtectedRoute roles={[ROLES.ADMIN, ROLES.EDITOR]} />}>
              </Route>
            </Route>
          </Route>

          <Route path="/unauthorized" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}