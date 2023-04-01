const { request } = require("express");
const httpStatus = require("http-status");
const { Op } = require("sequelize");
const sequelize = require("../db/db-connection");
const db = require("../models");
const ApiError = require("../utils/ApiError");
const TblVoucher = db.Vouchers;
const TblEmployee = db.employees;
const TblEmpRoles = db.empRoles;
const TblReceipt = db.Receipt;
const TblElec = db.ElecDonationModel;
const TblDonation = db.newDonationModel;

class voucherCollection {
  generateVoucher = async (req) => {
    const { vPrefix, from, to, user } = req.body;

    let data;

    await TblVoucher.destroy({
      where: {
        assign: user,
      },
    });

    const checkVoucher = await TblVoucher.findAll({
      where: {
        from: {
          [Op.lte]: Number(from),
        },
        to: {
          [Op.gte]: Number(to),
        },
      },
    });

    console.log(checkVoucher, "voucher");

    if (checkVoucher.length === 0) {
      let username = await TblEmployee.findOne({
        where: {
          id: user,
        },
      });
      let usrs = username.toJSON().Username;
      const voucher = await TblVoucher.create({
        vPrefix: vPrefix,
        from: Number(from),
        to: Number(to),
        assign: user,
        name: usrs,
      })
        .then((res) => {
          return {
            message: res,
          };
        })
        .catch((err) => {
          return {
            message: err,
          };
        });

      await TblEmployee.update(
        {
          isRequest: false,
        },
        {
          where: {
            id: user,
          },
        }
      );
      console.log(voucher);
      return (data = {
        status: true,
        message: "Voucher Created Successfully",
      });
    }
    return (data = {
      status: false,
      message: "This Vouchers is already Assigned to another user",
    });
  };

  checkVoucher = async (req, voucher) => {
    const userId = req.user.id;
    console.log(userId);
    console.log(voucher, "voucher check Api");
    let data;
    // here get The VoucherNumber that needs to be checked

    let AssignedVoucher = await TblVoucher.findOne({
      //geting the assigned voucherrss
      where: {
        from: {
          [Op.lte]: Number(voucher),
        },
        to: {
          [Op.gte]: Number(voucher),
        },
        assign: userId,
        status: true,
      },
    });
    console.log(AssignedVoucher, "Asssinged vouchefrs");
    let allVoucher = await TblVoucher.findOne({
      //geting the assigned voucherrss
      where: {
        assign: userId,
        status: true,
      },
    });

    console.log(AssignedVoucher, "voucher");
    if (AssignedVoucher === null && allVoucher) {
      console.log(
        Number(voucher),
        "first eneter",
        Number(allVoucher.from),
        Number(allVoucher.to)
      );
      if (
        Number(allVoucher.from) >= Number(voucher) &&
        Number(voucher) <= Number(allVoucher.to)
      ) {
        if (allVoucher.voucher === 0) {
          data = {
            status: true,
            message: "User Has been assigned ",
            data: allVoucher.from,
          };
          console.log(allVoucher.from, "Voucher Assigned");
        } else {
          if (allVoucher.voucher > allVoucher.to) {
            data = {
              status: false,
              message: "Your Voucher is Exhausted Please Request to admin  ",
            };
          } else {
            console.log("entity");
            if (allVoucher.voucher === allVoucher.from) {
              data = {
                status: true,
                message: "User Has been assigned ",
                data: allVoucher.voucher + 1,
              };
            } else {
              data = {
                status: true,
                message: "User Has been assigned ",
                data: allVoucher.voucher,
              };
            }
          }
        }
      }
    } else {
      data = {
        status: false,
        message: "No Vouchers Assigned Request to Admin  ",
      };
    }

    if (AssignedVoucher) {
      data = {
        status: true,
        message: "User Has been assigned",
      };
    }

    if (!data) {
      data = {
        status: false,
        message: "no Vouchers Assigned",
      };
    }

    return data;
  };

  getVoucher = async (req, id) => {
    let userId = req.user.id;

    console.log(userId);
    let voucher;

    if (id) {
      voucher = await TblVoucher.findOne({
        where: {
          assign: userId,
          status: true,
        },
      });

      return voucher;
    } else {
      voucher = await TblVoucher.findAll();

      return voucher;
    }
  };

  requestVoucher = async (req) => {
    const id = req.user.id;

    const Voucher = await TblEmployee.update(
      {
        isRequest: true,
      },
      {
        where: {
          id: id,
        },
      }
    );
    return Voucher;
  };

  getrequestVoucher = async (req) => {
    const request = await TblEmployee.findAll({
      where: {
        isRequest: true,
      },
      attributes: ["id", "Username", "Role"],
    });
    return request;
  };

  EmployeeRole = async (req) => {
    const {
      roleName,
      roleDesc,
      DAdd,
      DDel,
      Dedt,
      Denq,
      RAdd,
      RDel,
      Redt,
      Renq,
    } = req.body;

    const roles = await TblEmpRoles.create({
      roleName,
      roleDesc,
      DAdd,
      DDel,
      Dedt,
      Denq,
      RAdd,
      RDel,
      Redt,
      Renq,
    }).catch((err) => {
      console.error(err);
    });

    return roles;
  };

  getEmployeeRole = async () => {
    let roles = await TblEmpRoles.findAll();

    return roles;
  };

