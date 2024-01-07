const Category = require("../models/Category");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

exports.createCategory = async (req, res) => {

    try {
        const {categoryName, description} = req.body;
        const thumbnail = req.files.thumbnailImage;

        // Validating is name, description and image is null or not
        if(!categoryName || !description || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Validating is the same category exist or not
        const checkCategoryExist = await Category.findOne({categoryName: categoryName});
        if(checkCategoryExist) {
            return res.status(400).json({
                success: false,
                message: "Category Already Exist"
            })
        }

        // Uploading Image to Cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
        console.log("Category Image Uploded : ", thumbnailImage);

        // Creating Category
        const categoryDetails = await Category.create({
            categoryName: categoryName,
            categoryImage: thumbnailImage.secure_url,
            description: description
        });

        console.log("Category Created : ", categoryDetails);

        return res.status(201).json({
            success: true,
            message: "Category Created Successfully",
            data: categoryDetails
        });
    
    } catch(error) {
        console.log("Error while creating category : ", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.fetchAllCategories = async (req, res) => {

    try {
        const categories = await Category.find(
            {},
            {categoryName: true, categoryImage: true, description: true}
        );

        res.status(200).json({
            success: true,
            message: "All Categories fetched successfully",
            data: categories
        });

    } catch(error) {
        console.log("Error while fetching categories : ", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.updateCategory = async (req, res) => {

    try {
        const {categoryId, categoryName, description} = req.body;

        // Validating is Category Id is exist or not in Request Body
        if(!categoryId) {
            return res.status(400).json({
                success: false,
                message: "Category Id is Required"
            });
        }

        // Validating is the category exist with id or not
        const category = await Category.findById(categoryId);
        if(!category) {
            return res.status(404).json({
                success: false,
                message: "Category Not Found"
            })
        }

        if(categoryName !== undefined) {
            category.categoryName = categoryName;
        }

        if(description !== undefined) {
            category.description = description;
        }

        if(req.files && req.files.thumbnailImage !== undefined) {
            const thumbnail = req.files.thumbnailImage;
            const thumbnailImage = await uploadImageToCloudinary(
                thumbnail, 
                process.env.FOLDER_NAME
            );
            // Uploading Image to Cloudinary
            console.log("Category Image Update Uploded : ", thumbnailImage);
            category.categoryImage = thumbnailImage.secure_url; 
        }
        
        // Updating category
        const updatedCategory = await category.save();
        console.log("Category Updated Successfully", updatedCategory);

        return res.status(200).json({
            success: true,
            message: "Category Updated Successfully",
            data: updatedCategory
        })

    } catch (error) {
        console.log("Error while updating category : ", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.deleteCategory = async (req, res) => {

    try {
        const {categoryId} = req.body;

        // Validating is Category Id is exist or not in Request Body
        if(!categoryId) {
            return res.status(400).json({
                success: false,
                message: "Category Id is Required"
            });
        }

        // Find and Delete the Category
        const category = await Category.findByIdAndDelete(
            {_id: categoryId}
        );

        if(!category) {
            return res.status(404).json({
                success: false,
                message: "Category Not Found"
            })
        }

        console.log("Category Deleted Successfully", category);

        return res.status(200).json({
            success: true,
            message: "Category Deleted Successfully"
        });
    } catch(error) {
        console.log("Error while deleting category : ", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}