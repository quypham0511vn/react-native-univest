import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { observer } from "mobx-react";
import React, { useCallback, useEffect, useMemo } from "react";
import { Platform } from "react-native";
import TouchID from "react-native-touch-id";

import {
  ENUM_BIOMETRIC_TYPE,
  ERROR_BIOMETRIC,
  Events,
} from "@/commons/constants";
import Languages from "@/commons/Languages";
import ScreenNames from "@/commons/ScreenNames";
import Account from "@/containers/account/Account";
import ChangePassword from "@/containers/account/ChangePwd";
import EditProfile from "@/containers/account/EditProfile";
import InformationAccount from "@/containers/account/InformationAccount";
import QuickAuThen from "@/containers/account/QuickAuthencation";
import AccumulatedAssets from "@/containers/asset/AccumulatedAssets";
import Assets from "@/containers/asset/Assets";
import BookDetail from "@/containers/asset/BookDetail";
import CashFlow from "@/containers/asset/CashFlow";
import ConvertScreen from "@/containers/asset/ConvertScreen";
import ContractDetail from "@/containers/asset/ContractDetail";
import PaymentMethod from "@/containers/asset/PaymentMethod";
import WithdrawFromAccount from "@/containers/asset/WithdrawFromAccount";
import LinkAccount from "@/containers/account/LinkAccount";
import Login from "@/containers/auth/Login";
import MyWebview from "@/containers/MyWebview";
import Notification from "@/containers/notification/Notification";
import NotificationDetail from "@/containers/notification/NotificationDetail";
import Onboarding from "@/containers/Onboarding";
import Product from "@/containers/product/Product";
import Splash from "@/containers/Splash";
import Help from "@/containers/support/Help";
import TopUpScreen from "@/containers/asset/TopUpScreen";
import Transactions from "@/containers/transaction/Transactions";
import { useAppStore } from "@/hooks";
import SessionManager, { DeviceInfos } from "@/managers/SessionManager";
import { MyTabBar } from "./MyTabBar";
import UpdateNewPwd from "@/containers/account/UpdateNewPwd";
import ConfirmPhoneNumber from "@/containers/ConfirmPhoneNumber";
import Withdraw from "@/containers/asset/Withdraw";
import IntroProduct from "@/containers/product/IntroProduct";
import { EventEmitter } from "@/utils/EventEmitter";
import Navigator from "./Navigator";
import OTP from "@/containers/OTP";
import PaymentWebview from "@/containers/asset/PaymentWebview";
import IdentifyConfirm from "@/containers/account/IdentifyConfirm";
import BankAccount from "@/containers/account/BankAccount";
import ListAccumulatorBook from "@/containers/asset/ListAccumulatorBook";
import TransactionDetail from "@/containers/asset/TransactionDetail";
import TransactionInBook from "@/containers/asset/TransactionInBook";
import LinkAccountSocial from "@/containers/account/LinkAccountSocial";
import SignUp from "@/containers/auth/SignUp";
import InvestAccumulate from "@/containers/asset/InvestAccumulate";
import LoginWithBiometry from "@/containers/auth/LoginWithBiometry";
import Introduce from "@/containers/asset/Introduce";
import EContract from "@/containers/account/EContract";
import ProductIntro from "@/containers/asset/ProductIntro";
import TransferScreen from "@/containers/asset/TransferScreen";
import TempTransactionInBook from "@/containers/asset/TempTransactionInBook";
import InviteCustomer from "@/containers/account/InviteCustomer";
import TakeCareCustomer from "@/containers/account/TakeCareCustomer";
import DetailCustomer from "@/containers/account/DetailCustomer";
import ConsultantInfo from "@/containers/account/ConsultantInfo";
import NotificationOld from "@/containers/notification/NotificationOld";

