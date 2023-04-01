const { request, raw } = require("express");
const httpStatus = require("http-status");
const { Op, Sequelize, QueryTypes } = require("sequelize");
const sequelize = require("../db/db-connection");
const uploadimage = require("../middlewares/imageupload");
const db = require("../models");
const ApiError = require("../utils/ApiError");

const TblCheckin = db.Checkin;
const TblRoom = db.Rooms;
const TblHoldin = db.holdIn;
const TblRoomCategory = db.RoomCategory;
const TblFacility = db.facility;
const TblDharmasal = db.dharmashala;

// sequelize
//   .sync({ alter: true })
//   .then(() => {
//     console.log("Model synced successfully");
//   })
//   .catch((err) => {
//     console.error("Error syncing model", err);
//   });

class RoomCollection {
  roomCheckin = async (req, id) => {
    let result;
    req.body.booking_id = id;
    let booked_by = req.user.id;

    req.body.booked_by = booked_by;
    let { coutDate, coutTime, date, time, dharmasala } = req.body;
    const roomNo = parseInt(req.body.RoomNo);

    
    const existingBooking = await TblCheckin.findOne({
      where: {
        RoomNo: roomNo,
        dharmasala: dharmasala,
        [Op.or]: [
          {
            coutDate: {
              [Op.gt]: date // check-out date is after desired check-in date
            }
          },
          {
            coutDate: {
              [Op.eq]: date // check-out date is equal to desired check-in date
            },
            coutTime: {
              [Op.gt]: time // check-out time is after desired check-in time
            }
          }
        ]
      },
      raw: true,
    });

    if (existingBooking) {
      throw new ApiError(httpStatus.CONFLICT, "The Room has already in use");
    }

    let perDayhour = await TblRoom.findOne({
      where: {
        FroomNo: { [Op.lte]: roomNo },
        TroomNo: { [Op.gte]: roomNo },
      },
      raw: true,
    });

    perDayhour = perDayhour.coTime;
    const maxDurationInHours = 3 * perDayhour;
    const maxDurationInMs = maxDurationInHours * 60 * 60 * 1000;
    const checkinDateTime = new Date(`${date}T${time}`);
    const maxCheckoutDateTime = new Date(
      checkinDateTime.getTime() + maxDurationInMs
    );
    const userCheckoutDateTime = new Date(
      Date.parse(`${coutDate}T${coutTime}`)
    );

    

    if (userCheckoutDateTime.getTime() > maxCheckoutDateTime.getTime()) {
      throw new ApiError(
        httpStatus.CONFLICT,
        "Checkout date and time exceeds the maximum duration for this booking 3 days is only allowed to book at one time"
      );
    }

    let room = await TblCheckin.create(req.body)
      .then((res) => {
        result = {
          status: true,
          message: "Room Booked successfully",
          data: res,
        };
      })
      .catch((err) => {
    
        result = {
          status: false,
          message: "Room failed to book",
        };
      });

    return result || room;
  };

  getCheckin = async () => {
    const query = `
  SELECT tbl_checkins.name AS holderName, tbl_dharmasalas.name AS dharmasala_name, tbl_checkins.*, tbl_dharmasalas.*, tbl_rooms.FroomNo, tbl_rooms.TroomNo, tbl_rooms.*,tbl_rooms.facility_id, tbl_rooms.category_id
  FROM tbl_checkins
  JOIN tbl_dharmasalas ON tbl_checkins.dharmasala = tbl_dharmasalas.dharmasala_id
  JOIN tbl_rooms ON tbl_checkins.RoomNo BETWEEN tbl_rooms.FroomNo AND tbl_rooms.TroomNo  
  `;
    const [results, metadata] = await sequelize.query(query);
    let facilitiesCategory = results?.map((facility) => {
      facility.facility_id = JSON.parse(JSON.parse(facility.facility_id));
      facility.category_id = JSON.parse(JSON.parse(facility.category_id));
      return facility;
    });

    await Promise.all(
      facilitiesCategory.map(async (facility) => {
        console.log(facility);
        const categories = await TblRoomCategory.findAll({
          where: { category_id: facility.category_id },
        });
        facility.category_name = categories.map((category) => category.name);

        const facilities = await TblFacility.findAll({
          where: { facility_id: facility.facility_id },
        });
        const dharmasala = await TblDharmasal.findOne({
          where: {
            dharmasala_id: facility.dharmasala_id,
          },
        });
        facility.dharmasala = dharmasala;
        facility.facility_name = facilities.map((facility) => facility.name);
      })
    );
    return results;
  };

