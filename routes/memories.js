const router = require("express").Router();
const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");

//  create memory
router.put("/addMemories/:id", async (req, res) => {
  const memories = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      $addToSet: { memories: memories },
    });
    await user.save();
    res.status(200).send("successfull");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// get memory
router.get("/memory/:id", async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (user) {
      res.status(200).json(user.memories);
    } else {
      res.status(500).send("user not found");
    }
  } catch (err) {
    console.log(err.message);
  }
});

// get directory
router.get("/directory", async (req, res) => {
  res.send(__dirname);
});

// remove memory
router.put("/memory/:id/:memID", async (req, res) => {
  const id = req.params.id;
  try {
    let user = await User.updateOne(
      { _id: id },
      { $pull: { memories: { _id: req.params.memID } } }
    );
    if (user) {
      res.status(200).send("success");
    } else {
      res.status(500).send("user not found");
    }
  } catch (err) {
    console.log(err.message);
  }
});

// like memory
router.put("/memory/like/:id/:memId", async (req, res) => {
  const id = req.params.id;
    const memId = req.params.memId;
    try {
        let user = await User.findOne({ "_id": id, "memories._id": memId });
            if(user) {
                const memoryIndex = user.memories.findIndex(mem => mem._id.toString() === memId);
                if (memoryIndex !== -1) {
                  user.memories[memoryIndex].isLiked = !user.memories[memoryIndex].isLiked;
                  await user.save();
                  res.status(200).send("Success");
            } 
        }else {
                res.status(500).send("user not found");
            }
    } catch(err) {
        console.log(err.message);
    }
});

// like status

router.get("/memory/like/:id/:in", async (req, res) => {
  const id = req.params.id;
  try {
    let data = await User.findOne({ _id: id });
    if (data) {
      res.status(200).json(data.memories[req.params.in].isLiked);
    } else {
      res.status(500).send("memory not found");
    }
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
