const httpStatus = require("http-status");
const { donationController, voucherController } = require(".");
const { VoucherCollection, DonationCollection } = require("../collections");
const { generateElcVoucherNo } = require("../services/donation.service");
const ApiError = require("../utils/ApiError");

const catchAsync = require("../utils/catchAsync");

const GenerateVoucher = catchAsync(async (req, res) => {
  const data = await VoucherCollection.generateVouchers(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  console.log(data);
  res.send({
    data,
  });
});

const getVoucherr  = async(req,res)=>{
  let voucher =  await VoucherCollection.getVoucherr(req,1)
  res.send(voucher)
}

const updateVoucher = async(req,res)=>{
  let voucher =  await VoucherCollection.updateVoucher(req,1)
  res.send(voucher)

}
const getVoucherEach = catchAsync(async (req, res) => {
  const lastID = await DonationCollection.getElecLastID();
  let voucherNo = lastID + 1;

  voucherNo = parseInt(voucherNo).toLocaleString("en-US", {
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
  }
  let isCancelled = await DonationCollection.getCancelledVoucher(voucherNo);
  let checking;
  if (isCancelled) {
    let nV = Number(voucherNo) + 1;
    fk = parseInt(nV).toLocaleString("en-US", {
      minimumIntegerDigits: 4,
      useGrouping: false,
    });

    checking = await VoucherCollection.checkVoucher(req, fk);
  } else {
    checking = await VoucherCollection.checkVoucher(req, voucherNo);
  }

  if (checking.status === true) {
    console.log("done");
    let vss = await VoucherCollection.getVoucher(req, (id = 1));
    if (vss.voucher === 0) {
      voucherNo = parseInt(vss.from).toLocaleString("en-US", {
        minimumIntegerDigits: 4,
        useGrouping: false,
      });
    } else {
      if (vss.voucher === vss.from) {
        let countV = vss.voucher + 1;
        voucherNo = parseInt(countV).toLocaleString("en-US", {
          minimumIntegerDigits: 4,
          useGrouping: false,
        });
      } else {
        voucherNo = parseInt(vss.voucher).toLocaleString("en-US", {
          minimumIntegerDigits: 4,
          useGrouping: false,
        });
      }
    }
  }

  if (!voucherNo) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  if (voucherNo) {
    let exist = Number(voucherNo);
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

      voucherNo = fk;
    }
  }

  res.send({
    status: true,
    data: voucherNo,
  });
});


const NewgetVoucherEach = catchAsync(async (req, res) => {
  try {
    const getvoucher =  await DonationCollection.NewgetVoucherEach(req.query.id);

    console.log(getvoucher);
    return res.status(httpStatus.OK).send({
      status : true,
      message : "latest voucher found",
      data : parseInt(getvoucher[0].voucherNo) + 1
    })

  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send({
      status : false,
      message : error.message,
      data:error,
    })
  }
})



const checknewvoucher = catchAsync(async (req, res) => {
  try {
    const getvoucher =  await DonationCollection.NewgetVoucherEach(req.query.id);
    const assignedvoucher =  await DonationCollection.newassignedvoucher(req.query.id);


    if(getvoucher.length !== 0 && assignedvoucher!== 0 ){
      if(getvoucher[0].voucherNo === assignedvoucher[0].to ){
        return res.status(httpStatus.OK).send({
          status : true,
          message : "all voucher used ",
        })
      }
      else{
        return res.status(httpStatus.BAD_REQUEST).send({
          status : false,
          message : "still have voucher",
        })
      }
     
    }else{
      return res.status(httpStatus.BAD_REQUEST).send({
        status : false,
        message : "no data found",
      })
    }

  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send({
      status : false,
      message : error.message,
      data:error,
    })
  }
})




const checkVoucher = catchAsync(async (req, res) => {
  const lastID = await DonationCollection.getElecLastID();
  let voucherNo = lastID + 1;
  voucherNo = parseInt(voucherNo).toLocaleString("en-US", {
    minimumIntegerDigits: 4,
    useGrouping: false,
  });
  console.log(voucherNo, "voucher");

  let checkVoucherNumber = await DonationCollection.checkVoucherNumberExists(
    voucherNo
  );
  // console.log(checkVoucherNumber,"check")

  if (checkVoucherNumber) {
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
    console.log("NO ALREADY VOUCHER EXISTS");
  }

  let isCancelled = await DonationCollection.getCancelledVoucher(voucherNo);
  let data;
  if (isCancelled) {
    let nV = Number(voucherNo) + 1;
    let fk = parseInt(nV).toLocaleString("en-US", {
      minimumIntegerDigits: 4,
      useGrouping: false,
    });
    data = await VoucherCollection.checkVoucher(req, fk);
  } else {
    console.log("oassibg voucehr", voucherNo);
    data = await VoucherCollection.checkVoucher(req, voucherNo);
  }

  console.log(data);

  if (!data) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "!something Went Wrong");
  }

  res.status(200).send({
    status: data.status,
    message: data.message,
  });
});

