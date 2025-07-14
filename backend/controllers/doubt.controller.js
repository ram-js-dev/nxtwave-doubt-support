import { io, getSocketId } from "../socket.js";

import Doubt from "../models/doubt.model.js";

export const fetchAllDoubts = async (req, res) => {
  const filter = { ...req.query };
  delete filter["sort"];
  let query = Doubt.find(filter);
  if (req.query.sort) query = query.sort(req.query.sort);
  const doubts = await query
    .populate({ path: "topic", select: { name: 1, liveURL: 1 } })
    .populate({ path: "postedBy", select: "username" })
    .lean();

  res.status(200).send({ message: "all doubts fetched", data: { doubts } });
};

export const createDoubt = async (req, res) => {
  const newDoubt = {
    ...req.body,
    postedBy: req.userId,
  };
  const doubt = await Doubt.create(newDoubt);

  const createdDoubt = await Doubt.findById(doubt._id)
    .populate({ path: "topic", select: { name: 1, liveURL: 1 } })
    .populate({ path: "postedBy", select: "username" })
    .lean();

  io.emit(createdDoubt.topic._id, "CREATE", createdDoubt);
  res.status(201).send({
    message: "New doubt created",
    data: {
      doubt: createdDoubt,
    },
  });
};

export const editDoubt = async (req, res) => {
  const { doubtId } = req.params;

  const doubt = await Doubt.findOneAndUpdate(
    { _id: doubtId, postedBy: req.userId },
    req.body,
    { new: true }
  )
    .populate({ path: "topic", select: { name: 1, liveURL: 1 } })
    .populate({ path: "postedBy", select: "username" })
    .lean();

  if (doubt === null) {
    res.status(404).send({ message: "doubt not found" });
  } else {
    io.emit(doubt.topic._id, "UPDATE", doubt);
    res.status(200).send({
      message: "Doubt updated successfully",
      data: {
        doubt,
      },
    });
  }
};

export const patchDoubt = async (req, res) => {
  const { doubtId } = req.params;

  const doubt = await Doubt.findOneAndUpdate({ _id: doubtId }, req.body, {
    new: true,
  })
    .populate({ path: "topic", select: { name: 1, liveURL: 1 } })
    .populate({ path: "postedBy", select: "username" })
    .lean();

  if (doubt === null) {
    res.status(404).send({ message: "doubt not found" });
  } else {
    const { isInvited } = req.body;

    if (isInvited === true) {
      const socketId = getSocketId(doubt.postedBy._id.toString());

      if (socketId) io.to(socketId).emit("invite", doubt);
    } else if (isInvited === false) {
      const socketId = getSocketId(doubt.postedBy._id.toString());

      if (socketId) io.to(socketId).emit("un-invite", doubt);
    }

    res.status(200).send({
      data: {
        doubt,
      },
    });
  }
};

export const deleteDoubt = async (req, res) => {
  const { doubtId } = req.params;
  const doubt = await Doubt.findOneAndDelete({
    _id: doubtId,
    postedBy: req.userId,
  })
    .populate({ path: "topic", select: { name: 1, liveURL: 1 } })
    .populate({ path: "postedBy", select: "username" })
    .lean();
  if (doubt === null) {
    res.status(404).send({ message: "doubt not found" });
  } else {
    io.emit(doubt.topic._id, "DELETE", doubt);
    res.sendStatus(204);
  }
};
