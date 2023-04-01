const httpStatus = require("http-status");
const { DonationCollection } = require("../collections");
const AuthCollaction = require("../collections/Auth.Collaction");
const VoucherCollection = require("../collections/Voucher.Collection");
const { voucherController } = require("../controllers");
const ApiError = require("../utils/ApiError");

const generateReceiptNo = (lastID) => {
  const currentYear = new Date().getFullYear();
  let receiptNo = `CASH${currentYear}-0000${lastID + 1}`;
  return receiptNo;
};

const generateElcVoucherNo = (lastID) => {
  const currentYear = new Date().getFullYear();
  let VoucherNo = `Elec${currentYear}-0000${lastID + 1}`;
  return VoucherNo;
};

const generateElcReceiptNo = (lastID) => {
  const currentYear = new Date().getFullYear();
  let previousyear = currentYear - 1;
  let receiptNo = `${previousyear}-${currentYear}-0000${lastID + 1}`;
  return receiptNo;
};

const addNewDonation = async (req) => {
  let { MODE_OF_DONATION } = req.body;
  // MODE_OF_DONATION = 2 //cheq //1 online
  console.log(MODE_OF_DONATION);
  let data;
  if (MODE_OF_DONATION == 1) {
    data = 5;
  } else if (MODE_OF_DONATION == 2) {
    console.log("enteered");
    data = 6;
  }
  let receipt = await VoucherCollection.getReceipt(data);
  // console.log(receipt);
  const donation = await DonationCollection.addNewDonation(req, receipt);

  return donation;
};

const delDonation = async (req) => {
  const donation = await DonationCollection.delDonation(req);

  return donation;
};

const searchDonation = async (req) => {
  const donation = await DonationCollection.searchDonation(req);

  return donation;
};

const searchElectric = async (req) => {
  const donation = await DonationCollection.searchElectric(req);

  return donation;
};

const searchManual = async (req) => {
  const donation = await DonationCollection.searchManual(req);

  return donation;
};

const searchOnlineCheque = async (req) => {
  const donation = await DonationCollection.searchOnlineCheque(req);

  return donation;
};

const dashAdminTotal = async (req)=>{
  const donation = await DonationCollection.dashAdminTotal(req);

  return donation;
}
const dashemployeeTotal = async (req)=>{
  const donation = await DonationCollection.dashemployeeTotal(req);

  return donation;
}

const dashAdminTotalManual = async (req)=>{
  const donation = await DonationCollection.dashAdminTotalManual(req);

  return donation;
}

const dashemployeeTotalManual = async (req)=>{
  const donation = await DonationCollection.dashemployeeTotalManual(req);

  return donation;
}

const dashAdminTotalOnline = async (req)=>{
  const donation = await DonationCollection.dashAdminTotalOnline(req);

  return donation;
}

const dashemployeeTotalOnline = async (req)=>{
  const donation = await DonationCollection.dashemployeeTotalOnline(req);

  return donation;
}
const SpecificsearchOnlinecheque = async (req) => {
  const donation = await DonationCollection.SpecificsearchOnlinecheque(req);

  return donation;
};
const editDonation = async (req) => {
  const donation = await DonationCollection.editDonation(req);

  return donation;
};

const manualsearchDonation = async (req) => {
  const donation = await DonationCollection.manualsearchDonation(req);

  return donation;
};


