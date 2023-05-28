const httpStatus = require("http-status");
const RoomCollection = require("../collections/Room.collection");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const crypto = require('crypto');



// Usage: generate a random ID with 8 characters

const checkOut = async (req, res) => {

  const data = await RoomCollection.roomCheckOut(req);


  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
};

const forceCheckOut = async (req, res) => {

  const data = await RoomCollection.forceCheckOut(req);


  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
};

const cancelCheckin = async (req, res) => {

  const data = await RoomCollection.cancelCheckin(req);


  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
};

const updateCheckinPayment = async (req, res) => {

  const data = await RoomCollection.updateCheckinPayment(req);


  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
};

const getBookingFromBookingId = async (req, res) => {

  const data = await RoomCollection.getBookingFromBookingId(req);
  
  res.send(
    {
      isExist: data ? true : false,
      data: data ? data :'No rooms Found'
    }
  );
};

const updateHoldinDateTime = async (req, res) => {

  const data = await RoomCollection.updateHoldinDateTime(req);


  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
};

const getCancelHistory = async (req, res) => {

  const data = await RoomCollection.getCancelHistory(req);


  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
};

const getHoldinHistory = async (req, res) => {

  const data = await RoomCollection.getHoldinHistory(req);


  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
};

const savePaymentDetails = catchAsync(async (req, res) => {
  const data = await RoomCollection.savePaymentDetails(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(200).send({
    data: data,
  });
});

const getInfoByBookingId = catchAsync(async (req, res) => {
  const data = await RoomCollection.getInfoByBookingId(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(200).send({
    data: data,
  });
});

const checkinHistoryUser = catchAsync(async (req, res) => {
  const data = await RoomCollection.checkinHistoryUser(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(200).send({
    data: data,
  });
});

const getRoomBookingReport = async (req, res) => {

  const data = await RoomCollection.getRoomBookingReport(req);


  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
};

const getRoomBookingStats = async (req, res) => {

  const data = await RoomCollection.getRoomBookingStats(req);


  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
};

const getEmployeeBookingStats = async (req, res) => {

  const data = await RoomCollection.getRoomBookingStats(req, false, true);


  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
};

const getRoomBookingStats2 = async (req, res) => {

  const data = await RoomCollection.getRoomBookingStats(req, true);


  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
};

const getEmployeeBookingStats2 = async (req, res) => {

  const data = await RoomCollection.getRoomBookingStats(req, true, true);


  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
};

const getGuests = async (req, res) => {

  const data = await RoomCollection.getGuests(req);


  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
};

const employeeGetGuests = async (req, res) => {

  const data = await RoomCollection.getGuests(req, true);


  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
};






const checkIn = catchAsync(async (req, res) => {

  let ccheckin = await RoomCollection.getCheckinCount()
  let bookingID = `b00${ccheckin}`
  console.log(ccheckin)
  const data = await RoomCollection.roomCheckin(req, bookingID);


  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
});

const userCheckin = catchAsync(async (req, res) => {

  let ccheckin = await RoomCollection.getCheckinCount()
  let bookingID = `b00${ccheckin}`
  console.log(ccheckin)
  const data = await RoomCollection.roomCheckin(req, bookingID, true);


  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
});



const getCheckin = catchAsync(async (req, res) => {
  const data = await RoomCollection.getCheckinNew(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
});

const getCheckinbyId = catchAsync(async (req, res) => {
  const data = await RoomCollection.getCheckinById(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
});

const checkinPayment = catchAsync(async (req, res) => {
  const data = await RoomCollection.checkinPayment(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
});

const checkinuser = catchAsync(async (req, res) => {
  const data = await RoomCollection.checkinuser(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
});

const delCheckin = catchAsync(async (req, res) => {
  const data = await RoomCollection.delCheckin(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
});

const editCheckin = catchAsync(async (req, res) => {
  const data = await RoomCollection.editCheckin(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
});

const CreateFacilities = catchAsync(async (req, res) => {
  const data = await RoomCollection.CreateFacilities(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
});


const getFacilities = catchAsync(async (req, res) => {
  const data = await RoomCollection.getFacilities(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
});

const delFacilities = catchAsync(async (req, res) => {
  const data = await RoomCollection.delFacilities(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
});



const editFacilities = catchAsync(async (req, res) => {
  const data = await RoomCollection.editFacilities(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
});


const CreateHoldIn = catchAsync(async (req, res) => {
  const data = await RoomCollection.CreateHoldIn(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
});

const getHoldIn = catchAsync(async (req, res) => {
  const data = await RoomCollection.getHoldIn(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
});

const delHoldIn = catchAsync(async (req, res) => {
  const data = await RoomCollection.delHoldIn(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
});

const editHoldIn = catchAsync(async (req, res) => {
  const data = await RoomCollection.editHoldIn(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
});

const CreateRooms = catchAsync(async (req, res) => {
  const data = await RoomCollection.CreateRooms(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
});


const getRooms = catchAsync(async (req, res) => {
  const data = await RoomCollection.getRooms(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
});

const delRooms = catchAsync(async (req, res) => {
  const data = await RoomCollection.delRooms(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
});

const editRooms = catchAsync(async (req, res) => {
  const data = await RoomCollection.editRooms(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
});

const getAvailableRoom = catchAsync(async (req, res) => {
  const data = await RoomCollection.getAvailableRoom(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
});

const getRoomHistory = catchAsync(async (req, res) => {
  const data = await RoomCollection.getRoomHistory(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
});

const getRoomHistoryEmployee = catchAsync(async (req, res) => {
  const data = await RoomCollection.getRoomHistory(req, true);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
});


const CreateRoomCategory = catchAsync(async (req, res) => {
  const data = await RoomCollection.CreateRoomCategory(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
});

const getRoomCategory = catchAsync(async (req, res) => {
  const data = await RoomCollection.getRoomCategory(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
});

const delRoomCategory = catchAsync(async (req, res) => {
  const data = await RoomCollection.delRoomCategory(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
});
const editRoomCategory = catchAsync(async (req, res) => {
  const data = await RoomCollection.editRoomCategory(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
});


const createDharmasala = catchAsync(async (req, res) => {
  const data = await RoomCollection.createDharmasala(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
});

const getDharmasala = catchAsync(async (req, res) => {
  const data = await RoomCollection.getDharmasala(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
});

const getDharmasalaData = catchAsync(async (req, res) => {
  const data = await RoomCollection.getDharmasalaData(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
});

const editDharmasala = catchAsync(async (req, res) => {
  const data = await RoomCollection.editDharmasala(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  if (data.status == "false") {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  } else {
    res.send(data)
  }
});

const getonlineRooms = catchAsync(async (req, res) => {
  const data = await RoomCollection.getonlineRooms(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  if (data.status == "false") {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  } else {
    res.send(data)
  }
});

const changeDharmasala = catchAsync(async (req, res) => {
  const data = await RoomCollection.changeDharmasala(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.send({
    data
  });
});

const getbyCategory = catchAsync(async (req, res) => {
  const data = await RoomCollection.getbyCategory(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(data.statusCode).send({
    message: data.message,
    data: data.data
  });
});


const createBookingPara = catchAsync(async (req, res) => {
  const data = await RoomCollection.createBookingPara(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(data.statusCode).send({
    message: data.message,
    data: data.data
  });
});


const getAvailableRoombyCategory = catchAsync(async (req, res) => {
  const data = await RoomCollection.getAvailableRoombyCategory(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(data.statusCode).send({
    message: data.message,
    data: data.data
  });
});


module.exports = {
  createBookingPara,
  getAvailableRoombyCategory,
  checkIn,
  getCheckin,
  getbyCategory,
  editDharmasala,
  getDharmasala,
  changeDharmasala,
  createDharmasala,
  CreateHoldIn,
  CreateFacilities,
  CreateRooms,
  CreateRoomCategory,
  getFacilities,
  getHoldIn,
  getRooms,
  getRoomCategory,
  delCheckin,
  editCheckin,
  delFacilities,
  editFacilities,
  delHoldIn,
  getCheckinbyId,
  editHoldIn,
  delRooms,
  editRooms,
  getonlineRooms,
  delRoomCategory,
  getAvailableRoom,
  checkinPayment,
  checkinuser,
  editRoomCategory,
  getRoomHistory,
  checkOut,
  updateHoldinDateTime,
  getRoomBookingReport,
  getRoomBookingStats,
  getRoomHistoryEmployee,
  getGuests,
  getRoomBookingStats2,
  forceCheckOut,
  updateCheckinPayment,
  getEmployeeBookingStats,
  getEmployeeBookingStats2,
  employeeGetGuests,
  cancelCheckin,
  getBookingFromBookingId,
  getCancelHistory,
  getHoldinHistory,
  getDharmasalaData,
  savePaymentDetails,
  getInfoByBookingId,
  checkinHistoryUser,
  userCheckin
}