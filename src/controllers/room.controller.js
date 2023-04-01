const httpStatus = require("http-status");
const RoomCollection = require("../collections/Room.collection");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const crypto = require('crypto');



// Usage: generate a random ID with 8 characters





const checkIn = catchAsync(async (req, res) => {
  
  let ccheckin = await  RoomCollection.getCheckinCount()
  let bookingID = `b00${ccheckin}`
console.log(ccheckin)
    const data = await RoomCollection.roomCheckin(req,bookingID);

    
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
    }
    res.send({
    data
    });
  });

  const getCheckin = catchAsync(async (req, res) => {
    const data = await RoomCollection.getCheckin(req);
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

  const checkinPayment =  catchAsync(async (req, res) => {
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


  const CreateHoldIn =  catchAsync(async (req, res) => {
    const data = await RoomCollection.CreateHoldIn(req);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
    }
    res.send({
    data
    });
  });

  const getHoldIn =  catchAsync(async (req, res) => {
    const data = await RoomCollection.getHoldIn(req);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
    }
    res.send({
    data
    });
  });

  const delHoldIn =  catchAsync(async (req, res) => {
    const data = await RoomCollection.delHoldIn(req);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
    }
    res.send({
    data
    });
  });

  const editHoldIn =  catchAsync(async (req, res) => {
    const data = await RoomCollection.editHoldIn(req);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
    }
    res.send({
    data
    });
  });

  const CreateRooms =  catchAsync(async (req, res) => {
    const data = await RoomCollection.CreateRooms(req);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
    }
    res.send({
    data
    });
  });


  const getRooms =  catchAsync(async (req, res) => {
    const data = await RoomCollection.getRooms(req);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
    }
    res.send({
    data
    });
  });

  const delRooms =  catchAsync(async (req, res) => {
    const data = await RoomCollection.delRooms(req);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
    }
    res.send({
    data
    });
  });

  const editRooms =  catchAsync(async (req, res) => {
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

  const editDharmasala = catchAsync(async (req, res) => {
    const data = await RoomCollection.editDharmasala(req);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
    }
    if(data.status == "false"){
      throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
    }else{
      res.send(data)
    }
  });

  const getonlineRooms = catchAsync(async (req, res) => {
    const data = await RoomCollection.getonlineRooms(req);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
    }
    if(data.status == "false"){
      throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
    }else{
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


  const createBookingPara  = catchAsync(async (req, res) => {
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
    editRoomCategory
  }