  getCheckinById = async (req) => {
    let { id } = req.query;
    const query = `
      SELECT tbl_checkins.name AS holderName, tbl_dharmasalas.name AS dharmasala_name, tbl_checkins.*, tbl_dharmasalas.*, tbl_rooms.FroomNo, tbl_rooms.TroomNo, tbl_rooms.*,tbl_rooms.facility_id, tbl_rooms.category_id
      FROM tbl_checkins
      JOIN tbl_dharmasalas ON tbl_checkins.dharmasala = tbl_dharmasalas.dharmasala_id
      JOIN tbl_rooms ON tbl_checkins.RoomNo BETWEEN tbl_rooms.FroomNo AND tbl_rooms.TroomNo  
      WHERE tbl_checkins.id = ${id}
    `;
    const [results, metadata] = await sequelize.query(query);
    let facilitiesCategory = results?.map((facility) => {
      facility.facility_id = JSON.parse(JSON.parse(facility.facility_id));
      facility.category_id = JSON.parse(JSON.parse(facility.category_id));
      return facility;
    });

    await Promise.all(
      facilitiesCategory.map(async (facility) => {
        console.log(facility);
        const categories = await TblRoomCategory.findAll({
          where: { category_id: facility.category_id },
        });
        facility.category_name = categories.map((category) => category.name);

        const facilities = await TblFacility.findAll({
          where: { facility_id: facility.facility_id },
        });
        const dharmasala = await TblDharmasal.findOne({
          where: {
            dharmasala_id: facility.dharmasala_id,
          },
        });
        facility.dharmasala = dharmasala;
        facility.facility_name = facilities.map((facility) => facility.name);
      })
    );
    return results[0]; // return the first element in the results array
  };

  checkinPayment = async (req) => {
    let { paymentid, id, paymentStatus } = req.body;
    let result = "";

    result = await TblCheckin.update(
      {
        paymentid: paymentid,
        paymentStatus: paymentStatus == "Success" ? 1 : 0,
      },
      {
        where: {
          id: id,
        },
      }
    );

    return result;
  };

  checkinuser = async (req) => {
    let { id } = req.user;
    const query = `
      SELECT tbl_checkins.name AS holderName, tbl_dharmasalas.name AS dharmasala_name, tbl_checkins.*, tbl_dharmasalas.*, tbl_rooms.FroomNo, tbl_rooms.TroomNo, tbl_rooms.*,tbl_rooms.facility_id, tbl_rooms.category_id
      FROM tbl_checkins
      JOIN tbl_dharmasalas ON tbl_checkins.dharmasala = tbl_dharmasalas.dharmasala_id
      JOIN tbl_rooms ON tbl_checkins.RoomNo BETWEEN tbl_rooms.FroomNo AND tbl_rooms.TroomNo  
      WHERE tbl_checkins.booked_by = ${id}
    `;
    const [results, metadata] = await sequelize.query(query);
    let facilitiesCategory = results?.map((facility) => {
      facility.facility_id = JSON.parse(JSON.parse(facility.facility_id));
      facility.category_id = JSON.parse(JSON.parse(facility.category_id));
      return facility;
    });

    await Promise.all(
      facilitiesCategory.map(async (facility) => {
        console.log(facility);
        const categories = await TblRoomCategory.findAll({
          where: { category_id: facility.category_id },
        });
        facility.category_name = categories.map((category) => category.name);

        const facilities = await TblFacility.findAll({
          where: { facility_id: facility.facility_id },
        });
        const dharmasala = await TblDharmasal.findOne({
          where: {
            dharmasala_id: facility.dharmasala_id,
          },
        });
        facility.dharmasala = dharmasala;
        facility.facility_name = facilities.map((facility) => facility.name);
      })
    );
    return results; // return the first element in the results array
  };

