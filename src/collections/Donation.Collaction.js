const { sequelize, QueryTypes, Op } = require("sequelize");
const sequelizes = require("../db/db-connection");
const { VoucherCollection } = require(".");
const { voucherController } = require("../controllers");
const uploadimage = require("../middlewares/imageupload");
const db = require("../models");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/ApiError");
const sendSms = require("../utils/Sendsms");
const httpStatus = require("http-status");
const { request } = require("http");

db.donationModel.hasMany(db.donationItem, {
  foreignKey: "donationId",
  as: "itemDetails",
});
db.donationItem.belongsTo(db.donationModel, {
  foreignKey: "donationId",
  as: "donationDetail",
});

/// electric donation relationship
db.ElecDonationModel.hasMany(db.ElecDonationItem, {
  foreignKey: "donationId",
  as: "elecItemDetails",
});
db.ElecDonationItem.belongsTo(db.ElecDonationModel, {
  foreignKey: "donationId",
  as: "elecDonationDetail",
});

/// electric donation relationship

//manual
db.ManualDonation.hasMany(db.ManualDonationItem, {
  foreignKey: "donationId",
  as: "manualItemDetails",
});
db.ManualDonationItem.belongsTo(db.ManualDonation, {
  foreignKey: "donationId",
  as: "manualDonationDetail",
});
//manual

const TblDonation = db.donationModel;
const TblDonationItem = db.donationItem;
const itemList = db.itemList;
const TblNewDonation = db.newDonationModel;
const TblelecDonation = db.ElecDonationModel;
const TblelecDonationItem = db.ElecDonationItem;
const TblEmployees = db.employees;
const TblDonationTypes = db.donationTypes;
const TblVouchers = db.Vouchers;
const TblUsers = db.userModel;
const TblmanualDonation = db.ManualDonation;
const TblmanualDonationItem = db.ManualDonationItem;
const TblAdmin = db.admin;
const TblCancelVoucher = db.cancelVouchers;

class DonationCollaction {
  addNewDonation = async (req, receipt) => {
    const {
      NAME,
      MODE_OF_DONATION,
      AMOUNT,
      MobileNo,
      GENDER,
      CHEQUE_NO,
      DATE_OF_CHEQUE,
      NAME_OF_BANK,
      PAYMENT_ID,
      DATE_OF_DAAN,
      TIME_OF_DAAN,
      TYPE,
      REMARK,
      ADDRESS,
    } = req.body;
    // console.log(receipt)
    let IMG = "";

    let active = "";

    let donationType = "ONLINE";

    if (MODE_OF_DONATION == 2) {
      const { chequeImg } = req.files;
      donationType = "CHEQUE";
      active = "0";
      IMG = uploadimage(chequeImg);
    }

    let RECEIPT_NO = `${receipt}`;
    const userId = req.user.id;
    let user = await TblUsers.findOne({
      where: {
        id: userId,
      },
    });

    let result = null;
    result = await TblNewDonation.create({
      NAME,
      RECEIPT_NO,
      MODE_OF_DONATION: donationType,
      AMOUNT,
      CHEQUE_NO,
      GENDER,
      MobileNo,
      DATE_OF_CHEQUE,
      TIME_OF_DAAN,
      NAME_OF_BANK,
      PAYMENT_ID,
      TYPE,
      ADDRESS,
      REMARK,
      IMG,
      active,
      DATE_OF_DAAN,
      ADDED_BY: userId,
    }).catch((err) => {
      // console.log(err);
    });
    if (!result) {
      return null;
    }
    return result;
  };

  adddonation = async (req, receiptNo) => {
    const {
      name,
      phoneNo,
      address,
      new_member,
      donation_date,
      donation_time,
      donation_item,
    } = req.body;
    const userId = req.user.id;
    const result = await TblDonation.create({
      name,
      phoneNo,
      receiptNo,
      address,
      new_member,
      donation_date,
      donation_time,
      created_by: userId,
      created_name: req.user.id,
    })
      .then(async (res) => {
        let final = [];
        donation_item.forEach((e) => {
          final.push({
            donationId: res.id,
            itemId: e.item,
            amount: e.amount,
            remark: e.remark,
          });
        });
        await TblDonationItem.bulkCreate(final).then((resp) => {
          res.dataValues["item_details"] = resp;
        });
        return {
          status: 1,
          message: "Created Successfully",
          data: res.dataValues,
        };
      })
      .catch((err) => {
        return {
          status: 1,
          message: "Something wrong!",
          data: res.err,
        };
      });
    return result;
  };