const addelecDonation = async (req) => {
  let voucherNo;
  let vno;
  let lastID;

  lastID = await DonationCollection.getElecLastID();
  vno = lastID + 1;

  voucherNo = parseInt(vno).toLocaleString("en-US", {
    minimumIntegerDigits: 4,
    useGrouping: false,
  });

  let checkVoucherNumber = await DonationCollection.checkVoucherNumberExists(
    voucherNo
  );

  if (checkVoucherNumber) {
    console.log(Number(voucherNo) + 1, "NUMBER VOUCHER");
    let exist = Number(voucherNo) + 1;
    let fk = parseInt(exist).toLocaleString("en-US", {
      minimumIntegerDigits: 4,
      useGrouping: false,
    });

    while (await DonationCollection.checkVoucherNumberExists(fk)) {
      let nV = Number(voucherNo) + 1;
      fk = parseInt(nV).toLocaleString("en-US", {
        minimumIntegerDigits: 4,
        useGrouping: false,
      });
      voucherNo = fk;
    }
  } else {
    console.log("NO ALREADY VIYCHER EXIRTS");
  }

  let isCancelled = await DonationCollection.getCancelledVoucher(voucherNo)
  let check ;
  console.log(isCancelled,"cancel",voucherNo)
  if (isCancelled){
    console.log("isCancelled")
    let nV = Number(voucherNo) + 1;
      fk = parseInt(nV).toLocaleString("en-US", {
        minimumIntegerDigits: 4,
        useGrouping: false,
      });
      
    check = await VoucherCollection.checkVoucher(req, fk);
  }else{
    check = await VoucherCollection.checkVoucher(req, voucherNo);
    console.log(check)
  }

if(check.data){
  let verifyIscancelled = await DonationCollection.getCancelledVoucher(check.data)
  if(verifyIscancelled){
    check.data = check.data + 1
  }
}
 
  if (check?.status !== false) {
    let ElecDonation;
  
    let receipt = await VoucherCollection.getReceipt(req.body.modeOfDonation);
    console.log(receipt,"increm");
    if (check?.data) {
      let vou = parseInt(check?.data).toLocaleString("en-US", {
        minimumIntegerDigits: 4,
        useGrouping: false,
      });

      let exist = Number(vou)
      console.log(exist,"exist");
    let fk = parseInt(exist).toLocaleString("en-US", {
      minimumIntegerDigits: 4,
      useGrouping: false,
    });
    while (await DonationCollection.checkVoucherNumberExists(fk)) {
      let nV = Number(fk) + 1;
      fk = parseInt(nV).toLocaleString("en-US", {
        minimumIntegerDigits: 4,
        useGrouping: false,
      });
      console.log(fk,"final np")
      vou = fk;
    }
    console.log("heee")
      ElecDonation = await DonationCollection.addElecDonation(
        req,
        vou,
        receipt,
        (assV = true)
      );

      return ElecDonation;
    } else {

      ElecDonation = await DonationCollection.addElecDonation(
        req,
        voucherNo,
        receipt,
        (assV = false)
      );
      return ElecDonation;
    }
  } else if (check?.status === false && req.user.role_id === 1) {
    console.log("enter");
    let receipts = await VoucherCollection.getReceipt(req.body.modeOfDonation);
    ElecDonation = await DonationCollection.addElecDonation(
      req,
      voucherNo,
      receipts,
      (assV = false)
    );
    return ElecDonation;
  }

};

const addmanualDonation = async (req) => {
  let manualDonation = await DonationCollection.addManuaDonation(req);
  return manualDonation;
};

const delElecDonation = async (req) => {
  const ElecDonation = await DonationCollection.delElecDonation(req);
  console.log(ElecDonation);
  return ElecDonation;
};

const getElecDonation = async (req) => {
  const data = await DonationCollection.getElecDonation(req);
  return data;
};

const editElecDonation = async (req) => {
  const data = await DonationCollection.editElecDonation(req);
  return data;
};

const editcashDonation = async (req) => {
  const data = await DonationCollection.editcashDonation(req);
  return data;
};

const editChequeDonation = async (req) => {
  const data = await DonationCollection.editChequeDonation(req);
  return data;
};
const editItemDonation = async (req) => {
  const data = await DonationCollection.editItemDonation(req);
  return data;
};

const editmanualElecDonation = async (req) => {
  const data = await DonationCollection.editManualElecDonation(req);
  return data;
};

const editmanualcashDonation = async (req) => {
  const data = await DonationCollection.editManualcashDonation(req);
  return data;
};

const editmanualChequeDonation = async (req) => {
  const data = await DonationCollection.editManualChequeDonation(req);
  return data;
};
const editmanualItemDonation = async (req) => {
  const data = await DonationCollection.editManualItemDonation(req);
  return data;
};

const getElecDonationbyID = async (req) => {
  const data = await DonationCollection.getElecDonationbyId(req);
  return data;
};

const cashDonation = async (req) => {
  const lastID = await DonationCollection.getLastID();
  const receiptNo = generateReceiptNo(lastID);
  const donation = await DonationCollection.adddonation(req, receiptNo);
  return donation;
};

const list = async (req) => {
  const record = await DonationCollection.newDonationRecord(req);
  return record;
};

const getItemList = async () => {
  const list = await DonationCollection.getItemList();
  return list;
};

const allList = async (req) => {
  const record = await DonationCollection.allDonationRecord(req);
  return record;
};

const getDonationType = async (req) => {
  const donationType = await DonationCollection.getDonationType(req);
  return donationType;
};

const getAdminDonationType = async (req) => {
  const donationType = await DonationCollection.getAdminDonationType(req);
  return donationType;
};

const addDonationType = async (req) => {
  let isUnique = await DonationCollection.checkDonationType(req)
 console.log(isUnique)
  if(isUnique.length > 0) {
    throw new ApiError(httpStatus.CONFLICT,"Donation Type is already Exists")
  }
  const donationType = await DonationCollection.addDonationType(req);
  return donationType;
};