  getCheckinCount = async () => {
    let count = await TblCheckin.count();

    return count;
  };

  delCheckin = async (req) => {
    let { id } = req.query;
    let result;

    let room = await TblCheckin.destroy({
      where: {
        id: id,
      },
    })
      .then((res) => {
        if (res == 1) {
          result = {
            status: true,
            message: "Room deleted successfully",
          };
        } else {
          result = {
            status: false,
            message: "failed to delete checkin",
          };
        }
      })
      .catch((err) => {
        result = {
          status: false,
          message: "Room failed to be deleted",
        };
      });
    return result;
  };

  editCheckin = async (req) => {
    let result;
    let { id } = req.body;

    await TblCheckin.update(req.body, {
      where: {
        id: id,
      },
    })
      .then((res) => {
        if (res[0] === 1) {
          result = {
            status: true,
            message: "Room updated successfully",
          };
        } else {
          result = {
            status: false,
            message: "Room failed to be update",
          };
        }
      })
      .catch((err) => {
        result = {
          status: false,
          message: "Room failed to be update",
        };
      });
    return result;
  };

  /// ROOM CHECKINNN

  //FACILITIES

  CreateFacilities = async (req) => {
    let result;
    let Facilites = await TblFacility.create({
      name: req.body.name,
      comments: req.body.comments,
    })
      .then((res) => {
        console.log(res, "resultsss");
        result = {
          status: true,
          message: "Facilites Created successfully",
        };
      })
      .catch((err) => {
        console.log(err);
        result = {
          status: false,
          message: "Facilites failed to Create",
        };
      });

    return result || Facilites;
  };

  getFacilities = async () => {
    let room = await TblFacility.findAll();

    // const facilitesWithoption = room.map((facility) => {
    //   const facilities = facility.toJSON();
    //   facilities.option = JSON.parse(facilities.option);
    //   return facilities;
    // });
    // return facilitesWithoption;

    return room;
  };

  delFacilities = async (req) => {
    let { id } = req.query;
    let result;

    let room = await TblFacility.destroy({
      where: {
        facility_id: id,
      },
    })
      .then((res) => {
        if (res == 1) {
          result = {
            status: true,
            message: "Facility deleted successfully",
          };
        } else {
          result = {
            status: false,
            message: "failed to deleted facility",
          };
        }
      })
      .catch((err) => {
        result = {
          status: false,
          message: "Facility failed to be deleted",
        };
      });
    return result;
  };

  editFacilities = async (req) => {
    let { id } = req.body;
    let result;
    await TblFacility.update(req.body, {
      where: {
        facility_id: id,
      },
    })
      .then((res) => {
        if (res[0] === 1) {
          result = {
            status: true,
            message: "Facilites updated successfully",
          };
        } else {
          result = {
            status: false,
            message: "Facilites failed to be update",
          };
        }
      })
      .catch((err) => {
        result = {
          status: false,
          message: "Facilites failed to be update",
        };
      });

    return result;
  };

  //ROOM Facilites

  //ROOM HOLDIN

  CreateHoldIn = async (req) => {
    let result;

    let Holdin = await TblHoldin.create(req.body)
      .then((res) => {
        console.log(res, "resultsss");
        result = {
          status: true,
          message: "Holdin Created successfully",
        };
      })
      .catch((err) => {
        console.log(err);
        result = {
          status: false,
          message: "Holdin failed to Create",
        };
      });

    return result || Holdin;
  };

  getHoldIn = async () => {
    let room = await TblHoldin.findAll();

    return room;
  };

  delHoldIn = async (req) => {
    let { id } = req.query;
    let result;

    let room = await TblHoldin.destroy({
      where: {
        id: id,
      },
    })
      .then((res) => {
        if (res == 1) {
          result = {
            status: true,
            message: "holdin deleted successfully",
          };
        } else {
          result = {
            status: false,
            message: "holdin failed to delete",
          };
        }
      })
      .catch((err) => {
        result = {
          status: false,
          message: "Holdin failed to be deleted",
        };
      });

    return result;
  };