  EditEmployeeRole = async (req) => {
    const {
      id,
      roleName,
      roleDesc,
      DAdd,
      DDel,
      Dedt,
      Denq,
      RAdd,
      RDel,
      Redt,
      Renq,
    } = req.body;

    const updatedRoles = await TblEmpRoles.update(
      {
        roleName: roleName,
        roleDesc: roleDesc,
        DAdd: DAdd,
        DDel: DDel,
        Dedt: Dedt,
        Denq: Denq,
        RAdd: RAdd,
        RDel: RDel,
        Redt: Redt,
        Renq: Renq,
      },
      {
        where: {
          id: id,
        },
      }
    );
    return updatedRoles;
  };

  createReceipt = async (req) => {
    let { receipt, type } = req.body;
    let data;
    await TblReceipt.create({
      receipt: receipt,
      type: type,
    })
      .then(() => {
        data = {
          statusCode: 200,
          status: true,
          Message: "ReceiptNo. Added Successfully",
        };
      })
      .catch(() => {
        data = {
          statusCode: 500,
          status: false,
          Message: "ReceiptNo. Failed to Add",
        };
      });

    if (!data) {
      data = {
        statusCode: 401,
        status: false,
        Message: "Something went wrong",
      };
    }
    return data;
  };

  getReceipt = async (type) => {
    console.log(type, "type");
    let Receiptno;
    let tType;
    let counter;
    let count;

    if ((type && type !== 5) || (type !== 6 && type !== undefined)) {
      count = await TblElec.count({
        where: {
          modeOfDonation: type,
        },
      });

      if (type == 5 || type == 6) {
        type == 5 ? (tType = "ONLINE") : type == 6 ? (tType = "CHEQUE") : null;

        console.log(type, "tpyeeee");
        count = await TblDonation.count({
          where: {
            MODE_OF_DONATION: tType,
          },
        });
      }

      Receiptno = await TblReceipt.findOne({
        where: {
          type: type,
          status: 1,
        },
      });

      if (!Receiptno) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          "Receipt No. is not Assigned Please Assign First before trying again"
        );
      }
      let vv = Receiptno?.receipt.split("-");
      if (vv[3]) {
        counter = vv[3];
        let length = counter.length;
        let withoutCounter = Receiptno?.receipt.replaceAll(counter, "");
        let Ncounter = Number(counter);
        let incr = Ncounter + count;
        console.log(counter, "counter");
        let test = parseInt(incr).toLocaleString("en-US", {
          minimumIntegerDigits: length,
          useGrouping: false,
        });

        console.log(test, "test");
        let FinalReceipt = withoutCounter + test;
        return FinalReceipt;
      } else {
        vv = Receiptno?.receipt.split("/");
        counter = vv[2];
        let length = counter.length;
        let withoutCounter = Receiptno?.receipt.replaceAll(counter, "");
        let NRcounter = Number(counter);
        let RN = NRcounter + count;
        let test = parseInt(RN).toLocaleString("en-US", {
          minimumIntegerDigits: length,
          useGrouping: false,
        });

        console.log(test, "test");
        let fR = withoutCounter + test;
        return fR;
      }
    } else {
      Receiptno = await TblReceipt.findAll();
      return Receiptno;
    }
  };

  changeReceiptStatus = async (req) => {
    const { id, type, status } = req.body;
    let data;
    if (status == "1") {
      await TblReceipt.update(
        {
          status: 1,
        },
        {
          where: {
            id: id,
            type: type,
          },
        }
      )
        .then(() => {
          data = {
            statusCode: 200,
            status: true,
            message: "ReceiptNo. Status changed successfully",
          };
        })
        .catch(() => {
          data = {
            statusCode: 500,
            status: false,
            message: "Failed to update status of ReceiptNo",
          };
        });
    } else if (status == "0") {
      await TblReceipt.update(
        {
          status: 0,
        },
        {
          where: {
            id: id,
            type: type,
          },
        }
      )
        .then(() => {
          data = {
            statusCode: 200,
            status: true,
            message: "ReceiptNo. Status changed successfully",
          };
        })
        .catch(() => {
          data = {
            statusCode: 500,
            status: false,
            message: "Failed to update status of ReceiptNo",
          };
        });
    }
    if (!data) {
      data = {
        statusCode: 401,
        status: false,
        message: "something went wrong",
      };
    }
    return data;
  };

  deleteVoucher = async (req) => {
    const { id } = req.query;
    let result;
    await TblVoucher.destroy({
      where: {
        id: id,
      },
    })
      .then((res) => {
        if (res == 1) {
          result = {
            statusCode: 200,
            status: true,
            message: "Voucher deleted successfully",
          };
        } else {
          result = {
            statusCode: 401,
            status: false,
            message: "failed to delete Voucher",
          };
        }
      })
      .catch((err) => {
        result = {
          statusCode: 401,
          status: false,
          message: "failed to delete Voucher",
        };
      });

    return result;
  };

  editVoucher = async (req) => {
    const { id, from, to } = req.body;
    console.log(req.body);
    let result;
    await TblVoucher.update(
      {
        from: from,
        to: to,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((res) => {
        if (res[0] == 1) {
          result = {
            statusCode: 200,
            status: "true",
            message: "Voucher updated successfully",
          };
        } else {
          result = {
            statusCode: 401,
            status: "false",
            message: "Voucher failed to update",
          };
        }
      })
      .catch(() => {
        result = {
          statusCode: 401,
          status: "false",
          message: "Voucher failed to update",
        };
      });

    return result;
  };
}

module.exports = new voucherCollection();
