// export const baseUrlUsaWin = "https://sudhirtest.mobileappdemo.net";
export const baseUrlUsaWin = "https://root.cloudwallet.pro";
export const configModalUsaWin = `${baseUrlUsaWin}/api/`

const apis = {

  // Auth api
  login: `${configModalUsaWin}login`,
  register: `${configModalUsaWin}register`,

  // forget password
  forget_password: `${configModalUsaWin}forget_password`,
  verify_forget_password: `${configModalUsaWin}verify_forget_password`,

  // Otp Verification 
  verify_otp: `${configModalUsaWin}verify-otp`,

  // Transaction_history
  Transaction_history: `${configModalUsaWin}Transaction_history`,
  users_transaction_history: `${configModalUsaWin}users_transaction_history`,

  // Profile api
  get_profile: `${configModalUsaWin}profile`,
  update_profile: `${configModalUsaWin}update_profile`,
  change_password: `${configModalUsaWin}change_password`,

  // deposit api
  deposit_request:`${configModalUsaWin}deposit_request`,
  qrview:`${configModalUsaWin}qrview`,

  // add bank account details
  bankdetails:`${configModalUsaWin}bankdetails`,
  add_bank_account:`${configModalUsaWin}add_bank_account`,

   // withdeawal api
  withdraw_request:`${configModalUsaWin}withdraw_request`,


  //notofication
  user_notifications:`${configModalUsaWin}user_notifications`,



}

export default apis