const screenOptions = { headerShown: false };

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const RootStack = observer(() => {
  const { fastAuthInfo, userManager } = useAppStore();

  const forceLogout = useCallback(() => {
    SessionManager.logout();
    userManager.updateUserInfo(null);
    Navigator.navigateScreen(ScreenNames.product);
  }, [userManager]);

  useEffect(() => {
    const listener = EventEmitter.addListener(Events.LOGOUT, forceLogout);
    return () => listener.remove();
  }, [forceLogout]);

  useEffect(() => {
    initState();
  }, []);

  const initState = useCallback(() => {
    if (SessionManager.isEnableFastAuthentication) {
      fastAuthInfo.setEnableFastAuthentication(true);
    }

    if (Platform.OS === "ios" && DeviceInfos.HasNotch) {
      fastAuthInfo.setSupportedBiometry(ENUM_BIOMETRIC_TYPE.FACE_ID);
    }
    if (Platform.OS === "ios" && !DeviceInfos.HasNotch) {
      fastAuthInfo.setSupportedBiometry(ENUM_BIOMETRIC_TYPE.TOUCH_ID);
    }
    if (Platform.OS === "android") {
      TouchID.isSupported()
        .then((biometricType) => {
          if (biometricType) {
            fastAuthInfo.setSupportedBiometry(ENUM_BIOMETRIC_TYPE.TOUCH_ID);
          }
        })
        .catch((error) => {
          if (error?.code === ERROR_BIOMETRIC.NOT_SUPPORTED) {
            fastAuthInfo.setSupportedBiometry("");
          } else {
            fastAuthInfo.setSupportedBiometry(ENUM_BIOMETRIC_TYPE.TOUCH_ID);
          }
        });
    }
  }, [fastAuthInfo]);

  const getTabBarVisibility = useCallback((route: any) => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (
      routeName === undefined ||
      routeName === ScreenNames.product ||
      routeName === ScreenNames.assets ||
      routeName === ScreenNames.transactions ||
      routeName === ScreenNames.help
    ) {
      return true;
    }
    return false;
  }, []);

  const getOption = useCallback(
    ({ route }: any) => {
      return {
        tabBarVisible: getTabBarVisibility(route),
      } as any;
    },
    [getTabBarVisibility]
  );

  const renderTabBar = useCallback((props: any) => <MyTabBar {...props} />, []);

  const AuthStack = useCallback(() => {
    return (
      <Stack.Navigator
        initialRouteName={
          SessionManager.isEnableFastAuthentication
            ? ScreenNames.loginWithBiometry
            : ScreenNames.login
        }
        screenOptions={screenOptions}
      >
        <Stack.Screen name={ScreenNames.login} component={Login} />
        <Stack.Screen
          name={ScreenNames.loginWithBiometry}
          component={LoginWithBiometry}
        />
        <Stack.Screen name={ScreenNames.otp} component={OTP} />
        <Stack.Screen
          name={ScreenNames.updateNewPwd}
          component={UpdateNewPwd}
        />
        <Stack.Screen
          name={ScreenNames.confirmPhoneNumber}
          component={ConfirmPhoneNumber}
        />
        <Stack.Screen name={ScreenNames.signUp} component={SignUp} />
      </Stack.Navigator>
    );
  }, []);

  const TopUpWithdrawScreens = useMemo(() => {
    return (
      <>
        <Stack.Screen name={ScreenNames.topUp} component={TopUpScreen} />
        <Stack.Screen name={ScreenNames.withdraw} component={Withdraw} />
        <Stack.Screen name={ScreenNames.otp} component={OTP} />
        <Stack.Screen
          name={ScreenNames.withdrawFromAccount}
          component={WithdrawFromAccount}
        />
        <Stack.Screen
          name={ScreenNames.paymentMethod}
          component={PaymentMethod}
        />
        <Stack.Screen
          name={ScreenNames.paymentWebview}
          component={PaymentWebview}
        />
        <Stack.Screen name={ScreenNames.linkAccount} component={LinkAccount} />
        <Stack.Screen name={ScreenNames.bankAccount} component={BankAccount} />
        <Stack.Screen
          name={ScreenNames.linkSocialNetwork}
          component={LinkAccountSocial}
        />
        <Stack.Screen
          name={ScreenNames.productIntro}
          component={ProductIntro}
        />
      </>
    );
  }, []);

  const AssetsStack = useCallback(() => {
    return (
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name={ScreenNames.assets} component={Assets} />

        <Stack.Screen
          name={ScreenNames.convertScreen}
          component={ConvertScreen}
        />
        <Stack.Screen
          name={ScreenNames.accumulatedAssets}
          component={AccumulatedAssets}
        />
        <Stack.Screen
          name={ScreenNames.contractDetail}
          component={ContractDetail}
        />
        <Stack.Screen name={ScreenNames.bookDetail} component={BookDetail} />
        <Stack.Screen
          name={ScreenNames.transactions}
          component={Transactions}
        />
        <Stack.Screen
          name={ScreenNames.listAccumulatorBook}
          component={ListAccumulatorBook}
        />
        <Stack.Screen
          name={ScreenNames.transactionDetail}
          component={TransactionDetail}
        />
        <Stack.Screen
          name={ScreenNames.transactionInBook}
          component={TransactionInBook}
        />
        <Stack.Screen name={ScreenNames.cashFlow} component={CashFlow} />
        <Stack.Screen
          name={ScreenNames.investAccumulate}
          component={InvestAccumulate}
        />
        <Stack.Screen name={ScreenNames.introduce} component={Introduce} />
        <Stack.Screen
          name={ScreenNames.transferScreen}
          component={TransferScreen}
        />
        <Stack.Screen
          name={ScreenNames.tempTransactionInBook}
          component={TempTransactionInBook}
        />
        {TopUpWithdrawScreens}
      </Stack.Navigator>
    );
  }, [TopUpWithdrawScreens]);

  const ProductStack = useCallback(() => {
    return (
      <Stack.Navigator
        screenOptions={screenOptions}
        initialRouteName={Languages.tabs.product}
      >
        <Stack.Screen name={ScreenNames.product} component={Product} />
        <Stack.Screen
          name={ScreenNames.inviteCustomer}
          component={InviteCustomer}
        />
        <Stack.Screen
          name={ScreenNames.introProduct}
          component={IntroProduct}
        />
        <Stack.Screen name={ScreenNames.login} component={Login} />
        <Stack.Screen name={ScreenNames.signUp} component={SignUp} />
        <Stack.Screen name={ScreenNames.account} component={Account} />
        <Stack.Screen
          name={ScreenNames.informationAccount}
          component={InformationAccount}
        />
        <Stack.Screen
          name={ScreenNames.identifyConfirm}
          component={IdentifyConfirm}
        />
        <Stack.Screen name={ScreenNames.editProfile} component={EditProfile} />
        <Stack.Screen
          name={ScreenNames.inviteFriends}
          component={InviteCustomer}
        />
        <Stack.Screen
          name={ScreenNames.quickAuthentication}
          component={QuickAuThen}
        />
        <Stack.Screen name={ScreenNames.changePwd} component={ChangePassword} />
        <Stack.Screen name={ScreenNames.notification} component={Notification} />
        <Stack.Screen name={ScreenNames.notificationOld} component={NotificationOld} />
        <Stack.Screen
          name={ScreenNames.NotificationDetail}
          component={NotificationDetail}
        />
        <Stack.Screen name={ScreenNames.e_contract} component={EContract} />
        <Stack.Screen
          name={ScreenNames.transferScreen}
          component={TransferScreen}
        />
        <Stack.Screen
          name={ScreenNames.detailCustomer}
          component={DetailCustomer}
        />
        <Stack.Screen
          name={ScreenNames.takeCareCustomer}
          component={TakeCareCustomer}
        />
        <Stack.Screen
          name={ScreenNames.consultantInfo}
          component={ConsultantInfo}
        />
        {TopUpWithdrawScreens}
      </Stack.Navigator>
    );
  }, [TopUpWithdrawScreens]);

  const HelpStack = useCallback(() => {
    return (
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name={ScreenNames.help} component={Help} />
      </Stack.Navigator>
    );
  }, []);

  const Tabs = useCallback(
    () => (
      <Tab.Navigator screenOptions={screenOptions} tabBar={renderTabBar}>
        <Tab.Screen
          name={Languages.tabs.product}
          component={ProductStack}
          options={getOption}
        />
        <Tab.Screen
          name={Languages.tabs.assets}
          component={AssetsStack}
          options={getOption}
        />
        <Tab.Screen
          name={Languages.tabs.transactions}
          component={Transactions}
          options={getOption}
        />
        <Tab.Screen
          name={Languages.tabs.help}
          component={HelpStack}
          options={getOption}
        />
      </Tab.Navigator>
    ),
    [AssetsStack, HelpStack, ProductStack, getOption, renderTabBar]
  );

  const AppStack = useCallback(() => {
    return (
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name={ScreenNames.splash} component={Splash} />
        <Stack.Screen name={ScreenNames.onboarding} component={Onboarding} />
        <Stack.Screen name={ScreenNames.tabs} component={Tabs} />
        <Stack.Screen name={ScreenNames.auth} component={AuthStack} />
        <Stack.Screen name={ScreenNames.myWebview} component={MyWebview} />
      </Stack.Navigator>
    );
  }, [AuthStack, Tabs]);

  const renderRootStack = useMemo(() => {
    return <AppStack />;
  }, [AppStack]);

  return renderRootStack;
});

export default RootStack;
