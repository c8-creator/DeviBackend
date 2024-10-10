const User = require("../../models/User");
const Pages = require("../../models/Pages Model/PagesModel");
const UserBlockPages = require("../../models/Pages Model/userBlockedPagesModel");

const getAllpages = async (req, res) => {
  try {
    const allPages = await Pages.find();
    const blockedData = await UserBlockPages.findOne({ userId: req.userId });
    let filteredPages = allPages;
    if (blockedData) {
      filteredPages = allPages.filter((page) => {
        !blockedData.blockedList.includes(page._id.toString());
      });
      return res.status(200).json({success:true,data:filteredPages,message:''})
    }
  } catch (error) {
    console.error(error.message);
  }
};

const addNewPage = async (req, res) => {
  try {
    const {
      pageName,
      userName,
      Category,
      Phone,
      email,
      Bio,
      Website,
      isCreator,
      profileBackground
    } = req.body;

    const PageData = {
      pageName,
      userName,
      Category,
      Phone,
      email,
      Bio,
      Website,
      isCreator,
      profileBackground
    };
    const newPage = new Pages(PageData);
    const savePageData = await newPage.save();
    if (savePageData) {
      let setInUser = await User.findByIdAndUpdate(req.userId, {
        $push: { pages: savePageData._id },
      });
      if (setInUser) {
        return res.status(201).json({
          success: true,
          message: "Page created successfully",
          data: savePageData,
        });
      }else{
        return res.status(404).json({ message: "Page created Fail" });
      }
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server errror",
      error: error.message,
    });
  }
};
const updatePage = async (req, res) => {
  try {
    const allowedFields = [
      "pageName",
      "userName",
      "Category",
      "Phone",
      "email",
      "Bio",
      "Website",
      "isCreator",
    ];

    // Filter only the fields that are present in req.body
    const updateData = allowedFields.reduce((acc, field) => {
      if (req.body[field] !== undefined) {
        acc[field] = req.body[field];
      }
      return acc;
    }, {});
    const updatedPage = await Pages.findByIdAndUpdate(
      req.body.pageId,
      updateData,
      {
        new: true, // Return the updated document
      }
    );
   

    if (!updatedPage) {
      return res.status(404).json({ message: "Page  not found" });
    }

    return res.status(200).json({ success:true,message:"Page Updated successfully",data: updatedPage });
  } catch (error) {
    return res.status(500).json({ message: "Error updating user", error });
  }
};

const togglePageStatus = async (req, res) => {
  try {
    const pageId = req.params.pageId;

    const page = await Pages.findById(pageId);
    if (page) {
      const isUpdatedPage = await Pages.findByIdAndUpdate(
        pageId,
        { isActive: !page.isActive },
        { new: true }
      );
      if (isUpdatedPage) {
        let boo = isUpdatedPage.isActive ? "Activation" : "Deactivation";
        res
          .status(200)
          .json({ success: true, message: `the Page ${boo} is successfully` });
      }
    } else {
      res.status(404).json({ success: false, message: "Page not Found" });
    }
  } catch (error) {
    res.status(500).json({success: false, message: error.message });
  }
};

const searchPages = async (req, res) => {
  try {
    const search = req.params.search;
    const pages = await Pages.find({
      pageName: { $regex: new RegExp(search, "i") },
    });

    if (pages.length > 0) {
      const blockedData = await UserBlockPages.findOne({ userId: req.userId });
      let filteredPages = pages;
      if (blockedData) {
        filteredPages = pages.filter((page) => {
        return  !blockedData.blockedList.includes(page._id.toString());
        });
      }
      return res.status(200).json({ success: true, data: filteredPages });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Pages not found" });
    }
  } catch (error) {
    return res.status(500).json({success: false,  message: error.message });
  }
};

const getPage = async (req, res) => {
  try {
    const { pageId } = req.params;

    const page = await Pages.findById(pageId);
    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Page data fetched successfully",
      data: page,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllpages,
  addNewPage,
  updatePage,
  togglePageStatus,
  searchPages,
  getPage,
};