const getVoucher = catchAsync(async (req, res) => {
  const data = await VoucherCollection.getVoucher(req);

  if (!data) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "!somthing Went Wrong");
  }

  res.status(200).send({
    status: true,
    data: data,
  });
});

const requestVoucher = catchAsync(async (req, res) => {
  const data = await VoucherCollection.requestVoucher(req);

  if (!data) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "!somthing Went Wrong");
  }

  res.status(200).send({
    status: true,
    data: "Successfully requested Wait for the Admin Approval !",
  });
});

const deleteVoucherRequest = async (req, res) => {
  const data = await VoucherCollection.deleteVoucherRequest(req);

  if (!data?.status) {
    return res.status(200).send(data);
  }

  res.status(200).send({
    status: true,
    data: "Successfully deleted voucher Request!",
  });
};

const getrequestVoucher = catchAsync(async (req, res) => {
  const data = await VoucherCollection.getrequestVoucher(req);

  if (!data) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "!somthing Went Wrong");
  }

  res.status(200).send({
    status: true,
    data: data,
  });
});

const EmployeeRole = catchAsync(async (req, res) => {
  const data = await VoucherCollection.EmployeeRole(req);

  if (!data) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "!somthing Went Wrong");
  }

  res.status(200).send({
    status: true,
    message: "Successfully created a new role",
  });
});

const getEmployeeRole = catchAsync(async (req, res) => {
  const data = await VoucherCollection.getEmployeeRole(req);

  if (!data) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "!somthing Went Wrong");
  }

  res.status(200).send({
    status: true,
    data: data,
  });
});

const EditEmployeeRole = catchAsync(async (req, res) => {
  const data = await VoucherCollection.EditEmployeeRole(req);

  if (!data) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "!somthing Went Wrong");
  }

  res.status(200).send({
    status: true,
    message: "Successfully updated Role",
  });
});

const createReceipt = catchAsync(async (req, res) => {
  const data = await VoucherCollection.createReceipt(req);

  if (!data) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "!somthing Went Wrong");
  }

  res.status(data.statusCode).send({
    status: data.status,
    Message: data.Message,
  });
});

const getReceipt = catchAsync(async (req, res) => {
  const data = await VoucherCollection.getReceipt(req.query.type);

  if (!data) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "!somthing Went Wrong");
  }

  res.status(200).send({
    status: true,
    data: data,
  });
});

const changeReceiptStatus = catchAsync(async (req, res) => {
  const data = await VoucherCollection.changeReceiptStatus(req);

  if (!data) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "!somthing Went Wrong");
  }

  res.status(data.statusCode).send({
    status: data.status,
    message: data.message,
  });
});

const deleteVoucher = catchAsync(async (req, res) => {
  const data = await VoucherCollection.deleteVoucher(req);

  if (!data) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "!somthing Went Wrong");
  }

  res.status(data.statusCode).send({
    status: data.status,
    message: data.message,
  });
});

const editVoucher = catchAsync(async (req, res) => {
  const data = await VoucherCollection.editVoucher(req);

  if (!data) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "!somthing Went Wrong");
  }

  res.status(data.statusCode).send({
    status: data.status,
    message: data.message,
  });
});

module.exports = {
  GenerateVoucher,
  editVoucher,
  deleteVoucher,
  checkVoucher,
  getVoucher,
  getVoucherr,
  requestVoucher,
  getrequestVoucher,
  EmployeeRole,
  getEmployeeRole,
  EditEmployeeRole,
  createReceipt,
  getReceipt,
  changeReceiptStatus,
  getVoucherEach,
  NewgetVoucherEach,
  checknewvoucher,
  updateVoucher,
  deleteVoucherRequest
};