  editHoldIn = async (req) => {
    let result;
    let { id } = req.body;
    await TblHoldin.update(req.body, {
      where: {
        id: id,
      },
    })
      .then((res) => {
        if (res[0] === 1) {
          result = {
            status: true,
            message: "Holdin updated successfully",
          };
        } else {
          result = {
            status: false,
            message: "Holdin failed to be update",
          };
        }
      })
      .catch((err) => {
        result = {
          status: false,
          message: "Holdin failed to be update",
        };
      });
    return result;
  };

  //ROOM HOLDIN

  //ROOM

  CreateRooms = async (req) => {
    let result;

    let { image1 = "" } = req.files || "";
    let { image2 = "" } = req.files || "";
    let { image3 = "" } = req.files || "";
    let { image4 = "" } = req.files || "";

    let upload1;
    let upload2;
    let upload3;
    let upload4;

    let uniqueRoom = await TblRoom.count({
      where: {
        dharmasala_id: req.body.dharmasala_id,
        [Op.or]: [
          { FroomNo: req.body.FroomNo },
          { TroomNo: req.body.TroomNo },
          {
            FroomNo: { [Op.lte]: req.body.FroomNo },
            TroomNo: { [Op.gte]: req.body.TroomNo },
          },
        ],
      },
    });

    if (image1) {
      upload1 = uploadimage(image1);
    }
    if (image2) {
      upload2 = uploadimage(image2);
    }
    if (image3) {
      upload3 = uploadimage(image3);
    }

    if (image4) {
      upload4 = uploadimage(image4);
    }

    if (uniqueRoom === 0) {
      if (Number(req.body.FroomNo) < Number(req.body.TroomNo)) {
        let categoryArray = JSON.stringify(req.body.category_id);
        let facilitiesArray = JSON.stringify(req.body.facility_id);
        let Room = await TblRoom.create({
          FroomNo: req.body.FroomNo,
          TroomNo: req.body.TroomNo,
          Rate: req.body.Rate,
          dharmasala_id: req.body.dharmasala_id,
          category_id: JSON.parse(categoryArray),
          status: req.body.status,
          roomType: req.body.type,
          advance: req.body.advance,
          Account: req.body.Account,
          facility_id: JSON.parse(facilitiesArray),
          coTime: req.body.coTime,
          image1: upload1,
          image2: upload2,
          image3: upload3,
          image4: upload4,
        })
          .then((res) => {
            console.log(res, "resultsss");
            result = {
              status: true,
              message: "Room Created successfully",
            };
          })
          .catch((err) => {
            console.log(err);
            result = {
              status: false,
              message: "Room failed to Create",
            };
          });
      } else {
        result = {
          status: false,
          message: "Room ToRoomNo must be greaterthan of FromRoomNo",
        };
      }
    } else {
      result = {
        status: false,
        message: "Room Already Exists for this Dharmasala",
      };
    }

    return result || Room;
  };

  getRooms = async () => {
    let rooms = await TblRoom.findAll();

    let facilitiesCategory = rooms?.map((facility) => {
      const facilities = facility.toJSON();
      facilities.facility_id = JSON.parse(JSON.parse(facilities.facility_id));
      facilities.category_id = JSON.parse(JSON.parse(facilities.category_id));
      return facilities;
    });

    await Promise.all(
      facilitiesCategory.map(async (facility) => {
        const categories = await TblRoomCategory.findAll({
          where: { category_id: facility.category_id },
        });
        facility.category_name = categories.map((category) => category.name);

        const facilities = await TblFacility.findAll({
          where: { facility_id: facility.facility_id },
        });
        const dharmasala = await TblDharmasal.findOne({
          where: {
            dharmasala_id: facility.dharmasala_id,
          },
        });
        facility.dharmasala = dharmasala;
        facility.facility_name = facilities.map((facility) => facility.name);
      })
    );

    return facilitiesCategory;
  };

  delRooms = async (req) => {
    let { id } = req.query;
    let result;

    let room = await TblRoom.destroy({
      where: {
        room_id: id,
      },
    })
      .then((res) => {
        if (res == 1) {
          result = {
            status: true,
            message: "Room deleted successfully",
          };
        } else {
          result = {
            status: false,
            message: "Room failed to be deleted",
          };
        }
      })
      .catch((err) => {
        result = {
          status: false,
          message: "Room failed to be deleted",
        };
      });
    return result;
  };