const getAllocatedVoucherList = async (req)=>{
  const donationType = await DonationCollection.getAllocatedVoucherList(req);
  return donationType;
}

const DelDonationType = async (req) => {
  const donationType = await DonationCollection.delDonationType(req);
  return donationType;
};

const changeDonationType = async (req) => {
  const donationType = await DonationCollection.changeDonationType(req);
  return donationType;
};
const EditDonationType = async (req) => {
  const donationType = await DonationCollection.EditDonationType(req);
  return donationType;
};

const isChequeDownload = async (req) => {
  //checking the users assigned vouchers
  const status = await DonationCollection.isChequeDownload(req);
  return status;
};

const ChangeChequeStatus = async (req) => {
  const data = await DonationCollection.ChangeChequeStatus(req);
  return data;
};

const ChangeElecStatus = async (req) => {
  const data = await DonationCollection.ChangeElecStatus(req);
  return data;
};

const ChangemanualDonation = async (req) => {
  const data = await DonationCollection.ChangemanualDonation(req);
  return data;
};

const savePaymentDetails = async (req) => {
  const data = await DonationCollection.savePaymentDetails(req);
  try {
    return data;
  } catch (error) {
    return null;
  }
};

const getuserBynum = async (req) => {
  const user = await DonationCollection.getuserBynum(req);

  return user;
};

const getuserBynumManual  = async (req) => {
  const user = await DonationCollection.getuserBynumManual(req);

  return user;
};

const donationReport = async (req) => {
  const report = await DonationCollection.donationReport(req);

  return report;
};

const manualdonationReport = async (req) => {
  const report = await DonationCollection.manualdonationReport(req);

  return report;
};

const onlineDonationReport = async (req) => {
  const report = await DonationCollection.onlineDonationReport(req);

  return report;
};

const searchAllDonation = async (req) => {
  const report = await DonationCollection.searchAllDonation(req);

  return report;
};



const userDonationAmount = async (req) => {
  const report = await DonationCollection.userDonationAmount(req);

  return report;
};

const searchmanualAllDonation = async (req) => {
  const report = await DonationCollection.searchmanualAllDonation(req);

  return report;
};


const manualuserDonationAmount = async (req) => {
  const report = await DonationCollection.manualuserDonationAmount(req);

  return report;
};

const onlineuserDonationAmount = async (req) => {
  const report = await DonationCollection.onlineuserDonationAmount(req);

  return report;
};

const centralizeduserDonationAmount = async (req) => {
  const report = await DonationCollection.centralizeduserDonationAmount(req);

  return report;
};

const employeeChangePass  = async (req) => {



  const report = await DonationCollection.employeeChangePass(req);

  return report;
};


const getManualDonation = async (req) => {
  const report = await DonationCollection.getManualDonation(req);

  return report;
};

const cancelEachVoucher = async (req) => {
  const report = await DonationCollection.cancelEachVoucher(req);

  return report;
};

module.exports = {
  cancelEachVoucher,
  cashDonation,
  userDonationAmount,
  list,
  getManualDonation,
  getItemList,
  allList,
  addNewDonation,
  addelecDonation,
  manualuserDonationAmount,
  getElecDonation,
  delElecDonation,
  getElecDonationbyID,
  getDonationType,
  addDonationType,
  isChequeDownload,
  DelDonationType,
  EditDonationType,
  ChangeChequeStatus,
  ChangemanualDonation,
  editElecDonation,
  searchmanualAllDonation,
  getuserBynumManual,
  editmanualElecDonation,
  delDonation,
  manualdonationReport,
  onlineuserDonationAmount,
  dashAdminTotalManual,
  centralizeduserDonationAmount,
  editDonation,
  changeDonationType,
  ChangeElecStatus,
  onlineDonationReport,
  generateElcVoucherNo,
  editcashDonation,
  editItemDonation,
  editChequeDonation,
  SpecificsearchOnlinecheque,
  editmanualcashDonation,
  editmanualItemDonation,
  editmanualChequeDonation,
  savePaymentDetails,
  searchDonation,
  getuserBynum,
  donationReport,
  manualsearchDonation,
  searchAllDonation,
  addmanualDonation,
  employeeChangePass,
  getAdminDonationType,
  getAllocatedVoucherList,
  searchManual,
  searchElectric,
  dashAdminTotal,
  dashAdminTotalOnline,
  searchOnlineCheque,
  dashemployeeTotal,
  dashemployeeTotalManual,
  dashemployeeTotalOnline
};
