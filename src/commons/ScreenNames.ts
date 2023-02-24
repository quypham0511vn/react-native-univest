import Languages from "./Languages";

const ScreenNames = {
  splash: "Splash",
  onboarding: "Onboarding",
  tabs: "Tabs",
  auth: "Auth",
  home: "Home",
  myWebview: "MyWebview",
  paymentWebview: "PaymentWebview",
  product: "Product",
  introProduct: "IntroProduct",
  news: "News",
  transactions: "Transactions",
  topUp: "TopUpScreen",
  withdraw: "Withdraw",
  assets: "Assets",
  help: "Help",
  login: "Login",
  updateNewPwd: "UpdateNewPwd",
  confirmPhoneNumber: "confirmPhoneNumber",
  accumulatedAssets: "AccumulatedAssets",
  introduce: "Introduce",
  account: "Account",
  informationAccount: "InformationAccount",
  convertScreen: "ConvertScreen",
  contractDetail: "ContractDetail",
  quickAuthentication: "QuickAuthencation",
  changePwd: "ChangePwd",
  bookDetail: "BookDetail",
  editProfile: "EditProfile",
  inviteFriends: "InviteFriends",
  manual: "Manual",
  questions: "Questions",
  paymentMethod: "PaymentMethod",
  withdrawFromAccount: "WithdrawFromAccount",
  linkAccount: "LinkAccount",
  cashFlow: "CashFlow",
  loginWithTouchId: "LoginWithTouchId",
  notification: "Notification",
  notificationOld: "NotificationOld",
  NotificationDetail: "NotificationDetail",
  e_contract: "EContract",
  setPinCode: "SetPinCode",
  otp: "OTP",
  identifyConfirm: "identifyConfirm",
  bankAccount: "BankAccount",
  listAccumulatorBook: "ListAccumulatorBook",
  transactionDetail: "TransactionDetail",
  transactionInBook: "TransactionInBook",
  linkSocialNetwork: "LinkSocialNetWork",
  signUp: "SignUp",
  investAccumulate: "InvestAccumulate",
  loginWithBiometry: "LoginWithBiometry",
  productIntro: "ProductIntro",
  transferScreen: "TransferScreen",
  tempTransactionInBook: "TempTransactionInBook",
  inviteCustomer: "InviteCustomer",
  takeCareCustomer: "TakeCareCustomer",
  detailCustomer: "DetailCustomer",
  consultantInfo: "ConsultantInfo",
};

export default ScreenNames;

export const TabNamesArray = [
  Languages.tabs.product,
  Languages.tabs.assets,
  Languages.tabs.transactions,
  Languages.tabs.help,
];

export const TabNames = {
  homeTab: TabNamesArray[0],
  assetsTab: TabNamesArray[1],
  transactionsTab: TabNamesArray[2],
  accountTab: TabNamesArray[3],
};

export const TabNamesMatch = {
  'homeTab': TabNamesArray[0],
  'assetsTab': TabNamesArray[1],
  'transactionsTab': TabNamesArray[2],
  'accountTab': TabNamesArray[3],
};