  editRooms = async (req) => {
    let result;

    let { image1 = "" } = req.files || "";
    let { image2 = "" } = req.files || "";
    let { image3 = "" } = req.files || "";
    let { image4 = "" } = req.files || "";

    let upload1;
    let upload2;
    let upload3;
    let upload4;

    if (image1) {
      upload1 = uploadimage(image1);
    }
    if (image2) {
      upload2 = uploadimage(image2);
    }
    if (image3) {
      upload3 = uploadimage(image3);
    }

    if (image4) {
      upload4 = uploadimage(image4);
    }

    let categoryArray = JSON.stringify(req.body.category_id);
    let facilitiesArray = JSON.stringify(req.body.facility_id);
    let Room = await TblRoom.update(
      {
        FroomNo: req.body.FroomNo,
        TroomNo: req.body.TroomNo,
        Rate: req.body.Rate,
        dharmasala_id: req.body.dharmasala_id,
        category_id: JSON.parse(categoryArray),
        status: req.body.status,
        roomType: req.body.type,
        advance: req.body.advance,
        Account: req.body.Account,
        facility_id: JSON.parse(facilitiesArray),
        coTime: req.body.coTime,
        image1: upload1,
        image2: upload2,
        image3: upload3,
        image4: upload4,
      },
      {
        where: {
          room_id: req.body.id,
        },
      }
    )
      .then((res) => {
        if (res[0] === 1) {
          result = {
            status: true,
            message: "Room updated successfully",
          };
        } else {
          result = {
            status: false,
            message: "Room failed to be update",
          };
        }
      })
      .catch((err) => {
        result = {
          status: false,
          message: "Room failed to be update",
        };
      });
    return result;
  };

  //ROOM
  getAvailableRoom = async (req) => {
    let {
      hotelName,
      checkinDate,
      checkinTime,
      checkoutDate,
      checkoutTime,
      numAdults,
      numChildren,
      numoFRooms,
      type,
    } = req.body;

    // Convert the date and time strings to JavaScript Date objects
    checkinDate = new Date(checkinDate);
    checkoutDate = new Date(checkoutDate);

    let whereclause = {};

    if (hotelName) {
      whereclause.dharmasala = hotelName;
    }

    if (checkoutDate && checkinDate) {
      whereclause.date = { [Op.lt]: checkoutDate };
      whereclause.time = { [Op.gt]: checkinDate };

      if (checkoutTime && checkinTime) {
        whereclause[Op.or] = [
          { date: checkoutDate, time: { [Op.lte]: checkoutTime } },
          { date: checkinDate, time: { [Op.gte]: checkinTime } },
        ];
      }
    }

    const replacements = { dharmasala_id: hotelName };

    if (type) {
      replacements.type = type;
    }

    // Query the check-in and holdin tables to find overlapping bookings and holds
    const conflictingCheckIns = await TblCheckin.findAll({
      where: whereclause,
    });

    const conflictingHolds = await TblHoldin.findAll({
      where: {
        dharmasala: hotelName,
        since: { [Op.lt]: checkoutDate },
        remain: { [Op.gt]: checkinDate },
        [Op.or]: [
          { since: checkoutDate, sinceTime: { [Op.lte]: checkoutTime } },
          { remain: checkinDate, remainTime: { [Op.gte]: checkinTime } },
        ],
      },
    });

    // Retrieve the room ranges from the database
    const roomRanges = await TblRoom.sequelize.query(
      `
      SELECT r.FroomNo AS \`from\`, r.TroomNo AS \`to\`, r.dharmasala_id,r.roomType,r.advance,r.category_id, r.facility_id,r.coTime,r.image1 AS \`roomImage1\`, r.image2 AS \`roomImage2\`, r.image3 AS \`roomImage3\`, r.image4 AS \`roomImage4\`, r.Rate,  d.*
      FROM tbl_rooms r
      JOIN tbl_dharmasalas d ON r.dharmasala_id = d.dharmasala_id
      WHERE r.dharmasala_id = :dharmasala_id
      ${type ? "AND r.roomType = :type" : ""}
      `,
      {
        replacements,
        type: QueryTypes.SELECT,
        raw: true,
        groupBy: ["dharmasala_id"],
      }
    );

    let facilitiesCategory = roomRanges?.map((facility) => {
      facility.facility_id = JSON.parse(JSON.parse(facility.facility_id));
      facility.category_id = JSON.parse(JSON.parse(facility.category_id));
      return facility;
    });

    await Promise.all(
      facilitiesCategory.map(async (facility) => {
        const categories = await TblRoomCategory.findAll({
          where: { category_id: facility.category_id },
        });
        facility.category_name = categories.map((category) => category.name);

        const facilities = await TblFacility.findAll({
          where: { facility_id: facility.facility_id },
        });
        const dharmasala = await TblDharmasal.findOne({
          where: {
            dharmasala_id: facility.dharmasala_id,
          },
        });
        facility.dharmasala = dharmasala;
        facility.facility_name = facilities.map((facility) => facility.name);
      })
    );

    // Generate the list of available rooms with room details
    const availableRooms = facilitiesCategory.reduce((result, range) => {
      const rangeNumbers = Array.from(
        { length: range.to - range.from + 1 },
        (_, i) => i + range.from
      );

      // Filter out the unavailable rooms
      const unavailableRooms = new Set([
        ...conflictingCheckIns.map((booking) => booking.roomNumber),
        ...conflictingHolds.map((hold) => hold.roomNumber),
      ]);
      const availableRoomNumbers = rangeNumbers.filter(
        (roomNumber) => !unavailableRooms.has(roomNumber)
      );

      // Add room details to the list of available rooms
      const availableRoomsInThisRange = availableRoomNumbers.map(
        (roomNumber) => ({
          roomNumber,
          ...range,
          dharmasala: {
            name: range.name,
            desc: range.desc,
            image: range.image1,
          },
        })
      );
      return result.concat(availableRoomsInThisRange);
    }, []);

    return availableRooms;
  };

