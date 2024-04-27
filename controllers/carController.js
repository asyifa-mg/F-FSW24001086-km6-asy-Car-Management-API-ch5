const { car, User } = require("../models");
const imagekit = require("../lib/imagekit");
const ApiError = require("../utils/ApiError");
const { Op } = require("sequelize");

const uploadImage = async (file) => {
  try {
    const split = file.originalname.split(".");
    const extension = split[split.length - 1];

    // upload file ke imagekit
    const uploadedImage = await imagekit.upload({
      file: file.buffer,
      fileName: `IMG-${Date.now()}.${extension}`,
    });

    if (!uploadedImage)
      return next(new ApiError("The server failed to upload the image", 500));

    return uploadedImage.url;
  } catch (err) {
    return err.message;
  }
};

const createCar = async (req, res, next) => {
  try {
    const { model, type, capacity, price } = req.body;

    const file = req.file;
    if (!model || !type || !capacity || !price || !file) {
      next(
        new ApiError(
          "model, type, capacity, price, dan image must be filled",
          400
        )
      );
    }
    let imageUrl;

    if (file) {
      imageUrl = await uploadImage(file);
    }

    const newCar = await car.create({
      model,
      type,
      capacity,
      price,
      createdBy: req.user.name,
      lastUpdatedBy: req.user.name,
      imageUrl,
    });

    if (!newCar)
      return next(new ApiError("Gagal membuat data mobil baru", 500));

    res.status(200).json({
      status: "Success",
      data: {
        newCar,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
  }
};

const findCars = async (req, res, next) => {
  try {
    const cars = await car.findAll({ paranoid: false });

    res.status(200).json({
      status: "Success",
      data: {
        cars,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
  }
};

const findCarById = async (req, res, next) => {
  try {
    const cars = await car.findByPk(req.params.id);

    if (!cars) return next(new ApiError("ID not found", 404));

    res.status(200).json({
      status: "Success",
      data: {
        cars,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
  }
};

const updateCar = async (req, res, next) => {
  try {
    const checkCar = await car.findByPk(req.params.id);

    if (!checkCar) return next(new ApiError("ID not found", 404));

    const { model, type, capacity, price } = req.body;
    const file = req.file;

    let imageUrl;

    if (file) {
      imageUrl = await uploadImage(file);
    }

    await car.update(
      {
        type,
        capacity,
        price,
        model,
        imageUrl,
        lastUpdatedBy: req.user.name,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    const updatedCar = await car.findByPk(req.params.id);

    res.status(200).json({
      status: "Success",
      message: "successful car update",
      data: updatedCar,
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
  }
};

const deleteCar = async (req, res, next) => {
  try {
    const cars = await car.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!cars) return next(new ApiError("the car ID was not found", 404));

    const deletedBy = await User.findByPk(req.user.id);

    await car.update(
      {
        deletedBy: deletedBy.name,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    await car.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      status: "Success",
      message: `successfully deleted car ID data: ${cars.id}`,
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
  }
};

const availableCars = async (req, res, next) => {
  const { name, model, maxPrice, minPrice } = req.query;
  try {
    if (minPrice && maxPrice && parseInt(minPrice) > parseInt(maxPrice))
      return next(
        new ApiError(
          "The minimum price cannot be greater than the maximum price",
          400
        )
      );

    let filterCondition = {};

    if (name) {
      filterCondition.name = {
        [Op.iLike]: `%${name}%`,
      };
    }

    if (model) {
      filterCondition.model = {
        [Op.iLike]: `%${model}%`,
      };
    }

    if (maxPrice && minPrice) {
      filterCondition.price = {
        [Op.between]: [minPrice, maxPrice],
      };
    } else if (maxPrice) {
      filterCondition.price = {
        [Op.lte]: maxPrice,
      };
    } else if (minPrice) {
      filterCondition.price = {
        [Op.gte]: minPrice,
      };
    }

    const cars = await car.findAll({ where: filterCondition });

    if (!cars) {
      next(new ApiError("Data not found", 404));
    }

    res.status(200).json({
      status: "Success",
      data: {
        cars,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
  }
};

module.exports = {
  createCar,
  findCars,
  findCarById,
  updateCar,
  deleteCar,
  availableCars,
};