  delDonation = async (req) => {
    let { id, mode } = req.query;

    if (mode == 2) {
      mode = "CHEQUE";
    } else {
      mode = "ONLINE";
    }

    console.log(mode, id);
    const result = await TblNewDonation.destroy({
      where: {
        id: id,
        MODE_OF_DONATION: mode,
      },
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err, "err");
        return {
          status: 1,
          message: "Something wrong!",
        };
      });
    return result;
  };

  editDonation = async (req) => {
    const {
      NAME,
      MODE_OF_DONATION,
      AMOUNT,
      CHEQUE_NO,
      DATE_OF_CHEQUE,
      NAME_OF_BANK,
      PAYMENT_ID,
      DATE_OF_DAAN,
      TYPE,
      REMARK,
      ADDRESS,
      ID,
    } = req.body;

    let mode;
    let IMG = "";

    if (MODE_OF_DONATION == 1) {
      mode = "ONLINE";
    } else {
      const { chequeImg } = req.files;

      IMG = uploadimage(chequeImg);
      mode = "CHEQUE";
    }

    let result = await TblNewDonation.update(
      {
        NAME: NAME,
        AMOUNT: AMOUNT,
        CHEQUE_NO: CHEQUE_NO,
        DATE_OF_CHEQUE: DATE_OF_CHEQUE,
        NAME_OF_BANK: NAME_OF_BANK,
        PAYMENT_ID: PAYMENT_ID,
        DATE_OF_DAAN: DATE_OF_DAAN,
        TYPE: TYPE,
        REMARK: REMARK,
        ADDRESS: ADDRESS,
        IMG: IMG,
      },

      {
        where: {
          id: ID,
          MODE_OF_DONATION: mode,
        },
      }
    );
    return result;
  };

  searchDonation = async (req) => {
    const {
      name,
      date,
      type,
      phone,
      fromDate,
      toDate,
      modeOfDonation,
      fromVoucher,
      toVoucher,
    } = req.query;

    let whereClause = {};
    let include = [];
    let whereClauseInc = {};

    let from = new Date(fromDate);
    let to = new Date(toDate);

    if (name) {
      whereClause.name = { [Op.regexp]: `^${name}.*` };
      whereClause.modeOfDonation = modeOfDonation;
    }

    if (date) {
      whereClause.donation_date = date;
      whereClause.modeOfDonation = modeOfDonation;
    }
    if (fromDate && toDate) {
      whereClause.donation_date = { [Op.between]: [from, to] };
      whereClause.modeOfDonation = modeOfDonation;
    }

    if (fromVoucher && toVoucher) {
      whereClause.voucherNo = { [Op.between]: [fromVoucher, toVoucher] };
      whereClause.modeOfDonation = modeOfDonation;
    }

    if (phone) {
      whereClause.phoneNo = { [Op.regexp]: `^${phone}.*` };
      whereClause.modeOfDonation = modeOfDonation;
    }

    if (type) {
      whereClauseInc.type = type;
      whereClause.modeOfDonation = modeOfDonation;
    }

    include = [
      {
        model: TblelecDonationItem,
        as: "elecItemDetails",
        where: whereClauseInc,
      },
    ];
    console.log(whereClause);

    let data = await TblelecDonation.findAll({
      where: whereClause,
      include: include,
      group: ["tbl_elec_donation.id"],
    });

    console.log(data);
    return data;
  };

  manualsearchDonation = async (req) => {
    const {
      name,
      date,
      type,
      fromDate,
      toDate,
      phone,
      modeOfDonation,
      fromRecp,
      toRecp,
    } = req.query;

    let from = new Date(fromDate);
    let to = new Date(toDate);

    let whereClause = {};
    let include = [];
    let whereClauseInc = {};

    if (name) {
      whereClause.name = { [Op.regexp]: `^${name}.*` };
      whereClause.modeOfDonation = modeOfDonation;
    }

    if (date) {
      whereClause.donation_date = date;
      whereClause.modeOfDonation = modeOfDonation;
    }

    if (fromDate && toDate) {
      whereClause.donation_date = { [Op.between]: [from, to] };
      whereClause.modeOfDonation = modeOfDonation;
    }

    if (fromRecp && toRecp) {
      whereClause.ReceiptNo = { [Op.between]: [fromRecp, toRecp] };
      whereClause.modeOfDonation = modeOfDonation;
    }
    if (phone) {
      whereClause.phoneNo = { [Op.regexp]: `^${phone}.*` };
      whereClause.modeOfDonation = modeOfDonation;
    }

    if (type) {
      whereClauseInc.type = type;
      whereClause.modeOfDonation = modeOfDonation;
    }

    include = [
      {
        model: TblmanualDonationItem,
        as: "manualItemDetails",
        where: whereClauseInc,
      },
    ];
    console.log(whereClause);

    let data = await TblmanualDonation.findAll({
      where: whereClause,
      include: include,
      group: ["tbl_manual_donation.id"],
    });

    console.log(data);
    return data;
  };

  searchAllDonation = async (req) => {
    const { employeeid, fromDate, toDate, fromVoucher, toVoucher, type } =
      req.query;
    let whereClause = {};
    const include = [
      {
        model: TblelecDonationItem,
        as: "elecItemDetails",
        attributes: [
          "id",
          "donationId",
          "type",
          "amount",
          "ChequeNo",
          "branch",
          "BankName",
          "transactionNo",
          "ChequeDate",
          "remark",
          "size",
          "itemType",
          "quantity",
          "approxValue",
          "createdAt",
          "updatedAt",
        ],
      },
    ];

    if (employeeid) {
      whereClause.created_by = employeeid;
    }

    if (fromDate && toDate) {
      whereClause.donation_date = { [Op.between]: [fromDate, toDate] };
    }

    if (fromVoucher && toVoucher) {
      whereClause.voucherNo = { [Op.between]: [fromVoucher, toVoucher] };
    }

    if (type) {
      include[0].where = { [Op.or]: [{ type }, { itemType: type }] };
    }

    const donations = await TblelecDonation.findAll({
      where: whereClause,
      include: include,
      group: ["tbl_elec_donation.id"],
    });

    return donations;
  };

  searchmanualAllDonation = async (req) => {
    const { employeeid, fromDate, toDate, fromReceipt, toReceipt, type } =
      req.query;
    let whereClause = {};
    const include = [
      {
        model: TblmanualDonationItem,
        as: "manualItemDetails",
        attributes: [
          "id",
          "donationId",
          "type",
          "amount",
          "ChequeNo",
          "branch",
          "BankName",
          "transactionNo",
          "ChequeDate",
          "remark",
          "size",
          "itemType",
          "quantity",
          "approxValue",
          "createdAt",
          "updatedAt",
        ],
      },
    ];

    if (employeeid) {
      whereClause.created_by = employeeid;
    }

    if (fromDate && toDate) {
      whereClause.donation_date = { [Op.between]: [fromDate, toDate] };
    }

    if (fromReceipt && toReceipt) {
      whereClause.ReceiptNo = { [Op.between]: [fromReceipt, toReceipt] };
    }

    if (type) {
      include[0].where = { [Op.or]: [{ type }, { itemType: type }] };
    }

    const donations = await TblmanualDonation.findAll({
      where: whereClause,
      include: include,
      group: ["tbl_manual_donation.id"],
    });

    return donations;
  };

  delElecDonation = async (req) => {
    let id = req.query.id;
    console.log(id);

    let deleteReq = await TblelecDonation.destroy({
      where: {
        id: id,
      },
    })
      .then(async (res) => {
        await TblelecDonationItem.destroy({
          where: {
            donationId: id,
          },
        });
        return {
          status: 1,
          message: "deleted successfully",
        };
      })
      .catch((err) => {
        return {
          status: 1,
          message: "Something went wrong",
        };
      });
    return deleteReq;
  };

  checkVoucherNumberExists = async (voucherNo) => {
    let checkVoucherNumber = await TblelecDonation.findOne({
      where: {
        voucherNo: voucherNo,
      },
    });
    return checkVoucherNumber;
  };

  addElecDonation = async (req, voucherNo, receipt, assv) => {
    try {
      const {
        gender,
        name,
        phoneNo,
        address,
        new_member,
        modeOfDonation,
        donation_date,
        donation_time,
        donation_item,
      } = req.body;

      const userId = req.user.id;
      console.log(userId);
      console.log("voucherCOMING", voucherNo);

      const ReceiptNo = `${receipt}`;

      let vD = await TblVouchers.findOne({
        where: {
          status: true,
          assign: userId,
        },
      });

      const result = await TblelecDonation.create({
        name,
        gender,
        phoneNo,
        address,
        voucherNo,
        ReceiptNo,
        new_member,
        modeOfDonation,
        donation_date,
        donation_time,
        donation_item,
        created_by: userId,
        isAdmin: req.user.isAdmin,
      })
        .then(async (res) => {
          let ElecDonationItems = [];
          donation_item.forEach((e) => {
            if (modeOfDonation === 1) {
              ElecDonationItems.push({
                donationId: res.id,
                type: e.type,
                amount: e.amount,
                remark: e.remark,
                transactionNo: e.transactionNo,
                BankName: e.BankName,
              });
            } else if (modeOfDonation === 2) {
              ElecDonationItems.push({
                donationId: res.id,
                type: e.type,
                amount: e.amount,
                remark: e.remark,
              });
            } else if (modeOfDonation === 3) {
              ElecDonationItems.push({
                donationId: res.id,
                type: e.type,
                amount: e.amount,
                remark: e.remark,
                ChequeNo: e.ChequeNo,
                branch: e.Branch,
                BankName: e.BankName,
                ChequeDate: e.ChequeDate,
              });
            } else if (modeOfDonation === 4) {
              ElecDonationItems.push({
                donationId: res.id,
                type: e.type,
                amount: e.amount,
                remark: e.remark,
                itemType: e.itemType,
                size: e.size,
                unit: e.unit,
                quantity: e.quantity,
                approxValue: e.approxValue,
              });
            }
          });
          await TblelecDonationItem.bulkCreate(ElecDonationItems).then(
            async (resp) => {
              console.log(voucherNo, "rea");
              if (resp && assv) {
                let incr = Number(voucherNo) + 1;
                console.log("voucher NICREMENTNG", incr);
                let newvoucherNo = parseInt(incr).toLocaleString("en-US", {
                  minimumIntegerDigits: 4,
                  useGrouping: false,
                });
                await TblVouchers.update(
                  {
                    voucher: vD.voucher === 0 ? voucherNo : newvoucherNo,
                  },
                  {
                    where: {
                      status: true,
                      assign: userId,
                    },
                  }
                );
              }
              res.dataValues["elecItemDetails"] = resp;
            }
          );
          return {
            status: 1,
            message: "Created Successfully",
            data: res.dataValues,
          };
        })
        .catch((err) => {
          console.log(err);
          return {
            status: 1,
            message: "Something wrong!",
            data: err,
          };
        });

      return result;
    } catch (err) {
      console.log(err);
      return {
        status: 1,
        message: err,
      };
    }
  };

  addManuaDonation = async (req) => {
    try {
      const {
        gender,
        name,
        phoneNo,
        address,
        new_member,
        modeOfDonation,
        donation_date,
        ReceiptNo,
        donation_time,
        donation_item,
      } = req.body;

      const userId = req.user.id;
      console.log(userId);

      const result = await TblmanualDonation.create({
        name,
        gender,
        phoneNo,
        address,
        ReceiptNo,
        new_member,
        modeOfDonation,
        donation_date,
        donation_time,
        donation_item,
        created_by: userId,
        isAdmin: req.user.isAdmin,
      })
        .then(async (res) => {
          let manualDonationItems = [];
          donation_item.forEach((e) => {
            if (modeOfDonation === 1) {
              manualDonationItems.push({
                donationId: res.id,
                type: e.type,
                amount: e.amount,
                remark: e.remark,
                transactionNo: e.transactionNo,
                BankName: e.BankName,
              });
            } else if (modeOfDonation === 2) {
              manualDonationItems.push({
                donationId: res.id,
                type: e.type,
                amount: e.amount,
                remark: e.remark,
              });
            } else if (modeOfDonation === 3) {
              manualDonationItems.push({
                donationId: res.id,
                type: e.type,
                amount: e.amount,
                remark: e.remark,
                ChequeNo: e.ChequeNo,
                branch: e.Branch,
                BankName: e.BankName,
                ChequeDate: e.ChequeDate,
              });
            } else if (modeOfDonation === 4) {
              manualDonationItems.push({
                donationId: res.id,
                type: e.type,
                amount: e.amount,
                remark: e.remark,
                itemType: e.itemType,
                size: e.size,
                unit: e.unit,
                quantity: e.quantity,
                approxValue: e.approxValue,
              });
            }
          });
          await TblmanualDonationItem.bulkCreate(manualDonationItems).then(
            async (resp) => {
              res.dataValues["manualItemDetails"] = resp;
            }
          );
          return {
            status: 1,
            message: "Created Successfully",
            data: res.dataValues,
          };
        })
        .catch((err) => {
          console.log(err);
          return {
            status: 1,
            message: "Something wrong!",
            data: err,
          };
        });

      return result;
    } catch (err) {
      return {
        status: 1,
        message: err,
      };
    }
  };

  editElecDonation = async (req) => {
    let data;
    const {
      id,
      name,
      phoneNo,
      address,
      new_member,
      donation_date,
      donation_time,
      modeOfDonation,
      donation_item,
    } = req.body;

    const userId = req.user.id;

    await TblelecDonation.update(
      {
        name: name,
        phoneNo: phoneNo,
        address: req.body.address,
        new_member: new_member,
        donation_date: donation_date,
        donation_time: donation_time,
      },
      {
        where: {
          // created_by: userId,
          id: id,
          // modeOfDonation: 1,
        },
      }
    ).then(async (res) => {
      donation_item.forEach(async (e) => {
        data = await TblelecDonationItem.update(
          {
            type: e.type,
            amount: e.amount,
            remark: e.remark,
            transactionNo: e.transactionNo,
            BankName: e.BankName,
          },

          {
            where: {
              donationId: id,
              id: e.id,
            },
          }
        );
      });
    });

    return {
      status: true,
      message: "updated Successfully",
    };
  };

  editcashDonation = async (req) => {
    let data;
    const {
      id,
      name,
      phoneNo,
      address,
      new_member,
      donation_date,
      donation_time,
      modeOfDonation,
      donation_item,
    } = req.body;

    const userId = req.user.id;

    await TblelecDonation.update(
      {
        name: name,
        phoneNo: phoneNo,
        address: address,
        new_member: new_member,
        donation_date: donation_date,
        donation_time: donation_time,
      },
      {
        where: {
          // created_by: userId,
          id: id,
          // modeOfDonation: 2,
        },
      }
    ).then(async (res) => {
      donation_item.forEach(async (e) => {
        data = await TblelecDonationItem.update(
          {
            type: e.type,
            amount: e.amount,
            remark: e.remark,
          },

          {
            where: {
              donationId: id,
              id: e.id,
            },
          }
        );
      });
    });

    return {
      status: true,
      message: "updated Successfully",
    };
  };

  editChequeDonation = async (req) => {
    let data;
    const {
      id,
      name,
      phoneNo,
      address,
      new_member,
      donation_date,
      donation_time,
      modeOfDonation,
      donation_item,
    } = req.body;

    const userId = req.user.id;

    await TblelecDonation.update(
      {
        name: name,
        phoneNo: phoneNo,
        address: address,
        new_member: new_member,
        donation_date: donation_date,
        donation_time: donation_time,
      },
      {
        where: {
          // created_by: userId,
          id: id,
          // modeOfDonation: 3,
        },
      }
    ).then(async (res) => {
      donation_item.forEach(async (e) => {
        data = await TblelecDonationItem.update(
          {
            type: e.type,
            amount: e.amount,
            remark: e.remark,
            ChequeNo: e.chequeNo,
            branch: e.Branch,
            BankName: e.BankName,
            ChequeDate: e.ChequeDate,
          },

          {
            where: {
              donationId: id,
              id: e.id,
            },
          }
        );
      });
    });

    return {
      status: true,
      message: "updated Successfully",
    };
  };

  editItemDonation = async (req) => {
    let data;
    const {
      id,
      name,
      phoneNo,
      address,
      new_member,
      donation_date,
      donation_time,
      modeOfDonation,
      donation_item,
    } = req.body;

    const userId = req.user.id;

    await TblelecDonation.update(
      {
        name: name,
        phoneNo: phoneNo,
        address: address,
        new_member: new_member,
        donation_date: donation_date,
        donation_time: donation_time,
      },
      {
        where: {
          // created_by: userId,
          id: id,
          // modeOfDonation: "4",
        },
      }
    ).then(async (res) => {
      donation_item.forEach(async (e) => {
        data = await TblelecDonationItem.update(
          {
            type: e.type,
            amount: e.amount,
            remark: e.remark,
            itemType: e.itemType,
            size: e.size,
            unit: e.unit,
            quantity: e.quantity,
            approxValue: e.approxValue,
          },

          {
            where: {
              donationId: id,
              id: e.id,
            },
          }
        );
      });
    });

    return {
      status: true,
      message: "updated Successfully",
    };
  };

  editManualElecDonation = async (req) => {
    let data;
    const {
      id,
      name,
      phoneNo,
      address,
      new_member,
      donation_date,
      donation_time,
      modeOfDonation,
      donation_item,
    } = req.body;

    const userId = req.user.id;

    await TblmanualDonation.update(
      {
        name: name,
        phoneNo: phoneNo,
        address: address,
        new_member: new_member,
        donation_date: donation_date,
        donation_time: donation_time,
      },
      {
        where: {
          // created_by: userId,
          id: id,
          // modeOfDonation: 1,
        },
      }
    ).then(async (res) => {
      donation_item.forEach(async (e) => {
        data = await TblmanualDonationItem.update(
          {
            type: e.type,
            amount: e.amount,
            remark: e.remark,
            transactionNo: e.transactionNo,
            BankName: e.BankName,
          },

          {
            where: {
              donationId: id,
              id: e.id,
            },
          }
        );
      });
    });

    return {
      status: true,
      message: "updated Successfully",
    };
  };

  editManualcashDonation = async (req) => {
    let data;
    const {
      id,
      name,
      phoneNo,
      address,
      new_member,
      donation_date,
      donation_time,
      modeOfDonation,
      donation_item,
    } = req.body;

    const userId = req.user.id;

    await TblmanualDonation.update(
      {
        name: name,
        phoneNo: phoneNo,
        address: address,
        new_member: new_member,
        donation_date: donation_date,
        donation_time: donation_time,
      },
      {
        where: {
          // created_by: userId,
          id: id,
          // modeOfDonation: 2,
        },
      }
    ).then(async (res) => {
      donation_item.forEach(async (e) => {
        data = await TblmanualDonationItem.update(
          {
            type: e.type,
            amount: e.amount,
            remark: e.remark,
          },

          {
            where: {
              donationId: id,
              id: e.id,
            },
          }
        );
      });
    });

    return {
      status: true,
      message: "updated Successfully",
    };
  };

  editManualChequeDonation = async (req) => {
    let data;
    const {
      id,
      name,
      phoneNo,
      address,
      new_member,
      donation_date,
      donation_time,
      modeOfDonation,
      donation_item,
    } = req.body;

    const userId = req.user.id;

    await TblmanualDonation.update(
      {
        name: name,
        phoneNo: phoneNo,
        address: address,
        new_member: new_member,
        donation_date: donation_date,
        donation_time: donation_time,
      },
      {
        where: {
          // created_by: userId,
          id: id,
          // modeOfDonation: 3,
        },
      }
    ).then(async (res) => {
      donation_item.forEach(async (e) => {
        data = await TblmanualDonationItem.update(
          {
            type: e.type,
            amount: e.amount,
            remark: e.remark,
            ChequeNo: e.chequeNo,
            branch: e.Branch,
            BankName: e.BankName,
            ChequeDate: e.ChequeDate,
          },

          {
            where: {
              donationId: id,
              id: e.id,
            },
          }
        );
      });
    });

    return {
      status: true,
      message: "updated Successfully",
    };
  };

  editManualItemDonation = async (req) => {
    let data;
    const {
      id,
      name,
      phoneNo,
      address,
      new_member,
      donation_date,
      donation_time,
      modeOfDonation,
      donation_item,
    } = req.body;

    const userId = req.user.id;

    await TblmanualDonation.update(
      {
        name: name,
        phoneNo: phoneNo,
        address: address,
        new_member: new_member,
        donation_date: donation_date,
        donation_time: donation_time,
      },
      {
        where: {
          // created_by: userId,
          id: id,
          // modeOfDonation: "4",
        },
      }
    ).then(async (res) => {
      donation_item.forEach(async (e) => {
        data = await TblmanualDonationItem.update(
          {
            type: e.type,
            amount: e.amount,
            remark: e.remark,
            itemType: e.itemType,
            size: e.size,
            unit: e.unit,
            quantity: e.quantity,
            approxValue: e.approxValue,
          },

          {
            where: {
              donationId: id,
              id: e.id,
            },
          }
        );
      });
    });
    return {
      status: true,
      message: "updated Successfully",
    };
  };

  getElecDonation = async (req) => {
    const { type } = req.query;
    const userId = req.user.id;
    let data;
    let whereClause = {};
    let result;
    if (type) {
      whereClause.modeOfDonation = type;
    }

    data = await TblelecDonation.findAll({
      include: [
        {
          model: TblelecDonationItem,
          as: "elecItemDetails",
        },
      ],
      where: whereClause,
      order: [["id", "DESC"]],
    });

    const promises = data.map(async (elecDonation) => {
      const isAdmin = elecDonation.isAdmin;
      const user = elecDonation.created_by;

      if (isAdmin) {
        // Retrieve signature of admin from tbl_admins
        const admin = await TblAdmin.findOne({
          where: {
            id: user,
          },
        });
        console.log(admin.signature, "sign");
        // Add signature to each elec donation item
        return {
          ...elecDonation?.toJSON(),
          createdBySignature: admin?.signature,
          createdBy: admin?.name || "",
          elecItemDetails: elecDonation.elecItemDetails.map((item) => ({
            ...item.toJSON(),
          })),
        };
      } else {
        // Retrieve signature of employee from tbl_employees
        const employee = await TblEmployees.findOne({
          where: {
            id: user,
          },
        });

        // Add signature to each elec donation item
        return {
          ...elecDonation.toJSON(),
          createdBySignature: employee?.signature || "",
          createdBy: employee?.Username || "",
          elecItemDetails: elecDonation?.elecItemDetails.map((item) => ({
            ...item.toJSON(),
          })),
        };
      }
    });

    result = await Promise.all(promises);

    return result;
  };

  getElecDonationbyId = async (req) => {
    let id = req.query.id;
    const userID = req.user.id;
    let data = await TblelecDonation.findOne({
      where: { id: id },
      include: [
        {
          model: TblelecDonationItem,
          as: "elecItemDetails",
        },
      ],
    });
    console.log(data);
    return data;
  };

  getLastID = async () => {
    const lastID = await TblDonation.findOne({
      order: [["id", "DESC"]],
      attributes: ["id"],
    });
    return lastID ? lastID.id : 1;
  };

  getElecLastID = async () => {
    const lastID = await TblelecDonation.count();
    return lastID;
  };

  donationRecord = async (req) => {
    const userId = req.user.id;
    const record = await TblDonation.findAll({
      where: { created_by: userId },
      attributes: [
        "id",
        "receiptNo",
        "name",
        "phoneNo",
        "address",
        "new_member",
        "donation_date",
        "donation_time",
      ],
      include: [
        {
          model: TblDonationItem,
          as: "itemDetails",
          attributes: ["itemId", "amount", "remark"],
        },
      ],
    });
    return record;
  };

  newDonationRecord = async (req) => {
    let record;
    const userId = req.user.id;

    record = await TblNewDonation.findAll({
      where: {
        ADDED_BY: userId,
      },
    }).then(async (results) => {
      let users = await TblUsers.findAll({
        attributes: ["signature", "id"],
      });
      console.log(users);
      let admins = await TblAdmin.findOne({
        attributes: ["signature"],
      });

      let finalResults = results.map((item) => {
        let user = users?.find((user) => user?.id === item.ADDED_BY);
        return {
          ...item.toJSON(),
          signature: user ? user.signature : "",
          adminSignature: admins ? admins.signature : "",
        };
      });
      return finalResults;
    });
    return record;
  };

  allDonationRecord = async (req) => {
    let record;
    let { id, order } = req.query;
    if (id) {
      record = await TblNewDonation.findAll({
        where: {
          id: id,
        },
      }).then(async (results) => {
        let users = await TblUsers.findAll({
          attributes: ["signature", "id"],
        });
        console.log(users);
        let admins = await TblAdmin.findOne({
          attributes: ["signature"],
        });

        let finalResults = results?.map((item) => {
          let user = users?.find((user) => user?.id === item.ADDED_BY);
          return {
            ...item.toJSON(),
            signature: user ? user?.signature : "",
            adminSignature: admins ? admins?.signature : "",
          };
        });
        return finalResults;
      });

      return record;
    } else if (order) {
      record = await TblNewDonation.findAll({
        where: {
          RECEIPT_NO: order,
        },
      }).then(async (results) => {
        let users = await TblUsers.findAll({
          attributes: ["signature", "id"],
        });
        console.log(users);
        let admins = await TblAdmin.findOne({
          attributes: ["signature"],
        });

        let finalResults = results?.map((item) => {
          let user = users?.find((user) => user?.id === item.ADDED_BY);
          return {
            ...item.toJSON(),
            signature: user ? user?.signature : "",
            adminSignature: admins ? admins?.signature : "",
          };
        });
        return finalResults;
      });

      return record;
    }

    record = await TblNewDonation.findAll({
      order: [
        ["DATE_OF_DAAN", "DESC"],
        ["TIME_OF_DAAN", "DESC"],
      ],
    }).then(async (results) => {
      console.log(results);
      let users = await TblUsers.findAll({
        attributes: ["signature", "id"],
      });
      let admins = await TblAdmin.findOne({
        attributes: ["signature"],
      });

      let finalResults = results.map((item) => {
        let user = users.find((user) => user?.id === item.ADDED_BY);
        return {
          ...item.toJSON(),
          signature: user ? user.signature : "",
          adminSignature: admins ? admins.signature : "",
        };
      });

      return finalResults;
    });
    return record;
  };

  getItemList = async () => {
    const list = await itemList
      .findAll({
        attributes: ["id", "item_name"],
        where: { is_deleted: null },
        order: ["donation_date", "DESC"],
      })
      .then((res) => {
        console.log(res);
      })
      .catch((er) => {
        console.log(er);
      });
    return list;
  };

  checkDonationType = async (req) => {
    let { type_en, type_hi, modeOfType, itemType_en, itemType_hi } = req.body;
    let type;
    if (modeOfType == "1") {
      type = await TblDonationTypes.findAll({
        where: {
          [Op.or]: [{ type_en: type_en }, { type_hi: type_hi }],
        },
      });
      return type;
    }
    if (modeOfType == "2") {
      type = await TblDonationTypes.findAll({
        where: {
          [Op.or]: [
            {
              itemType_en: itemType_en,
            },
            { itemType_hi: itemType_hi },
          ],
        },
      });
      return type;
    }
  };

  addDonationType = async (req) => {
    const { type_en, type_hi, modeOfType, itemType_en, itemType_hi } = req.body;
    let data;

    if (modeOfType == 1) {
      data = await TblDonationTypes.create({
        type_en,
        type_hi,
        modeOfType,
      });
    } else if (modeOfType == 2) {
      data = await TblDonationTypes.create({
        itemType_en,
        itemType_hi,
        modeOfType,
      });
    }

    return data;
  };

  getDonationType = async (req) => {
    let { type } = req.query;
    let data;
    if (type == 1) {
      data = await TblDonationTypes.findAll({
        where: {
          modeOfType: 1,
          status: 1,
        },
        attributes: ["id", "type_en", "type_hi", "status"],
      });
    } else if (type == 2) {
      data = await TblDonationTypes.findAll({
        where: {
          modeOfType: 2,
          status: 1,
        },
        attributes: ["id", "itemType_en", "itemType_hi", "status"],
      });
    }
    return data;
  };

  getAdminDonationType = async (req) => {
    let { type } = req.query;
    let data;
    if (type == 1) {
      data = await TblDonationTypes.findAll({
        where: {
          modeOfType: 1,
        },
        attributes: ["id", "type_en", "type_hi", "status"],
      });
    } else if (type == 2) {
      data = await TblDonationTypes.findAll({
        where: {
          modeOfType: 2,
        },
        attributes: ["id", "itemType_en", "itemType_hi", "status"],
      });
    }
    return data;
  };

  getAllocatedVoucherList = async (req) => {
    let { userId } = req.query;

    let whereClause = {};

    if (userId) {
      whereClause.assign = userId;
    }

    const voucherRanges = await TblVouchers.findAll({
      where: whereClause,
      attributes: ["from", "to", "assign", "name"],
    });

    // Create a list of all voucher numbers between the minimum and maximum numbers
    const voucherNumbers = voucherRanges.flatMap((range) =>
      Array.from(
        { length: range.to - range.from + 1 },
        (_, index) => range.from + index
      )
    );

    // Find all donations
    const donations = await TblelecDonation.findAll();

    // Extract the voucher numbers from the donations
    const donationNumbers = donations.map((donation) =>
      parseInt(donation.voucherNo)
    );

    // Find all cancelled vouchers
    const cancelledVouchers = await TblCancelVoucher.findAll();

    // Extract the voucher numbers from the cancelled vouchers
    const cancelledNumbers = cancelledVouchers.map((voucher) =>
      parseInt(voucher.voucherNo)
    );

    // Create a list of vouchers with their allocation status
    const voucherList = voucherNumbers.map((voucherNumber) => {
      let voucherRange =
        voucherRanges.find(
          (range) => range.from <= voucherNumber && range.to >= voucherNumber
        ) || {};

      const cancelledVoucher = cancelledVouchers.find(
        (voucher) => voucher.voucherNo === voucherNumber
      );

      const status = cancelledNumbers.includes(voucherNumber)
        ? "cancelled"
        : donationNumbers.includes(voucherNumber)
        ? "allocated"
        : "unallocated";
      return {
        voucherNo: voucherNumber.toString().padStart(4, "0"),
        status,
        rsn: cancelledVoucher ? cancelledVoucher.rsn : "",
        assign: voucherRange.assign || null,
        name: voucherRange.name || null,
      };
    });

    return voucherList;
  };

  delDonationType = async (req) => {
    let { id, type } = req.query;
    let data;
    if (type == "1") {
      data = await TblDonationTypes.destroy({
        where: {
          id: id,
          modeOfType: 1,
        },
      });
    } else if (type == "2") {
      data = await TblDonationTypes.destroy({
        where: {
          id: id,
          modeOfType: 2,
        },
      });
    }

    return data;
  };

  changeDonationType = async (req) => {
    const { id, status, type } = req.body;
    console.log(req.body);
    let data;

    if (status == "1") {
      await TblDonationTypes.update(
        {
          status: 1,
          rsn: "",
        },
        {
          where: {
            id: id,
            modeOfType: type,
          },
        }
      )
        .then((res) => {
          if (res[0] === 1) {
            data = {
              status: true,
              message: "Successfully changed status",
            };
          } else {
            data = {
              status: false,
              message: "failed to change status",
            };
          }
        })
        .catch((err) => {
          console.log(err);
          data = {
            status: false,
            message: "failed to change status",
          };
        });
    }

    if (status == "0") {
      await TblDonationTypes.update(
        {
          status: 0,
          rsn: "",
        },
        {
          where: {
            id: id,
            modeOfType: type,
          },
        }
      )
        .then((res) => {
          if (res[0] === 1) {
            data = {
              status: true,
              message: "Successfully change status",
            };
          } else {
            data = {
              status: false,
              message: "something went wrong",
            };
          }
        })
        .catch((err) => {
          console.log(err);
          data = {
            status: false,
            message: "failed to change status",
          };
        });
    }
    console.log(data);
    return data;
  };

  EditDonationType = async (req) => {
    let { id, type_en, type_hi, modeOfType, itemType_en, itemType_hi } =
      req.body;
    let data;
    if (modeOfType == "1") {
      data = await TblDonationTypes.update(
        { type_en: type_en, type_hi: type_hi },
        {
          where: {
            id: id,
            modeOfType: modeOfType,
          },
        }
      );
    } else if (modeOfType == "2") {
      data = await TblDonationTypes.update(
        { itemType_en: itemType_en, itemType_hi: itemType_hi },
        {
          where: {
            id: id,
            modeOfType: modeOfType,
          },
        }
      );
    }

    return data;
  };

  ChangeChequeStatus = async (req) => {
    const { status, id, rsn, PAYMENT_ID } = req.body;
    console.log(req.body);
    ///status 0 == false ///status 1 === true means active
    let data;

    if (status == 1) {
      data = await TblNewDonation.update(
        {
          active: "1",
          PAYMENT_ID: PAYMENT_ID,
          rsn: "",
        },
        {
          where: {
            id: id,
            MODE_OF_DONATION: "CHEQUE",
          },
        }
      ).catch((err) => {
        console.log(err);
      });
    } else if (status == 0) {
      data = await TblNewDonation.update(
        {
          active: "0",
          rsn: rsn,
        },
        {
          where: {
            id: id,
            MODE_OF_DONATION: "CHEQUE",
          },
        }
      ).catch((err) => {
        console.log(err);
      });
    }
    console.log(data);
    return data;
  };

  ChangeElecStatus = async (req) => {
    const { status, id, rsn, type } = req.body;
    console.log(req.body);
    ///status 0 == false ///status 1 === true means active
    let data;

    if (status == 1) {
      data = await TblelecDonation.update(
        {
          isActive: true,
          rsn: "",
        },
        {
          where: {
            id: id,
            modeOfDonation: type,
          },
        }
      ).catch((err) => {
        console.log(err);
      });
    } else if (status == 0) {
      data = await TblelecDonation.update(
        {
          isActive: false,
          rsn: rsn,
        },
        {
          where: {
            id: id,
            modeOfDonation: type,
          },
        }
      ).catch((err) => {
        console.log(err);
      });
    }
    console.log(data);
    return data;
  };

  ChangemanualDonation = async (req) => {
    const { status, id, rsn, type } = req.body;
    console.log(req.body);
    ///status 0 == false ///status 1 === true means active
    let data;

    if (status == 1) {
      console.log("enmtere");
      data = await TblmanualDonation.update(
        {
          isActive: true,
          rsn: "",
        },
        {
          where: {
            id: id,
            modeOfDonation: type,
          },
        }
      ).catch((err) => {
        console.log(err);
      });
    } else if (status == 0) {
      console.log("enmtere");
      data = await TblmanualDonation.update(
        {
          isActive: false,
          rsn: rsn,
        },
        {
          where: {
            id: id,
            modeOfDonation: type,
          },
        }
      ).catch((err) => {
        console.log(err);
      });
    }
    console.log(data, "data");
    return data;
  };

  savePaymentDetails = async (req) => {
    let result = "";
    console.log(req.body);
    result = await TblNewDonation.update(
      {
        PAYMENT_ID: req.body.PAYMENT_ID,
        PAYMENT_STATUS: req.body.PAYMENT_STATUS == "Success" ? 1 : 0,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    );

    return result;
  };

  getuserBynum = async (req) => {
    let user = await TblelecDonation.findOne({
      where: {
        phoneNo: req.query.mobile,
      },
    });

    return user;
  };

  getuserBynumManual = async (req) => {
    let user = await TblmanualDonation.findOne({
      where: {
        phoneNo: req.query.mobile,
      },
    });

    return user;
  };

  donationReport = async (req) => {
    let { fromDate, toDate, user } = req.query;
    let from = new Date(fromDate);
    let to = new Date(toDate);
    try {
      let whereClause = {};

      if (fromDate && toDate) {
        whereClause = {
          donation_date: {
            [Op.between]: [from, to],
          },
        };
      }
      if (user) {
        whereClause.created_by = user;
      }

      const donations = await TblelecDonation.findAll({
        where: whereClause,
        include: [
          {
            model: TblelecDonationItem,
            as: "elecItemDetails",
            attributes: ["type"],
          },
        ],
        attributes: [
          "modeOfDonation",
          "created_by",
          "elecItemDetails.type",
          [
            TblelecDonation.sequelize.literal(`COUNT(tbl_elec_donation.id)`),
            "count",
          ],

          [
            TblDonationItem.sequelize.literal(
              `SUM(CASE WHEN modeOfDonation = 1 THEN elecItemDetails.amount END)`
            ),
            "electric_amount",
          ],
          [
            TblDonationItem.sequelize.literal(
              `SUM(CASE WHEN modeOfDonation = 2 THEN elecItemDetails.amount END)`
            ),
            "cash_amount",
          ],
          [
            TblDonationItem.sequelize.literal(
              `SUM(CASE WHEN modeOfDonation = 3 THEN elecItemDetails.amount END)`
            ),
            "cheque_amount",
          ],
          [
            TblDonationItem.sequelize.literal(
              `SUM(CASE WHEN modeOfDonation = 4 THEN elecItemDetails.amount END)`
            ),
            "item_amount",
          ],
          [
            TblDonationItem.sequelize.literal(
              `SUM(IFNULL(CASE WHEN modeOfDonation = 1 THEN elecItemDetails.amount END, 0) + IFNULL(CASE WHEN modeOfDonation = 2 THEN elecItemDetails.amount END, 0) + IFNULL(CASE WHEN modeOfDonation = 3 THEN elecItemDetails.amount END, 0) + IFNULL(CASE WHEN modeOfDonation = 4 THEN elecItemDetails.amount END, 0))`
            ),
            "total_amount",
          ],
        ],
        group: ["elecItemDetails.type", "tbl_elec_donation.created_by"],

        raw: true,
      });

      // Calculate the total count of all users
      const totalCount = donations.reduce((acc, curr) => acc + curr.count, 0);

      // Calculate the total amount of all users
      const totalAmount = donations.reduce(
        (acc, curr) => acc + curr.total_amount,
        0
      );

      console.log(totalCount, totalAmount);
      const result = [
        {
          totalCount,
          totalAmount,
          donations,
        },
      ];
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  manualdonationReport = async (req) => {
    let { fromDate, toDate, user } = req.query;
    let from = new Date(fromDate);
    let to = new Date(toDate);
    try {
      let whereClause = {};

      if (fromDate && toDate) {
        whereClause = {
          donation_date: {
            [Op.between]: [from, to],
          },
        };
      }

      if (user) {
        whereClause.created_by = user;
      }

      const donations = await TblmanualDonation.findAll({
        where: whereClause,
        include: [
          {
            model: TblmanualDonationItem,
            as: "manualItemDetails",
            attributes: ["type"],
          },
        ],
        attributes: [
          "modeOfDonation",
          "created_by",
          "manualItemDetails.type",
          [
            TblmanualDonation.sequelize.literal(
              `COUNT(tbl_manual_donation.id)`
            ),
            "count",
          ],

          [
            TblDonationItem.sequelize.literal(
              `SUM(CASE WHEN modeOfDonation = 1 THEN manualItemDetails.amount END)`
            ),
            "manualtric_amount",
          ],
          [
            TblDonationItem.sequelize.literal(
              `SUM(CASE WHEN modeOfDonation = 2 THEN manualItemDetails.amount END)`
            ),
            "cash_amount",
          ],
          [
            TblDonationItem.sequelize.literal(
              `SUM(CASE WHEN modeOfDonation = 3 THEN manualItemDetails.amount END)`
            ),
            "cheque_amount",
          ],
          [
            TblDonationItem.sequelize.literal(
              `SUM(CASE WHEN modeOfDonation = 4 THEN manualItemDetails.amount END)`
            ),
            "item_amount",
          ],
          [
            TblDonationItem.sequelize.literal(
              `SUM(IFNULL(CASE WHEN modeOfDonation = 1 THEN manualItemDetails.amount END, 0) + IFNULL(CASE WHEN modeOfDonation = 2 THEN manualItemDetails.amount END, 0) + IFNULL(CASE WHEN modeOfDonation = 3 THEN manualItemDetails.amount END, 0) + IFNULL(CASE WHEN modeOfDonation = 4 THEN manualItemDetails.amount END, 0))`
            ),
            "total_amount",
          ],
        ],
        group: ["manualItemDetails.type", "tbl_manual_donation.created_by"],

        raw: true,
      });
      console.log(donations);

      // Calculate the total count of all users
      const totalCount = donations.reduce((acc, curr) => acc + curr.count, 0);

      // Calculate the total amount of all users
      const totalAmount = donations.reduce(
        (acc, curr) => acc + curr.total_amount,
        0
      );

      console.log(totalCount, totalAmount);
      const result = [
        {
          totalCount,
          totalAmount,
          donations,
        },
      ];
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  onlineDonationReport = async (req) => {
    let { fromDate, toDate, user } = req.query;
    let from = new Date(fromDate);
    let to = new Date(toDate);
    try {
      let whereClause = {};

      if (fromDate && toDate) {
        whereClause = {
          DATE_OF_DAAN: {
            [Op.between]: [from, to],
          },
        };
      }

      if (user) {
        whereClause.ADDED_BY = user;
      }

      const donations = await TblNewDonation.findAll({
        where: whereClause,

        attributes: [
          "MODE_OF_DONATION",
          "ADDED_BY",
          "tbl_donations.TYPE",
          [
            TblNewDonation.sequelize.literal(`COUNT(tbl_donations.id)`),
            "count",
          ],

          [
            TblNewDonation.sequelize.literal(
              `SUM(CASE WHEN MODE_OF_DONATION = "ONLINE" THEN tbl_donations.AMOUNT END)`
            ),
            "online_amount",
          ],
          [
            TblNewDonation.sequelize.literal(
              `SUM(CASE WHEN MODE_OF_DONATION = "CHEQUE" THEN tbl_donations.AMOUNT END)`
            ),
            "cheque_amount",
          ],

          [
            TblNewDonation.sequelize.literal(
              `SUM(IFNULL(CASE WHEN MODE_OF_DONATION = "ONLINE" THEN tbl_donations.AMOUNT END, 0) + IFNULL(CASE WHEN MODE_OF_DONATION = "CHEQUE" THEN tbl_donations.amount END, 0 ))`
            ),
            "total_amount",
          ],
        ],
        group: ["tbl_donations.TYPE", "tbl_donations.ADDED_BY"],

        raw: true,
      });
      console.log(donations);

      // Calculate the total count of all users
      const totalCount = donations.reduce((acc, curr) => acc + curr.count, 0);

      // Calculate the total amount of all users
      const totalAmount = donations.reduce(
        (acc, curr) => acc + curr.total_amount,
        0
      );

      console.log(totalCount, totalAmount);
      const result = [
        {
          totalCount,
          totalAmount,
          donations,
        },
      ];
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  userDonationAmount = async (req) => {
    const { from, to, userId } = req.query;
    let res;
    let whereClause = {};

    let fromDate = new Date(from);
    let toDate = new Date(to);

    if (from && to) {
      whereClause.donation_date = {
        [Op.between]: [fromDate, toDate],
      };
    }

    if (userId) {
      whereClause.created_by = userId;
    }

    res = await TblelecDonation.findAll({
      include: [
        {
          model: TblelecDonationItem,
          as: "elecItemDetails",
          attributes: [],
        },
      ],
      where: whereClause,
      group: ["tbl_elec_donation.created_by"],
      attributes: [
        "created_by",
        "donation_date",
        [
          TblelecDonation.sequelize.fn(
            "SUM",
            TblelecDonation.sequelize.col("elecItemDetails.amount")
          ),
          "totalDonationAmount",
        ],
      ],
    })
      .then(async (results) => {
        let userIds = results.map((item) => item.created_by);
        let users = await TblEmployees.findAll({
          where: {
            id: {
              [Op.in]: userIds,
            },
          },
          attributes: ["id", "Username"],
        });

        let finalResults = results.map((item) => {
          let user = users.find((user) => user.id === item.created_by);
          return {
            ...item.toJSON(),
            name: user ? user.Username : "",
          };
        });

        return finalResults;
      })
      .catch((error) => {
        console.log(error, "err");
        return error;
      });

    return res;
  };

  manualuserDonationAmount = async (req) => {
    const { from, to, userId } = req.query;
    let res;
    let whereClause = {};

    let fromDate = new Date(from);
    let toDate = new Date(to);

    if (from && to) {
      whereClause.donation_date = {
        [Op.between]: [fromDate, toDate],
      };
    }

    if (userId) {
      whereClause.created_by = userId;
    }

    res = await TblmanualDonation.findAll({
      include: [
        {
          model: TblmanualDonationItem,
          as: "manualItemDetails",
          attributes: [],
        },
      ],
      where: whereClause,
      group: ["tbl_manual_donation.created_by"],
      attributes: [
        "created_by",
        "donation_date",
        [
          TblmanualDonation.sequelize.fn(
            "SUM",
            TblmanualDonation.sequelize.col("manualItemDetails.amount")
          ),
          "totalDonationAmount",
        ],
      ],
    })
      .then(async (results) => {
        let userIds = results.map((item) => item.created_by);
        let users = await TblEmployees.findAll({
          where: {
            id: {
              [Op.in]: userIds,
            },
          },
          attributes: ["id", "Username"],
        });

        let finalResults = results?.map((item) => {
          let user = users?.find((user) => user.id === item.created_by);
          return {
            ...item.toJSON(),
            name: user ? user?.Username : "",
          };
        });

        return finalResults;
      })
      .catch((error) => {
        console.log(error, "err");
        return error;
      });

    return res;
  };

  onlineuserDonationAmount = async (req) => {
    const { from, to, userId, type } = req.query;
    let res;
    let whereClause = {};

    let fromDate = new Date(from);
    let toDate = new Date(to);

    if (from && to) {
      whereClause.DATE_OF_DAAN = {
        [Op.between]: [fromDate, toDate],
      };
    }

    if (userId) {
      whereClause.ADDED_BY = userId;
    }

    if (type) {
      whereClause.MODE_OF_DONATION = type;
    }
    console.log(whereClause);

    res = await TblNewDonation.findAll({
      where: whereClause,
      group: ["tbl_donations.ADDED_BY", "tbl_donations.MODE_OF_DONATION"],
      attributes: [
        "ADDED_BY",
        "MODE_OF_DONATION",
        [
          TblNewDonation.sequelize.fn(
            "SUM",
            TblNewDonation.sequelize.col("tbl_donations.AMOUNT")
          ),
          "totalDonationAmount",
        ],
      ],
    })
      .then(async (results) => {
        let userIds = results?.map((item) => item.created_by);
        let users = await TblUsers.findAll({
          where: {
            id: {
              [Op.in]: userIds,
            },
          },
          attributes: ["id", "name"],
        });

        let finalResults = results?.map((item) => {
          let user = users?.find((user) => user.id === item.created_by);
          return {
            ...item.toJSON(),
            name: user ? user?.name : "",
          };
        });

        return finalResults;
      })
      .catch((error) => {
        console.log(error, "err");
        return error;
      });

    return res;
  };

  centralizeduserDonationAmount = async (req) => {
    let { fromDate, toDate, user, type } = req.query;
    let from = new Date(fromDate);
    let to = new Date(toDate);

    let whereClause = {};
    let whereClause1 = {};
    let whereClauseinc = {};

    if (user) {
      whereClause1.created_by = user;
    }

    if (type) {
      whereClause.TYPE = type;
    }

    if (type) {
      whereClauseinc.type = type;
    }

    if (fromDate && toDate) {
      whereClause.DATE_OF_DAAN = { [Op.between]: [from, to] };
      whereClause1.donation_date = { [Op.between]: [from, to] };
    }

    const tbl_donations_result = await TblNewDonation.findAll({
      attributes: [
        "MODE_OF_DONATION",
        "TYPE",
        [TblNewDonation.sequelize.literal("SUM(AMOUNT)"), "TOTAL_AMOUNT"],
      ],
      where: whereClause,
      group: ["MODE_OF_DONATION", "TYPE"],
    });

    const tbl_elec_donations_result = await TblelecDonation.findAll({
      attributes: [
        "modeOfDonation",
        "created_by",
        [
          TblelecDonation.sequelize.fn(
            "SUM",
            TblelecDonation.sequelize.col("elecItemDetails.amount")
          ),
          "TOTAL_AMOUNT",
        ],
      ],
      include: {
        model: TblelecDonationItem,
        as: "elecItemDetails",
        attributes: ["type"],
        where: whereClauseinc,
      },
      where: whereClause1,
      group: ["modeOfDonation", "type"],
    });
    console.log(tbl_elec_donations_result);
    const tbl_manual_donations_result = await TblmanualDonation.findAll({
      attributes: [
        "modeOfDonation",
        "created_by",
        [
          TblmanualDonation.sequelize.fn(
            "SUM",
            TblmanualDonation.sequelize.col("manualItemDetails.amount")
          ),
          "TOTAL_AMOUNT",
        ],
      ],
      include: {
        model: TblmanualDonationItem,
        as: "manualItemDetails",
        attributes: ["type"],
        where: whereClauseinc,
      },
      where: whereClause1,
      group: ["modeOfDonation", "type"],
    });

    // Fetch employee information for electronic donations
    const elecDonationEmployees = await Promise.all(
      tbl_elec_donations_result.map(async (item) => {
        if (item) {
          const employee = await TblEmployees.findOne({
            where: { id: item.created_by },
          });
          const modeOfDonation = item?.modeOfDonation;

          let totalAmountKey = "";
          if (modeOfDonation == 1) {
            totalAmountKey = "elec_bank_TOTAL_AMOUNT";
          } else if (modeOfDonation == 2) {
            totalAmountKey = "elec_cash_TOTAL_AMOUNT";
          } else if (modeOfDonation == 3) {
            totalAmountKey = "elec_cheque_TOTAL_AMOUNT";
          } else if (modeOfDonation == 4) {
            totalAmountKey = "elec_item_TOTAL_AMOUNT";
          }

          return {
            MODE_OF_DONATION: item?.modeOfDonation,
            created_by: item?.created_by,
            employeeName: employee ? employee.Username : "",
            type: item?.elecItemDetails[0].dataValues.type,
            [totalAmountKey]: item?.dataValues.TOTAL_AMOUNT,
            donationType: "electric",
          };
        } else {
          return null;
        }
      })
    );

    // Fetch employee information for manual donations
    const manualDonationEmployees = await Promise.all(
      tbl_manual_donations_result.map(async (item) => {
        if (item) {
          const employee = await TblEmployees.findOne({
            where: { id: item.created_by },
          });
          const modeOfDonation = item?.modeOfDonation;

          let totalAmountKey = "";
          if (modeOfDonation == 1) {
            totalAmountKey = "manual_bank_TOTAL_AMOUNT";
          } else if (modeOfDonation == 2) {
            totalAmountKey = "manual_cash_TOTAL_AMOUNT";
          } else if (modeOfDonation == 3) {
            totalAmountKey = "manual_cheque_TOTAL_AMOUNT";
          } else if (modeOfDonation == 4) {
            totalAmountKey = "manual_item_TOTAL_AMOUNT";
          }
          return {
            MODE_OF_DONATION: item?.modeOfDonation,
            created_by: item?.created_by,
            employeeName: employee ? employee.Username : "",
            type: item?.manualItemDetails[0].dataValues.type,
            [totalAmountKey]: item?.dataValues.TOTAL_AMOUNT,
            donationType: "manual",
          };
        } else {
          return null;
        }
      })
    );

    const result = tbl_donations_result
      .map((item) => {
        const modeOfDonation = item?.MODE_OF_DONATION;
        console.log(modeOfDonation);
        let totalAmountKey = "TOTAL_AMOUNT";

        if (modeOfDonation === "ONLINE") {
          totalAmountKey = "ONLINE_TOTAL_AMOUNT";
        } else if (modeOfDonation === "CHEQUE") {
          totalAmountKey = "CHEQUE_TOTAL_AMOUNT";
        }

        return {
          MODE_OF_DONATION: modeOfDonation,
          TYPE: item?.TYPE,
          ADDED_BY: item?.ADDED_BY,
          [totalAmountKey]: item?.dataValues.TOTAL_AMOUNT,
          employeeName: "",
          donationType: "",
        };
      })
      .concat(elecDonationEmployees, manualDonationEmployees);

    return result;
  };

  employeeChangePass = async (req) => {
    let userId = req.user.id;
    let user;
    let { oldPass, newPass } = req.body;

    const salt = bcrypt.genSaltSync(12);
    const hashencrypt = bcrypt.hashSync(newPass, salt);
    console.log(hashencrypt);
    let check = await TblEmployees.findOne({
      where: {
        id: userId,
      },
    });

    if (!check) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Your not Authorized ");
    }

    let passMatch = await bcrypt.compare(oldPass, check.Password);
    console.log(passMatch);
    if (!passMatch) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Your password is incorrect");
    }

    if (passMatch) {
      console.log("paswords match");
      user = await TblEmployees.update(
        {
          Password: hashencrypt,
        },
        {
          where: {
            id: userId,
          },
        }
      );
    }

    return user;
  };

  getManualDonation = async (req) => {
    const { type, id } = req.query;
    let data;
    let whereClause = {};
    let result;
    if (type) {
      whereClause.modeOfDonation = type;
    }

    if (id) {
      whereClause.id = id;
    }

    data = await TblmanualDonation.findAll({
      include: [
        {
          model: TblmanualDonationItem,
          as: "manualItemDetails",
        },
      ],
      where: whereClause,
      order: [["id", "DESC"]],
    });

    const promises = data?.map(async (manualdonation) => {
      const isAdmin = manualdonation.isAdmin;
      const user = manualdonation.created_by;
      console.log(isAdmin, user);
      if (isAdmin) {
        // Retrieve signature of admin from tbl_admins
        const admin = await TblAdmin.findOne({
          where: {
            id: user,
          },
        });

        // Add signature to each elec donation item
        return {
          ...manualdonation.toJSON(),
          createdBySignature: admin.signature || "",
          CreatedBy: admin.name,
          manualItemDetails: manualdonation.manualItemDetails.map((item) => ({
            ...item.toJSON(),
          })),
        };
      } else {
        // Retrieve signature of employee from tbl_employees
        const employee = await TblEmployees.findOne({
          where: {
            id: user,
          },
        });

        // Add signature to each elec donation item
        return {
          ...manualdonation.toJSON(),
          createdBySignature: employee?.signature || "",
          CreatedBy: employee?.Username || "",
          manualItemDetails: manualdonation?.manualItemDetails?.map((item) => ({
            ...item.toJSON(),
          })),
        };
      }
    });

    result = await Promise.all(promises);

    return result;
  };

  cancelEachVoucher = async (req) => {
    let result;
    let cancelledVoucher = await TblCancelVoucher.create(req.body)
      .then((res) => {
        result = {
          status: "success",
          message: "Voucher Cancelled SuccessFully",
        };
      })
      .catch((err) => {
        console.log(err);
        result = {
          status: "Failed",
          message: "Voucher failed to  cancel",
        };
      });
    if (!result) {
      result = {
        status: "Failed",
        message: "Something went wrong !",
      };
    }

    return result;
  };

  getCancelledVoucher = async (voucher) => {
    let data = await TblCancelVoucher.findOne({
      where: {
        voucherNo: voucher,
      },
    });

    return data;
  };

  searchManual = async (req) => {
    const { search, type } = req.query;

    const where = {
      [Op.or]: [
        { name: { [Op.regexp]: `^${search}.*` } },
        { phoneNo: { [Op.regexp]: `^${search}.*` } },
        { ReceiptNo: { [Op.regexp]: `^${search}.*` } },
        { address: { [Op.regexp]: `^${search}.*` } },
        { donation_date: { [Op.regexp]: `^${search}.*` } },
        { "$manualItemDetails.amount$": { [Op.regexp]: `^${search}.*` } },
        {
          "$manualItemDetails.transactionNo$": { [Op.regexp]: `^${search}.*` },
        },
        { "$manualItemDetails.ChequeNo$": { [Op.regexp]: `^${search}.*` } },
      ],
    };

    if (type) {
      where["modeOfDonation"] = { [Op.regexp]: `^${type}.*` };
    }

    try {
      const donations = await TblmanualDonation.findAll({
        where,
        include: [
          {
            model: TblmanualDonationItem,
            as: "manualItemDetails",
          },
        ], // include associated table
      });

      if (!donations.length) {
        return [];
      }

      return donations;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  searchOnlineCheque = async (req) => {
    let { fromDate, toDate, fromRec, toRec, type } = req.query;
    let from = new Date(fromDate);
    let to = new Date(toDate);
    console.log(req.query);
    let whereClause = {};

    if (fromDate && toDate) {
      whereClause.DATE_OF_DAAN = {
        [Op.between]: [from, to],
      };
    }

    if (fromRec && toRec) {
      console.log("enter");
      whereClause.RECEIPT_NO = { [Op.between]: [fromRec, toRec] };
    }

    if (type) {
      whereClause.MODE_OF_DONATION = type == 1 ? "ONLINE" : "CHEQUE";
    }
    console.log(whereClause);
    const data = await TblNewDonation.findAll({
      where: whereClause,
    });
    return data;
  };

  searchElectric = async (req) => {
    const { search, type } = req.query;

    const where = {
      [Op.or]: [
        { name: { [Op.regexp]: `^${search}.*` } },
        { phoneNo: { [Op.regexp]: `^${search}.*` } },
        { voucherNo: { [Op.regexp]: `^${search}.*` } },
        { ReceiptNo: { [Op.regexp]: `^${search}.*` } },
        { address: { [Op.regexp]: `^${search}.*` } },
        { donation_date: { [Op.regexp]: `^${search}.*` } },
        { "$elecItemDetails.amount$": { [Op.regexp]: `^${search}.*` } },
        { "$elecItemDetails.transactionNo$": { [Op.regexp]: `^${search}.*` } },
        { "$elecItemDetails.ChequeNo$": { [Op.regexp]: `^${search}.*` } },
      ],
    };

    if (type) {
      where["modeOfDonation"] = { [Op.regexp]: `^${type}.*` };
    }

    try {
      const donations = await TblelecDonation.findAll({
        where,
        include: [
          {
            model: TblelecDonationItem,
            as: "elecItemDetails",
          },
        ], // include associated table
      });

      if (!donations.length) {
        return [];
      }

      return donations;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  SpecificsearchOnlinecheque = async (req) => {
    const { search, type } = req.query;

    const where = {
      [Op.or]: [
        { NAME: { [Op.regexp]: `^${search}.*` } },
        { MobileNo: { [Op.regexp]: `^${search}.*` } },
        {
          RECEIPT_NO: { [Op.regexp]: `^${search}.*` },
        },
        {
          ADDRESS: { [Op.regexp]: `^${search}.*` },
        },
        {
          DATE_OF_DAAN: { [Op.regexp]: `^${search}.*` },
        },
        {
          TYPE: { [Op.regexp]: `^${search}.*` },
        },
        {
          AMOUNT: { [Op.regexp]: `^${search}.*` },
        },
        {
          PAYMENT_ID: {
            [Op.regexp]: `^${search}.*`,
          },
        },
        {
          CHEQUE_NO: { [Op.regexp]: `^${search}.*` },
        },
      ],
    };

    if (type) {
      where["MODE_OF_DONATION"] = { [Op.regexp]: `^${type}.*` };
    }

    try {
      const donations = await TblNewDonation.findAll({
        where,
      });

      if (!donations.length) {
        return [];
      }

      return donations;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  dashAdminTotal = async () => {
    const today = new Date();

    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
      0,
      0,
      -1
    );

    const donationResultsPromise = TblelecDonation.findAll({
      attributes: [
        "created_by",
        "modeOfDonation",
        [
          TblelecDonation.sequelize.fn(
            "SUM",
            TblelecDonation.sequelize.col("elecItemDetails.amount")
          ),
          "total_amount",
        ],
      ],
      include: [
        {
          model: TblelecDonationItem,
          as: "elecItemDetails",
          attributes: [],
        },
      ],
      where: {
        donation_date: {
          [Op.between]: [startOfToday, endOfToday],
        },
      },
      group: ["created_by", "modeOfDonation"],
    });

    const employeeResultsPromise = TblEmployees.findAll({
      attributes: ["id", "Username"],
    });

    const [donationResults, employeeResults] = await Promise.all([
      donationResultsPromise,
      employeeResultsPromise,
    ]);

    const employeeMap = {};
    employeeResults.forEach((employee) => {
      employeeMap[employee.id] = employee.Username;
    });

    const modeOfDonationMap = {
      1: "bank",
      2: "cash",
      3: "cheque",
    };

    const donationResultsByUser = {};
    donationResults.forEach((donation) => {
      const employeeName = employeeMap[donation.created_by];
      const modeOfDonation = modeOfDonationMap[donation.modeOfDonation];
      const totalAmount = donation.dataValues.total_amount;

      if (!donationResultsByUser[donation.created_by]) {
        donationResultsByUser[donation.created_by] = {
          created_by: donation.created_by,
          employee_name: employeeName,
          cash_amount: 0,
          bank_amount: 0,
          cheque_amount: 0,
          total: 0,
        };
      }

      const userResult = donationResultsByUser[donation.created_by];

      switch (modeOfDonation) {
        case "cash":
          userResult.cash_amount = totalAmount;
          break;
        case "bank":
          userResult.bank_amount = totalAmount;
          break;
        case "cheque":
          userResult.cheque_amount = totalAmount;
          break;
      }

      userResult.total =
        userResult.cash_amount +
        userResult.bank_amount +
        userResult.cheque_amount;
    });

    const result = Object.values(donationResultsByUser);

    return {
      data: result,
    };
  };

  dashemployeeTotal = async (req) => {
    console.log(req.user.id);
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
      0,
      0,
      -1
    );

    const donationResultsPromise = TblelecDonation.findAll({
      attributes: [
        "created_by",
        "modeOfDonation",
        [
          TblelecDonation.sequelize.fn(
            "SUM",
            TblelecDonation.sequelize.col("elecItemDetails.amount")
          ),
          "total_amount",
        ],
      ],
      include: [
        {
          model: TblelecDonationItem,
          as: "elecItemDetails",
          attributes: [],
        },
      ],
      where: {
        donation_date: {
          [Op.between]: [startOfToday, endOfToday],
        },
        created_by: req.user.id,
      },
      group: ["created_by", "modeOfDonation"],
    });

    const employeeResultsPromise = TblEmployees.findAll({
      attributes: ["id", "Username"],
    });

    const [donationResults, employeeResults] = await Promise.all([
      donationResultsPromise,
      employeeResultsPromise,
    ]);

    const employeeMap = {};
    employeeResults.forEach((employee) => {
      employeeMap[employee.id] = employee.Username;
    });

    const modeOfDonationMap = {
      1: "bank",
      2: "cash",
      3: "cheque",
    };

    const donationResultsByUser = {};
    donationResults.forEach((donation) => {
      const employeeName = employeeMap[donation.created_by];
      const modeOfDonation = modeOfDonationMap[donation.modeOfDonation];
      const totalAmount = donation.dataValues.total_amount;

      if (!donationResultsByUser[donation.created_by]) {
        donationResultsByUser[donation.created_by] = {
          created_by: donation.created_by,
          employee_name: employeeName,
          cash_amount: 0,
          bank_amount: 0,
          cheque_amount: 0,
          total: 0,
        };
      }

      const userResult = donationResultsByUser[donation.created_by];

      switch (modeOfDonation) {
        case "cash":
          userResult.cash_amount = totalAmount;
          break;
        case "bank":
          userResult.bank_amount = totalAmount;
          break;
        case "cheque":
          userResult.cheque_amount = totalAmount;
          break;
      }

      userResult.total =
        userResult.cash_amount +
        userResult.bank_amount +
        userResult.cheque_amount;
    });

    const result = Object.values(donationResultsByUser);

    return {
      data: result,
    };
  };

  dashAdminTotalManual = async () => {
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
      0,
      0,
      -1
    );
    const donationResultsPromise = TblmanualDonation.findAll({
      attributes: [
        "created_by",
        "modeOfDonation",
        [
          TblmanualDonation.sequelize.fn(
            "SUM",
            TblmanualDonation.sequelize.col("manualItemDetails.amount")
          ),
          "total_amount",
        ],
      ],
      include: [
        {
          model: TblmanualDonationItem,
          as: "manualItemDetails",
          attributes: [],
        },
      ],
      where: {
        donation_date: {
          [Op.between]: [startOfToday, endOfToday],
        },
      },
      group: ["created_by", "modeOfDonation"],
    });

    const employeeResultsPromise = TblEmployees.findAll({
      attributes: ["id", "Username"],
    });

    const [donationResults, employeeResults] = await Promise.all([
      donationResultsPromise,
      employeeResultsPromise,
    ]);

    const employeeMap = {};
    employeeResults.forEach((employee) => {
      employeeMap[employee.id] = employee.Username;
    });

    const modeOfDonationMap = {
      1: "bank",
      2: "cash",
      3: "cheque",
    };

    const donationResultsByUser = {};
    donationResults.forEach((donation) => {
      const employeeName = employeeMap[donation.created_by];
      const modeOfDonation = modeOfDonationMap[donation.modeOfDonation];
      const totalAmount = donation.dataValues.total_amount;

      if (!donationResultsByUser[donation.created_by]) {
        donationResultsByUser[donation.created_by] = {
          created_by: donation.created_by,
          employee_name: employeeName,
          cash_amount: 0,
          bank_amount: 0,
          cheque_amount: 0,
          total: 0,
        };
      }

      const userResult = donationResultsByUser[donation.created_by];

      switch (modeOfDonation) {
        case "cash":
          userResult.cash_amount = totalAmount;
          break;
        case "bank":
          userResult.bank_amount = totalAmount;
          break;
        case "cheque":
          userResult.cheque_amount = totalAmount;
          break;
      }

      userResult.total =
        userResult.cash_amount +
        userResult.bank_amount +
        userResult.cheque_amount;
    });

    const result = Object.values(donationResultsByUser);

    return {
      data: result,
    };
  };

  dashemployeeTotalManual = async (req) => {
    console.log(req.user.id);
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
      0,
      0,
      -1
    );
    const donationResultsPromise = TblmanualDonation.findAll({
      attributes: [
        "created_by",
        "modeOfDonation",
        [
          TblmanualDonation.sequelize.fn(
            "SUM",
            TblmanualDonation.sequelize.col("manualItemDetails.amount")
          ),
          "total_amount",
        ],
      ],
      include: [
        {
          model: TblmanualDonationItem,
          as: "manualItemDetails",
          attributes: [],
        },
      ],
      where: {
        donation_date: {
          [Op.between]: [startOfToday, endOfToday],
        },
        created_by: req.user.id,
      },
      group: ["created_by", "modeOfDonation"],
    });

    const employeeResultsPromise = TblEmployees.findAll({
      attributes: ["id", "Username"],
    });

    const [donationResults, employeeResults] = await Promise.all([
      donationResultsPromise,
      employeeResultsPromise,
    ]);

    const employeeMap = {};
    employeeResults.forEach((employee) => {
      employeeMap[employee.id] = employee.Username;
    });

    const modeOfDonationMap = {
      1: "bank",
      2: "cash",
      3: "cheque",
    };

    const donationResultsByUser = {};
    donationResults.forEach((donation) => {
      const employeeName = employeeMap[donation.created_by];
      const modeOfDonation = modeOfDonationMap[donation.modeOfDonation];
      const totalAmount = donation.dataValues.total_amount;

      if (!donationResultsByUser[donation.created_by]) {
        donationResultsByUser[donation.created_by] = {
          created_by: donation.created_by,
          employee_name: employeeName,
          cash_amount: 0,
          bank_amount: 0,
          cheque_amount: 0,
          total: 0,
        };
      }

      const userResult = donationResultsByUser[donation.created_by];

      switch (modeOfDonation) {
        case "cash":
          userResult.cash_amount = totalAmount;
          break;
        case "bank":
          userResult.bank_amount = totalAmount;
          break;
        case "cheque":
          userResult.cheque_amount = totalAmount;
          break;
      }

      userResult.total =
        userResult.cash_amount +
        userResult.bank_amount +
        userResult.cheque_amount;
    });

    const result = Object.values(donationResultsByUser);

    return {
      data: result,
    };
  };

  dashAdminTotalOnline = async () => {
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
      0,
      0,
      -1
    );
    const donationResultsPromise = TblNewDonation.findAll({
      attributes: [
        "ADDED_BY",
        "MODE_OF_DONATION",
        [
          TblNewDonation.sequelize.fn(
            "SUM",
            TblNewDonation.sequelize.col("tbl_donations.amount")
          ),
          "total_amount",
        ],
      ],
      where: {
        DATE_OF_DAAN: {
          [Op.between]: [startOfToday, endOfToday],
        },
      },
      group: ["ADDED_BY", "MODE_OF_DONATION"],
    });

    const employeeResultsPromise = TblEmployees.findAll({
      attributes: ["id", "Username"],
    });

    const [donationResults, employeeResults] = await Promise.all([
      donationResultsPromise,
      employeeResultsPromise,
    ]);

    const employeeMap = {};
    employeeResults.forEach((employee) => {
      employeeMap[employee.id] = employee.Username;
    });

    const modeOfDonationMap = {
      ONLINE: "Online",
      CHEQUE: "Cheque",
    };

    const donationResultsByUser = {};
    donationResults.forEach((donation) => {
      const employeeName = employeeMap[donation.ADDED_BY];
      const modeOfDonation = modeOfDonationMap[donation.MODE_OF_DONATION];
      const totalAmount = donation.dataValues.total_amount;

      if (!donationResultsByUser[donation.ADDED_BY]) {
        donationResultsByUser[donation.ADDED_BY] = {
          created_by: donation.ADDED_BY,
          employee_name: employeeName,
          Online_amount: 0,
          Cheque_amount: 0,
          total: 0,
        };
      }

      const userResult = donationResultsByUser[donation.ADDED_BY];

      switch (modeOfDonation) {
        case modeOfDonationMap.ONLINE:
          userResult.Online_amount = totalAmount;
          break;
        case modeOfDonationMap.CHEQUE:
          userResult.Cheque_amount = totalAmount;
          break;
      }

      userResult.total = userResult.Online_amount + userResult.Cheque_amount;
    });

    const result = Object.values(donationResultsByUser);

    return {
      data: result,
    };
  };

  checkmanualDonation = async (req, res) => {
    const response = await db.ManualDonation.findOne({
      where: {
        id: req.body.id,
      },
    });
    return response;
  };

  deletemanualDonation = async (req, res) => {
    const response = await db.ManualDonation.destroy({
      where: {
        id: req.body.id,
      },
    });
    return response;
  };

  deleteDonationType = async (req, res) => {
    const response = await TblDonationTypes.destroy({
      where: {
        id: req.body.id,
        modeOfType: req.body.type,
      },
    });
    return response;
  };
}

module.exports = new DonationCollaction();