  //ROOM CATEGORIES

  CreateRoomCategory = async (req) => {
    let result;

    let Room = await TblRoomCategory.create({
      name: req.body.name,
      comment: req.body.comment,
    })
      .then((res) => {
        console.log(res, "resultsss");
        result = {
          status: true,
          message: "Room Category Created successfully",
        };
      })
      .catch((err) => {
        console.log(err);
        result = {
          status: false,
          message: "Room Category failed to Create",
        };
      });

    return result || Room;
  };

  getRoomCategory = async () => {
    let RoomCategory = await TblRoomCategory.findAll();

    return RoomCategory;
  };

  delRoomCategory = async (req) => {
    let { id } = req.query;
    let result;

    let RoomCategory = await TblRoomCategory.destroy({
      where: {
        category_id: id,
      },
    })
      .then((res) => {
        if (res == 1) {
          result = {
            status: true,
            message: "Room category deleted successfully",
          };
        } else {
          result = {
            status: false,
            message: "Room category failed to be deleted",
          };
        }
      })
      .catch((err) => {
        result = {
          status: false,
          message: "Room Category failed to be deleted",
        };
      });
    return result;
  };

  editRoomCategory = async (req) => {
    let result;

    await TblRoomCategory.update(
      {
        name: req.body.name,
        comment: req.body.comment,
      },
      {
        where: {
          category_id: req.body.id,
        },
      }
    )
      .then((res) => {
        if (res[0] === 1) {
          result = {
            status: true,
            message: "Room Category updated successfully",
          };
        } else {
          result = {
            status: false,
            message: "Room Category failed to be update",
          };
        }
      })
      .catch((err) => {
        result = {
          status: false,
          message: "Room Category failed to be update",
        };
      });
    return result;
  };

  createDharmasala = async (req) => {
    let { name, nameH, desc } = req.body;
    let { image1, image2, image3, image4 } = req.files;
    let imagefirst = "";

    if (image1) {
      imagefirst = uploadimage(image1);
    }

    let data = await TblDharmasal.create({
      name: name,
      nameH: nameH,
      image1: imagefirst,

      desc: desc,
    });

    if (!data) {
      return {
        status: false,
        message: "failed to created Dharamashala",
      };
    }
    return {
      status: true,
      message: "Successfully created Dharamashala",
      data: data,
    };
  };

