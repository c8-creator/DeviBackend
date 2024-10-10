const express = require('express');
const {
  loginUser,
  signupUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  searchUsersByName,
  signoutUser,
} = require('../controllers/userController');

const PagesController= require('../controllers/PagesController/PagesController')
const userBlockedPagesController= require('../controllers/PagesController/userBlockedPagesController')

const userAuthMiddleware = require('../middlewares/userAuthMiddleware');

const router = express.Router();

// User-related routes
router.post('/users/login', loginUser);      
router.post('/users/signup', signupUser);   
router.get('/users',userAuthMiddleware, getUsers);                     
router.get('/users/search',userAuthMiddleware, searchUsersByName);  
router.get('/users/:id',userAuthMiddleware, getUserById);            
router.post('/users/signout', userAuthMiddleware, signoutUser);
router.put('/users/update',userAuthMiddleware, updateUser);              
router.delete('/users/delete',userAuthMiddleware, deleteUser);



//account creation 
router.get('/users/getallpages',userAuthMiddleware,PagesController.getAllpages)
router.post('/users/addnewpage',userAuthMiddleware,PagesController.addNewPage)
router.patch ('/users/updatepage',userAuthMiddleware,PagesController.updatePage)
router.get ('/users/togglepagestatus/:pageId',userAuthMiddleware,PagesController.togglePageStatus)
router.get('/users/searchpages/:search',userAuthMiddleware,PagesController.searchPages)
router.get ('/users/getpage/:pageId',userAuthMiddleware,PagesController.getPage)

//page blocking

router.get('/users/blockpage/:userId/:pageId',
  userAuthMiddleware,userBlockedPagesController.updateUserBlockEntry)

module.exports = router;