  getDharmasala = async (req) => {
    let { id } = req.query;
    let data;

    if (id) {
      data = await sequelize.query(
        `SELECT * FROM tbl_dharmasalas
        LEFT OUTER JOIN tbl_rooms ON tbl_dharmasalas.dharmasala_id = tbl_rooms.dharmasala_id
        WHERE tbl_dharmasalas.dharmasala_id = :id`,
        {
          replacements: { id },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      let facilitiesCategory = data?.map((facility) => {
        facility.facility_id = JSON.parse(JSON.parse(facility.facility_id));
        facility.category_id = JSON.parse(JSON.parse(facility.category_id));
        return facility;
      });

      await Promise.all(
        facilitiesCategory.map(async (facility) => {
          const categories = await TblRoomCategory.findAll({
            where: { category_id: facility.category_id },
          });
          facility.category_name = categories.map((category) => category.name);

          const facilities = await TblFacility.findAll({
            where: { facility_id: facility.facility_id },
          });
          const dharmasala = await TblDharmasal.findOne({
            where: {
              dharmasala_id: facility.dharmasala_id,
            },
          });
          facility.dharmasala = dharmasala;
          facility.facility_name = facilities.map((facility) => facility.name);
        })
      );
      const availableRooms = data.reduce((result, room) => {
        const rangeNumbers = Array.from(
          { length: room.TroomNo - room.FroomNo + 1 },
          (_, i) => i + room.FroomNo
        );
        rangeNumbers.forEach((roomNumber) => {
          result.push({
            roomNumber,
            ...room,
          });
        });
        return result;
      }, []);

      console.log(availableRooms);

      data = {
        ...data[0], // spread the first object in the array
        availableRooms,
      };

      return data;
    }

    data = await TblDharmasal.findAll({});

    return data;
  };

  // type 0 means online only 1 means offline only 2 means both
  getonlineRooms = async (req) => {
    let rooms = await TblRoom.findAll({
      where: {
        roomType: 1,
      },
    });

    let facilitiesCategory = rooms?.map((facility) => {
      const facilities = facility.toJSON();
      facilities.facility_id = JSON.parse(JSON.parse(facilities.facility_id));
      facilities.category_id = JSON.parse(JSON.parse(facilities.category_id));
      return facilities;
    });

    await Promise.all(
      facilitiesCategory.map(async (facility) => {
        const categories = await TblRoomCategory.findAll({
          where: { category_id: facility.category_id },
        });
        facility.category_name = categories.map((category) => category.name);

        const facilities = await TblFacility.findAll({
          where: { facility_id: facility.facility_id },
        });
        const dharmasala = await TblDharmasal.findOne({
          where: {
            dharmasala_id: facility.dharmasala_id,
          },
        });
        facility.dharmasala = dharmasala;

        facility.facility_name = facilities.map((facility) => facility.name);
      })
    );

    return facilitiesCategory;
  };

  editDharmasala = async (req) => {
    let result;
    let {
      id,
      name,
      nameH,
      desc,
      linkimage1,
      linkimage2,
      linkimage3,
      linkimage4,
    } = req.body;

    // let imagefirst = uploadimage(image1);
    // let imagesecond = uploadimage(image2);
    // let imagethird = uploadimage(image3);
    // let imagefourth = uploadimage(image4);

    const updatedFields = {
      name: name,
      nameH: nameH,
      desc: desc,
    };

    if (req.files && req.files.image1) {
      updatedFields.image1 = uploadimage(req.files.image1);
    }

    let data = await TblDharmasal.update(updatedFields, {
      where: {
        dharmasala_id: id,
      },
    })
      .then((Res) => {
        if (Res[0] == 1) {
          result = {
            status: "true",
            message: "Dharamasala updated successfully",
          };
        } else {
          result = {
            status: "false",
            message: "Dharamasala failed to update",
          };
        }
      })
      .catch((er) => {
        console.log(er);
        result = {
          status: "false",
          message: "Dharamasala failed to update",
        };
      });

    console.log(result);
    return result;
  };
  //ROOM Categories

  //getDetailsusingCategory

  getbyCategory = async (req) => {
    let { catg } = req.query;

    let data = await TblRoomCategory.findOne({
      where: {
        Name: catg,
      },
    });
    if (data) {
      return {
        statusCode: 200,
        message: "Success",
        data: data,
      };
    } else {
      return {
        statusCode: 404,
        message: "no data available",
        data: [],
      };
    }
  };

  getAvailableRoombyCategory = async (req) => {
    const { category, hotelName } = req.query;
    const currentDate = new Date();

    const [results] = await sequelize.query(`
  SELECT room.*, dharamsala.image1 AS dharamsalaImage
  FROM tbl_rooms room
  JOIN tbl_dharmasalas dharamsala ON room.dharmasala_id = dharamsala.dharmasala_id
  WHERE room.category_id LIKE '%${category}%'
    AND room.dharmasala_id = '${hotelName}'
`);

    let facilitiesCategory = results?.map((facility) => {
      facility.facility_id = JSON.parse(JSON.parse(facility.facility_id));
      facility.category_id = JSON.parse(JSON.parse(facility.category_id));
      return facility;
    });

    await Promise.all(
      facilitiesCategory.map(async (facility) => {
        const categories = await TblRoomCategory.findAll({
          where: { category_id: facility.category_id },
        });
        facility.category_name = categories.map((category) => category.name);

        const facilities = await TblFacility.findAll({
          where: { facility_id: facility.facility_id },
        });
        const dharmasala = await TblDharmasal.findOne({
          where: {
            dharmasala_id: facility.dharmasala_id,
          },
        });
        facility.dharmasala = dharmasala;
        facility.facility_name = facilities.map((facility) => facility.name);
      })
    );

    const roomRanges = facilitiesCategory.map((room) => ({
      from: room.FroomNo,
      to: room.TroomNo,
      ...room,
    }));

    // Generate a flat list of all room numbers
    const allRoomNumbers = roomRanges.reduce((result, range) => {
      const rangeNumbers = Array.from(
        { length: range.to - range.from + 1 },
        (_, i) => i + range.from
      );
      return [...result, ...rangeNumbers];
    }, []);

    // Find all rooms that are currently checked in or on hold
    const occupiedRooms = await TblCheckin.findAll({
      where: {
        RoomNo: {
          [Op.in]: allRoomNumbers,
        },
        [Op.and]: [
          { date: { [Op.lte]: currentDate } },
          { coutDate: { [Op.gte]: currentDate } },
        ],
      },
    });

    const onHoldRooms = await TblHoldin.findAll({
      where: {
        RoomNo: {
          [Op.in]: allRoomNumbers,
        },
        [Op.and]: [
          { since: { [Op.lte]: currentDate } },
          { remain: { [Op.gte]: currentDate } },
        ],
      },
    });

    // Get room numbers from occupied rooms and on hold rooms
    const occupiedRoomNumbers = occupiedRooms.map((room) => room.RoomNo);
    const onHoldRoomNumbers = onHoldRooms.map((room) => room.RoomNo);

    // Generate a list of available rooms
    const availableRooms = roomRanges.reduce((result, range) => {
      const rangeNumbers = Array.from(
        { length: range.to - range.from + 1 },
        (_, i) => i + range.from
      );
      const availableNumbers = rangeNumbers.filter(
        (number) =>
          !occupiedRoomNumbers.includes(number) &&
          !onHoldRoomNumbers.includes(number)
      );
      return [
        ...result,
        ...availableNumbers.map((number) => ({
          ...range,
          RoomNo: number,
        })),
      ];
    }, []);

    return {
      statusCode: 200,
      data: availableRooms,
    };
  };

  savePaymentDetailsofRoom = async (req) => {
    let result = "";
    console.log(req.body);
    result = await Tblch.update(
      {
        paymentid: req.body.PAYMENT_ID,
        paymentStatus: req.body.PAYMENT_STATUS == "Success" ? 1 : 0,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    );

    return result;
  };

  createBookingPara = async (req) => {};
}

module.exports = new RoomCollection();
